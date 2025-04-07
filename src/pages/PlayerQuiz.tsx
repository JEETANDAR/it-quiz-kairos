
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
import { HourglassIcon, Award, Check, X } from "lucide-react";

enum PlayerView {
  WAITING,
  QUESTION,
  ANSWER_SUBMITTED,
  LEADERBOARD,
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

  useEffect(() => {
    if (!gameId) {
      navigate("/");
      return;
    }

    const playerString = sessionStorage.getItem("currentPlayer");
    if (!playerString) {
      navigate("/");
      return;
    }

    try {
      const player = JSON.parse(playerString);
      if (player.gameId !== gameId) {
        navigate("/");
        return;
      }
      
      setCurrentPlayer(player);
      
      const session = getGameSessionById(gameId);
      if (!session) {
        toast({
          title: "Game not found",
          description: "The game you're trying to join doesn't exist anymore",
          variant: "destructive"
        });
        navigate("/");
        return;
      }
      
      setGameSession(session);
      
      const quizData = getQuizById(session.quizId);
      if (!quizData) {
        toast({
          title: "Quiz data error",
          description: "Could not load the quiz data",
          variant: "destructive"
        });
        navigate("/");
        return;
      }
      
      setQuiz(quizData);
      
      if (session.status === "waiting") {
        setPlayerView(PlayerView.WAITING);
      } else if (session.status === "active") {
        const playerObj = session.players.find(p => p.id === player.playerId);
        if (playerObj) {
          const hasAnsweredCurrent = playerObj.answers.some(
            a => a.questionIndex === session.currentQuestionIndex
          );
          
          if (hasAnsweredCurrent) {
            setPlayerView(PlayerView.ANSWER_SUBMITTED);
            
            // Get the answer to show correct/incorrect feedback
            const currentAnswer = playerObj.answers.find(a => a.questionIndex === session.currentQuestionIndex);
            if (currentAnswer) {
              setAnswerCorrect(currentAnswer.correct);
              setPointsEarned(currentAnswer.points);
              setSelectedAnswer(currentAnswer.answerIndex);
            }
          } else {
            // Use selectedQuestions if available
            if (session.selectedQuestions && session.selectedQuestions.length > 0) {
              setCurrentQuestion(session.selectedQuestions[session.currentQuestionIndex]);
            } else {
              setCurrentQuestion(quizData.questions[session.currentQuestionIndex]);
            }
            setPlayerView(PlayerView.QUESTION);
            setAnswerTime(Date.now());
          }
        } else {
          // Player not found in session, redirect to home
          sessionStorage.removeItem("currentPlayer");
          navigate("/");
        }
      } else if (session.status === "finished") {
        setPlayerView(PlayerView.FINAL_RESULTS);
      }
    } catch (error) {
      console.error("Error loading player session:", error);
      navigate("/");
    }
  }, [gameId, navigate, toast]);

