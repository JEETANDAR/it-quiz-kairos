
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@/components/Button";
import AnimatedContainer from "@/components/AnimatedContainer";
import QuestionCard from "@/components/QuestionCard";
import { cn } from "@/lib/utils";
import {
  getGameSessionById,
  getQuizById,
  submitAnswer,
  GameSession,
  Quiz,
  Question,
  Player
} from "@/lib/quizStore";
import { useToast } from "@/hooks/use-toast";

enum PlayerView {
  WAITING,
  QUESTION,
  ANSWER_SUBMITTED,
  FINAL_RESULTS
}

const PlayerQuiz = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [playerView, setPlayerView] = useState<PlayerView>(PlayerView.WAITING);
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerTime, setAnswerTime] = useState<number | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<{gameId: string; playerId: string; playerName: string} | null>(null);
  const [sessionRefreshInterval, setSessionRefreshInterval] = useState<number | null>(null);
  const [answerCorrect, setAnswerCorrect] = useState<boolean | null>(null);
  const [pointsEarned, setPointsEarned] = useState<number>(0);

  // Initialize player session
  useEffect(() => {
    if (!gameId) {
      navigate("/join");
      return;
    }

    // Get player info from session storage
    const playerString = sessionStorage.getItem("currentPlayer");
    if (!playerString) {
      navigate("/join");
      return;
    }

    try {
      const player = JSON.parse(playerString);
      if (player.gameId !== gameId) {
        navigate("/join");
        return;
      }
      
      setCurrentPlayer(player);
      
      // Load initial game state
      const session = getGameSessionById(gameId);
      if (!session) {
        toast({
          title: "Game not found",
          description: "The game you're trying to join doesn't exist anymore",
          variant: "destructive"
        });
        navigate("/join");
        return;
      }
      
      setGameSession(session);
      
      // Load quiz data
      const quizData = getQuizById(session.quizId);
      if (!quizData) {
        toast({
          title: "Quiz data error",
          description: "Could not load the quiz data",
          variant: "destructive"
        });
        navigate("/join");
        return;
      }
      
      setQuiz(quizData);
      
      // Set the appropriate view based on game state
      if (session.status === "waiting") {
        setPlayerView(PlayerView.WAITING);
      } else if (session.status === "active") {
        // Check if player has already answered current question
        const playerObj = session.players.find(p => p.id === player.playerId);
        if (playerObj) {
          const hasAnsweredCurrent = playerObj.answers.some(
            a => a.questionIndex === session.currentQuestionIndex
          );
          
          if (hasAnsweredCurrent) {
            setPlayerView(PlayerView.ANSWER_SUBMITTED);
          } else {
            setCurrentQuestion(quizData.questions[session.currentQuestionIndex]);
            setPlayerView(PlayerView.QUESTION);
            setAnswerTime(Date.now());
          }
        } else {
          // Player not found in session
          navigate("/join");
        }
      } else if (session.status === "finished") {
        setPlayerView(PlayerView.FINAL_RESULTS);
      }
    } catch (error) {
      console.error("Error loading player session:", error);
      navigate("/join");
    }
  }, [gameId, navigate, toast]);

  // Set up polling to refresh game state
  useEffect(() => {
    if (!gameId || !currentPlayer) return;
    
    const interval = window.setInterval(() => {
      const updatedSession = getGameSessionById(gameId);
      
      if (!updatedSession) {
        // Game no longer exists
        clearInterval(interval);
        toast({
          title: "Game ended",
          description: "The host has ended the game session",
        });
        sessionStorage.removeItem("currentPlayer");
        navigate("/join");
        return;
      }
      
      // Only update if there's a change
      if (JSON.stringify(updatedSession) !== JSON.stringify(gameSession)) {
        setGameSession(updatedSession);
        
        // Handle game state changes
        if (updatedSession.status === "active" && playerView === PlayerView.WAITING) {
          // Game just started
          if (quiz) {
            setCurrentQuestion(quiz.questions[updatedSession.currentQuestionIndex]);
            setPlayerView(PlayerView.QUESTION);
            setAnswerTime(Date.now());
            setSelectedAnswer(null);
          }
        } else if (updatedSession.status === "active" && 
                  gameSession?.currentQuestionIndex !== updatedSession.currentQuestionIndex) {
          // New question
          if (quiz) {
            setCurrentQuestion(quiz.questions[updatedSession.currentQuestionIndex]);
            setPlayerView(PlayerView.QUESTION);
            setAnswerTime(Date.now());
            setSelectedAnswer(null);
            setAnswerCorrect(null);
            setPointsEarned(0);
          }
        } else if (updatedSession.status === "finished" && gameSession?.status !== "finished") {
          // Game just ended
          setPlayerView(PlayerView.FINAL_RESULTS);
        }
      }
    }, 1000);
    
    setSessionRefreshInterval(interval);
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameId, currentPlayer, gameSession, quiz, playerView, navigate, toast]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (!gameSession || !currentPlayer || !currentQuestion || !answerTime) return;
    
    setSelectedAnswer(answerIndex);
    
    // Calculate time to answer
    const timeToAnswer = (Date.now() - answerTime) / 1000;
    
    // Submit answer
    const answer = submitAnswer(
      gameSession.id,
      currentPlayer.playerId,
      answerIndex,
      timeToAnswer
    );
    
    if (answer) {
      setAnswerCorrect(answer.correct);
      setPointsEarned(answer.points);
      setPlayerView(PlayerView.ANSWER_SUBMITTED);
      
      // Refresh player data
      const updatedSession = getGameSessionById(gameSession.id);
      if (updatedSession) {
        setGameSession(updatedSession);
      }
    } else {
      toast({
        title: "Error submitting answer",
        description: "There was a problem submitting your answer",
        variant: "destructive"
      });
    }
  };

  const handleLeaveGame = () => {
    sessionStorage.removeItem("currentPlayer");
    navigate("/");
  };

  // Render different views based on game state
  const renderView = () => {
    switch (playerView) {
      case PlayerView.WAITING:
        return renderWaiting();
      case PlayerView.QUESTION:
        return renderQuestion();
      case PlayerView.ANSWER_SUBMITTED:
        return renderAnswerSubmitted();
      case PlayerView.FINAL_RESULTS:
        return renderFinalResults();
      default:
        return null;
    }
  };

  const renderWaiting = () => {
    if (!gameSession || !currentPlayer) return null;
    
    const playerCount = gameSession.players.length;
    
    return (
      <div className="max-w-md mx-auto">
        <AnimatedContainer className="glass rounded-xl p-6 mb-6 text-center">
          <h2 className="text-xl font-semibold mb-4">Waiting for host to start</h2>
          <div className="flex justify-center items-center py-8">
            <div className="w-16 h-16 relative animate-pulse-soft">
              <div className="absolute inset-0 bg-blue-400 rounded-full opacity-25"></div>
              <div className="absolute inset-2 bg-blue-500 rounded-full opacity-50"></div>
              <div className="absolute inset-4 bg-blue-600 rounded-full opacity-75"></div>
              <div className="absolute inset-6 bg-blue-700 rounded-full"></div>
            </div>
          </div>
          <p className="text-gray-600 mb-1">
            Game code: <span className="font-semibold">{gameSession.id}</span>
          </p>
          <p className="text-gray-600">
            Players in lobby: <span className="font-semibold">{playerCount}</span>
          </p>
        </AnimatedContainer>
        
        <AnimatedContainer delay={100} className="text-center">
          <p className="text-gray-600 mb-4">
            Playing as <span className="font-semibold">{currentPlayer.playerName}</span>
          </p>
          <Button variant="outline" onClick={handleLeaveGame}>
            Leave Game
          </Button>
        </AnimatedContainer>
      </div>
    );
  };

  const renderQuestion = () => {
    if (!currentQuestion) return null;
    
    return (
      <div className="max-w-4xl mx-auto">
        <AnimatedContainer className="text-center mb-6">
          <h2 className="text-2xl font-semibold mb-2">Choose your answer</h2>
          <p className="text-gray-600">
            Faster answers get more points!
          </p>
        </AnimatedContainer>
        
        <QuestionCard
          question={currentQuestion}
          onAnswer={handleAnswerSelect}
        />
      </div>
    );
  };

  const renderAnswerSubmitted = () => {
    return (
      <div className="max-w-md mx-auto">
        <AnimatedContainer className="glass rounded-xl p-8 text-center">
          <div className="mb-6">
            {answerCorrect === true ? (
              <>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-green-600 mb-2">Correct!</h2>
                <p className="text-xl font-bold mb-4">+{pointsEarned} points</p>
              </>
            ) : answerCorrect === false ? (
              <>
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-red-600 mb-2">Incorrect</h2>
                <p className="text-xl mb-4">Better luck next time!</p>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold mb-2">Answer received!</h2>
              </>
            )}
          </div>
          
          <p className="text-gray-600">
            Waiting for next question...
          </p>
          
          <div className="mt-8 flex justify-center items-center py-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse-soft mx-1"></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse-soft mx-1" style={{ animationDelay: "0.2s" }}></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse-soft mx-1" style={{ animationDelay: "0.4s" }}></div>
          </div>
        </AnimatedContainer>
      </div>
    );
  };

  const renderFinalResults = () => {
    if (!gameSession || !currentPlayer) return null;
    
    // Find current player's result
    const player = gameSession.players.find(p => p.id === currentPlayer.playerId);
    if (!player) return null;
    
    // Get player ranking
    const sortedPlayers = [...gameSession.players].sort((a, b) => b.totalPoints - a.totalPoints);
    const playerRank = sortedPlayers.findIndex(p => p.id === player.id) + 1;
    
    return (
      <div className="max-w-md mx-auto">
        <AnimatedContainer className="glass rounded-xl p-8 text-center mb-6">
          <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
          
          <div className="py-6">
            <p className="text-gray-600 mb-2">You finished</p>
            <div className={cn(
              "text-4xl font-bold mb-2",
              playerRank === 1 ? "text-quiz-yellow" :
              playerRank === 2 ? "text-blue-500" :
              playerRank === 3 ? "text-orange-500" : ""
            )}>
              {playerRank === 1 ? "1st" :
               playerRank === 2 ? "2nd" :
               playerRank === 3 ? "3rd" :
               `${playerRank}th`}
            </div>
            <p className="text-xl font-semibold mb-6">
              {player.totalPoints} points
            </p>
            
            <div className="mb-4">
              <p className="text-gray-600 mb-1">Correct answers</p>
              <p className="text-2xl font-semibold">
                {player.answers.filter(a => a.correct).length}/{player.answers.length}
              </p>
            </div>
          </div>
        </AnimatedContainer>
        
        <AnimatedContainer delay={100} className="text-center">
          <Button onClick={handleLeaveGame} size="lg">
            Play Again
          </Button>
        </AnimatedContainer>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <AnimatedContainer className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {quiz?.title || "Quiz Game"}
          </h1>
        </AnimatedContainer>
        
        {renderView()}
      </div>
    </div>
  );
};

export default PlayerQuiz;
