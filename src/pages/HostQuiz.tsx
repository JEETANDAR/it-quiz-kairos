
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@/components/Button";
import AnimatedContainer from "@/components/AnimatedContainer";
import Timer from "@/components/Timer";
import QuestionCard from "@/components/QuestionCard";
import { 
  getQuizById, 
  getGameSessionById, 
  createGameSession, 
  startGame,
  advanceQuestion,
  endGame,
  Quiz,
  GameSession,
  Question
} from "@/lib/quizStore";
import { useToast } from "@/hooks/use-toast";

enum HostView {
  LOBBY,
  QUESTION,
  QUESTION_RESULTS,
  FINAL_RESULTS
}

const HostQuiz = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [hostView, setHostView] = useState<HostView>(HostView.LOBBY);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [lobbyRefreshInterval, setLobbyRefreshInterval] = useState<number | null>(null);
  const [timerActive, setTimerActive] = useState(false);

  // Initialize or fetch game session
  useEffect(() => {
    if (!quizId) {
      navigate("/my-quizzes");
      return;
    }

    const fetchQuiz = () => {
      const loadedQuiz = getQuizById(quizId);
      
      if (!loadedQuiz) {
        toast({
          title: "Quiz not found",
          description: "The quiz you're trying to host doesn't exist",
          variant: "destructive"
        });
        navigate("/my-quizzes");
        return;
      }
      
      setQuiz(loadedQuiz);
    };

    const initializeGameSession = () => {
      // Check if host already has a session for this quiz
      const sessionString = sessionStorage.getItem("hostSession");
      
      if (sessionString) {
        try {
          const savedSession = JSON.parse(sessionString);
          
          if (savedSession.quizId === quizId) {
            // Fetch the latest session data
            const currentSession = getGameSessionById(savedSession.gameId);
            
            if (currentSession) {
              setGameSession(currentSession);
              
              // Determine the correct view based on session status
              if (currentSession.status === "waiting") {
                setHostView(HostView.LOBBY);
              } else if (currentSession.status === "active") {
                setHostView(HostView.QUESTION);
                const currentQ = quiz?.questions[currentSession.currentQuestionIndex];
                if (currentQ) setCurrentQuestion(currentQ);
              } else if (currentSession.status === "finished") {
                setHostView(HostView.FINAL_RESULTS);
              }
              
              return;
            }
          }
        } catch (error) {
          console.error("Error parsing saved session:", error);
        }
      }
      
      // No valid existing session, create a new one
      const newSession = createGameSession(quizId);
      setGameSession(newSession);
      
      // Save the session info
      sessionStorage.setItem("hostSession", JSON.stringify({
        gameId: newSession.id,
        quizId
      }));
    };

    fetchQuiz();
    initializeGameSession();
  }, [quizId, navigate, toast]);

  // Set up a polling interval to refresh the player list in the lobby
  useEffect(() => {
    if (hostView === HostView.LOBBY && gameSession) {
      const interval = window.setInterval(() => {
        const updatedSession = getGameSessionById(gameSession.id);
        if (updatedSession) {
          setGameSession(updatedSession);
        }
      }, 2000);
      
      setLobbyRefreshInterval(interval);
      
      return () => {
        clearInterval(interval);
      };
    } else if (lobbyRefreshInterval) {
      clearInterval(lobbyRefreshInterval);
      setLobbyRefreshInterval(null);
    }
  }, [hostView, gameSession]);

  const handleStartGame = () => {
    if (!gameSession) return;
    
    if (gameSession.players.length === 0) {
      toast({
        title: "No players",
        description: "Wait for players to join before starting the game",
        variant: "destructive"
      });
      return;
    }
    
    const updatedSession = startGame(gameSession.id);
    
    if (updatedSession) {
      setGameSession(updatedSession);
      const firstQuestion = quiz?.questions[0];
      if (firstQuestion) {
        setCurrentQuestion(firstQuestion);
        setHostView(HostView.QUESTION);
        setTimerActive(true);
      }
    }
  };

  const handleNextQuestion = () => {
    if (!gameSession) return;
    
    const nextQuestionIndex = advanceQuestion(gameSession.id);
    
    if (nextQuestionIndex === null) {
      toast({
        title: "Error",
        description: "Failed to advance to the next question",
        variant: "destructive"
      });
      return;
    }
    
    // Game is finished
    if (nextQuestionIndex === -1) {
      const finalSession = getGameSessionById(gameSession.id);
      if (finalSession) {
        setGameSession(finalSession);
        setHostView(HostView.FINAL_RESULTS);
      }
      return;
    }
    
    // Load next question
    const nextQuestion = quiz?.questions[nextQuestionIndex];
    if (nextQuestion) {
      setCurrentQuestion(nextQuestion);
      setHostView(HostView.QUESTION);
      setTimerActive(true);
      
      // Update session data
      const updatedSession = getGameSessionById(gameSession.id);
      if (updatedSession) {
        setGameSession(updatedSession);
      }
    }
  };

  const handleTimeUp = () => {
    setTimerActive(false);
    setHostView(HostView.QUESTION_RESULTS);
  };

  const handleEndGame = () => {
    if (!gameSession) return;
    
    endGame(gameSession.id);
    sessionStorage.removeItem("hostSession");
    navigate("/my-quizzes");
  };

  // Render different views based on game state
  const renderView = () => {
    switch (hostView) {
      case HostView.LOBBY:
        return renderLobby();
      case HostView.QUESTION:
        return renderQuestion();
      case HostView.QUESTION_RESULTS:
        return renderQuestionResults();
      case HostView.FINAL_RESULTS:
        return renderFinalResults();
      default:
        return null;
    }
  };

  const renderLobby = () => {
    if (!gameSession) return null;
    
    return (
      <div className="max-w-2xl mx-auto">
        <AnimatedContainer className="glass rounded-xl p-6 mb-6 text-center">
          <h2 className="text-xl font-semibold mb-4">Game Code</h2>
          <div className="text-4xl font-bold tracking-widest bg-secondary py-3 px-6 rounded-lg mb-4">
            {gameSession.id}
          </div>
          <p className="text-gray-600">
            Share this code with players to join the game
          </p>
        </AnimatedContainer>

        <AnimatedContainer delay={100} className="glass rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Players ({gameSession.players.length})</h2>
            <Button 
              onClick={handleStartGame}
              disabled={gameSession.players.length === 0}
            >
              Start Game
            </Button>
          </div>
          
          {gameSession.players.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Waiting for players to join...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {gameSession.players.map((player, index) => (
                <AnimatedContainer 
                  key={player.id} 
                  delay={150 + (index * 50)}
                  className="bg-secondary p-3 rounded-lg text-center"
                >
                  <span className="font-medium">{player.name}</span>
                </AnimatedContainer>
              ))}
            </div>
          )}
        </AnimatedContainer>

        <AnimatedContainer delay={200} className="flex justify-between">
          <Button variant="outline" onClick={() => navigate("/my-quizzes")}>
            Cancel
          </Button>
        </AnimatedContainer>
      </div>
    );
  };

  const renderQuestion = () => {
    if (!currentQuestion) return null;
    
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <AnimatedContainer>
            <h2 className="text-2xl font-semibold">
              Question {gameSession?.currentQuestionIndex !== undefined 
                ? gameSession.currentQuestionIndex + 1 
                : ""}
              {quiz ? ` of ${quiz.questions.length}` : ""}
            </h2>
          </AnimatedContainer>
          
          <AnimatedContainer delay={100}>
            <Timer 
              duration={currentQuestion.timeLimit || 20}
              onTimeUp={handleTimeUp}
              isActive={timerActive}
            />
          </AnimatedContainer>
        </div>
        
        <QuestionCard
          question={currentQuestion}
          onAnswer={() => {}}
          isHost={true}
        />
      </div>
    );
  };

  const renderQuestionResults = () => {
    if (!currentQuestion || !gameSession) return null;
    
    // Calculate results for current question
    const playerAnswers = gameSession.players.flatMap(player => 
      player.answers.filter(a => a.questionIndex === gameSession.currentQuestionIndex)
    );
    
    const totalResponses = playerAnswers.length;
    const correctResponses = playerAnswers.filter(a => a.correct).length;
    
    // Count answers per option
    const answerCounts = [0, 0, 0, 0];
    playerAnswers.forEach(answer => {
      if (answer.answerIndex >= 0 && answer.answerIndex < 4) {
        answerCounts[answer.answerIndex]++;
      }
    });
    
    return (
      <div className="max-w-4xl mx-auto">
        <AnimatedContainer className="glass rounded-xl p-6 mb-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Question Results</h2>
          <div className="flex justify-center gap-8 mb-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Responses</p>
              <p className="text-3xl font-bold">{totalResponses}/{gameSession.players.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Correct</p>
              <p className="text-3xl font-bold text-green-600">
                {totalResponses > 0 
                  ? Math.round((correctResponses / totalResponses) * 100)
                  : 0}%
              </p>
            </div>
          </div>
        </AnimatedContainer>
        
        <QuestionCard
          question={currentQuestion}
          onAnswer={() => {}}
          answered={true}
          correctAnswer={currentQuestion.correctOptionIndex}
          isHost={true}
        />
        
        <AnimatedContainer delay={200} className="mt-8 flex justify-end">
          <Button onClick={handleNextQuestion}>
            {gameSession.currentQuestionIndex < (quiz?.questions.length || 0) - 1
              ? "Next Question"
              : "See Final Results"}
          </Button>
        </AnimatedContainer>
      </div>
    );
  };

  const renderFinalResults = () => {
    if (!gameSession) return null;
    
    // Sort players by total points (highest first)
    const sortedPlayers = [...gameSession.players].sort((a, b) => b.totalPoints - a.totalPoints);
    
    return (
      <div className="max-w-3xl mx-auto">
        <AnimatedContainer className="glass rounded-xl p-6 mb-8 text-center">
          <h2 className="text-3xl font-bold mb-2">Final Results</h2>
          <p className="text-gray-600 mb-6">
            {quiz?.title} • {quiz?.questions.length} questions
          </p>
          
          {sortedPlayers.length === 0 ? (
            <p className="text-gray-500 py-8">No players in this game</p>
          ) : (
            <div className="space-y-4">
              {sortedPlayers.map((player, index) => (
                <AnimatedContainer
                  key={player.id}
                  delay={100 + (index * 100)}
                >
                  <div className={cn(
                    "flex items-center justify-between p-4 rounded-lg",
                    index === 0 ? "bg-quiz-yellow/20 border border-quiz-yellow/30" :
                    index === 1 ? "bg-blue-50 border border-blue-200" :
                    index === 2 ? "bg-orange-50 border border-orange-200" :
                    "bg-gray-50 border border-gray-200"
                  )}>
                    <div className="flex items-center">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3",
                        index === 0 ? "bg-quiz-yellow text-white" :
                        index === 1 ? "bg-blue-500 text-white" :
                        index === 2 ? "bg-orange-500 text-white" :
                        "bg-gray-300 text-gray-700"
                      )}>
                        {index + 1}
                      </div>
                      <span className="font-medium">{player.name}</span>
                    </div>
                    <div className="font-semibold">
                      {player.totalPoints} pts
                    </div>
                  </div>
                </AnimatedContainer>
              ))}
            </div>
          )}
        </AnimatedContainer>
        
        <AnimatedContainer delay={300} className="flex justify-center">
          <Button onClick={handleEndGame} size="lg">
            End Game
          </Button>
        </AnimatedContainer>
      </div>
    );
  };

  if (!quiz || !gameSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="glass rounded-xl p-6 animate-pulse-soft">
          <p className="text-lg">Loading quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <AnimatedContainer className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">
            {quiz.title}
          </h1>
          {hostView === HostView.LOBBY && (
            <p className="text-gray-600">
              Waiting for players to join
            </p>
          )}
        </AnimatedContainer>
        
        {renderView()}
      </div>
    </div>
  );
};

export default HostQuiz;