  useEffect(() => {
    if (!gameId || !currentPlayer) return;
    
    const interval = window.setInterval(() => {
      // Get fresh data directly from localStorage for accurate updates
      const updatedSession = getGameSessionById(gameId);
      
      if (!updatedSession) {
        clearInterval(interval);
        toast({
          title: "Game ended",
          description: "The host has ended the game session",
        });
        sessionStorage.removeItem("currentPlayer");
        navigate("/");
        return;
      }
      
      // Always update the game session to ensure scores are current
      setGameSession(updatedSession);
      
      // Check if player still exists in the session
      const playerExists = updatedSession.players.some(p => p.id === currentPlayer.playerId);
      if (!playerExists) {
        clearInterval(interval);
        toast({
          title: "Team removed",
          description: "Your team has been removed from the game",
        });
        sessionStorage.removeItem("currentPlayer");
        navigate("/");
        return;
      }
      
      if (updatedSession.status === "active" && playerView === PlayerView.WAITING) {
        // Game just started
        // Use selectedQuestions if available
        if (updatedSession.selectedQuestions && updatedSession.selectedQuestions.length > 0) {
          setCurrentQuestion(updatedSession.selectedQuestions[updatedSession.currentQuestionIndex]);
        } else if (quiz) {
          setCurrentQuestion(quiz.questions[updatedSession.currentQuestionIndex]);
        }
        setPlayerView(PlayerView.QUESTION);
        setAnswerTime(Date.now());
        setSelectedAnswer(null);
      } else if (updatedSession.status === "active" && 
                gameSession?.currentQuestionIndex !== updatedSession.currentQuestionIndex) {
        // New question
        // Use selectedQuestions if available
        if (updatedSession.selectedQuestions && updatedSession.selectedQuestions.length > 0) {
          setCurrentQuestion(updatedSession.selectedQuestions[updatedSession.currentQuestionIndex]);
        } else if (quiz) {
          setCurrentQuestion(quiz.questions[updatedSession.currentQuestionIndex]);
        }
        
        // Check if player has already answered this question (in case of reconnect)
        const playerObj = updatedSession.players.find(p => p.id === currentPlayer.playerId);
        const hasAnsweredCurrent = playerObj?.answers.some(
          a => a.questionIndex === updatedSession.currentQuestionIndex
        );
        
        if (hasAnsweredCurrent) {
          setPlayerView(PlayerView.ANSWER_SUBMITTED);
          
          // Get the answer to show correct/incorrect feedback
          const currentAnswer = playerObj?.answers.find(a => a.questionIndex === updatedSession.currentQuestionIndex);
          if (currentAnswer) {
            setAnswerCorrect(currentAnswer.correct);
            setPointsEarned(currentAnswer.points);
            setSelectedAnswer(currentAnswer.answerIndex);
          }
        } else {
          setPlayerView(PlayerView.QUESTION);
          setAnswerTime(Date.now());
          setSelectedAnswer(null);
          setAnswerCorrect(null);
          setPointsEarned(0);
        }
      } else if (updatedSession.status === "finished" && gameSession?.status !== "finished") {
        setPlayerView(PlayerView.FINAL_RESULTS);
      }
    }, 500); // More frequent updates for better responsiveness
    
    setSessionRefreshInterval(interval);
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameId, currentPlayer, gameSession, quiz, playerView, navigate, toast]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (!gameSession || !currentPlayer || !currentQuestion || !answerTime) return;
    
    setSelectedAnswer(answerIndex);
    
    const timeToAnswer = (Date.now() - answerTime) / 1000;
    
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
      
      // Update the game session to reflect the new answer
      const updatedSession = getGameSessionById(gameSession.id);
      if (updatedSession) {
        setGameSession(updatedSession);
      }

      const sound = new Audio(answer.correct ? '/correct.mp3' : '/incorrect.mp3');
      sound.play().catch((err) => {
        console.log("Error playing sound:", err);
      });
    } else {
      toast({
        title: "Error submitting answer",
        description: "There was a problem submitting your answer",
        variant: "destructive"
      });
    }
  };

  const handleToggleView = () => {
    if (playerView === PlayerView.ANSWER_SUBMITTED) {
      setPlayerView(PlayerView.LEADERBOARD);
    } else if (playerView === PlayerView.LEADERBOARD) {
      setPlayerView(PlayerView.ANSWER_SUBMITTED);
    }
  };

  const handleLeaveGame = () => {
    sessionStorage.removeItem("currentPlayer");
    navigate("/");
  };

  const renderView = () => {
    switch (playerView) {
      case PlayerView.WAITING:
        return renderWaiting();
      case PlayerView.QUESTION:
        return renderQuestion();
      case PlayerView.ANSWER_SUBMITTED:
        return renderAnswerSubmitted();
      case PlayerView.LEADERBOARD:
        return renderLeaderboard();
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
          <h2 className="text-xl font-semibold mb-4 text-white">Waiting for host to start</h2>
          <div className="flex justify-center items-center py-8">
            <HourglassIcon className="h-12 w-12 text-blue-500 animate-pulse-soft" />
          </div>
          <p className="text-gray-300 mb-1">
            Teams in lobby: <span className="font-semibold">{playerCount}</span>
          </p>
        </AnimatedContainer>
        
        <AnimatedContainer delay={100} className="text-center">
          <p className="text-gray-300 mb-4">
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
          <h2 className="text-2xl font-semibold mb-2 text-high-contrast">Choose your answer</h2>
          <p className="text-muted-foreground">
            Faster answers get more points!
          </p>
        </AnimatedContainer>
        
        <QuestionCard
          question={currentQuestion}
          onAnswer={handleAnswerSelect}
          playerView={true}
        />
      </div>
    );
  };

  const renderAnswerSubmitted = () => {
    if (!gameSession || !currentPlayer) return null;
    
    return (
      <div className="max-w-md mx-auto">
        <AnimatedContainer className="glass rounded-xl p-8 text-center">
          <div className="mb-6">
            {answerCorrect === true ? (
              <>
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-12 w-12 text-green-500" />
                </div>
                <h2 className="text-2xl font-semibold text-green-500 mb-2">Correct!</h2>
                <p className="text-xl font-bold mb-4 score-animate">+{pointsEarned} points</p>
              </>
            ) : answerCorrect === false ? (
              <>
                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="h-12 w-12 text-red-500" />
                </div>
                <h2 className="text-2xl font-semibold text-red-500 mb-2">Incorrect</h2>
                <p className="text-xl mb-4 text-high-contrast">Better luck next time!</p>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-12 w-12 text-blue-500" />
                </div>
                <h2 className="text-2xl font-semibold mb-2 text-high-contrast">Answer received!</h2>
              </>
            )}
          </div>
          
          <p className="text-muted-foreground mb-4">
            Waiting for next question...
          </p>
          
          <div className="mt-4 flex justify-center items-center py-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse-soft mx-1"></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse-soft mx-1" style={{ animationDelay: "0.2s" }}></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse-soft mx-1" style={{ animationDelay: "0.4s" }}></div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={handleToggleView}
            className="mt-6"
            size="sm"
          >
            See Scores
          </Button>
        </AnimatedContainer>
      </div>
    );
  };

  const renderLeaderboard = () => {
    if (!gameSession || !currentPlayer) return null;
    
    // Get the current player data
    const player = gameSession.players.find(p => p.id === currentPlayer.playerId);
    if (!player) return null;
    
    return (
      <div className="max-w-md mx-auto">
        <AnimatedContainer className="glass rounded-xl p-8 text-center mb-6">
          <h3 className="text-xl font-semibold text-high-contrast mb-4">Your Score</h3>
          
          <div className="mb-6">
            <p className="text-3xl font-bold text-high-contrast">{player.totalPoints} points</p>
          </div>
          
          <div className="flex justify-center mb-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary/50 p-3 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Correct Answers</p>
                <p className="text-lg font-semibold text-green-400">
                  {player.answers.filter(a => a.correct).length}
                </p>
              </div>
              <div className="bg-secondary/50 p-3 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Questions</p>
                <p className="text-lg font-semibold text-high-contrast">
                  {player.answers.length}
                </p>
              </div>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={handleToggleView} 
            className="mt-6"
            size="sm"
          >
            Back
          </Button>
        </AnimatedContainer>
      </div>
    );
  };

  const renderFinalResults = () => {
    if (!gameSession || !currentPlayer) return null;
    
    const player = gameSession.players.find(p => p.id === currentPlayer.playerId);
    if (!player) return null;
    
    return (
      <div className="max-w-md mx-auto">
        <AnimatedContainer className="glass rounded-xl p-8 text-center mb-6">
          <div className="mb-4">
            <Award className="h-16 w-16 mx-auto mb-4 text-quiz-yellow" />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-high-contrast">Thank you for Playing!</h2>
          
          <div className="py-6">
            <p className="text-xl font-semibold mb-6 text-high-contrast">
              You scored {player.totalPoints} points
            </p>
            
            <div className="mb-4">
              <p className="text-muted-foreground mb-1">Correct answers</p>
              <p className="text-2xl font-semibold text-high-contrast">
                {player.answers.filter(a => a.correct).length}/{player.answers.length}
              </p>
            </div>
          </div>
        </AnimatedContainer>
        
        <AnimatedContainer delay={100} className="flex flex-col sm:flex-row gap-4 justify-center">
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
          <h1 className="text-3xl font-bold mb-2 text-high-contrast">
            {quiz?.title || "Quiz Game"}
          </h1>
        </AnimatedContainer>
        
        {renderView()}
      </div>
    </div>
  );
};

export default PlayerQuiz;
