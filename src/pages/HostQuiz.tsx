import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@/components/Button";
import AnimatedContainer from "@/components/AnimatedContainer";
import Timer from "@/components/Timer";
import QuestionCard from "@/components/QuestionCard";
import ScoreExporter from "@/components/ScoreExporter";
import { getQuizById, getGameSessionById, createGameSession, startGame, advanceQuestion, endGame, Quiz, GameSession, Question } from "@/lib/quizStore";
import { useToast } from "@/hooks/use-toast";
import { Users, Award, User } from "lucide-react";

enum HostView {
  LOBBY,
  QUESTION,
  QUESTION_RESULTS,
  FINAL_RESULTS,
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

  useEffect(() => {
    if (!quizId) {
      navigate("/");
      return;
    }

    const fetchQuiz = () => {
      const loadedQuiz = getQuizById(quizId);
      if (!loadedQuiz) {
        toast({
          title: "Quiz not found",
          description: "The quiz you're trying to host doesn't exist",
          variant: "destructive",
        });
        navigate("/");
        return;
      }
      setQuiz(loadedQuiz);
    };

    const initializeGameSession = () => {
      const sessionString = sessionStorage.getItem("hostSession");
      if (sessionString) {
        try {
          const savedSession = JSON.parse(sessionString);
          if (savedSession.quizId === quizId) {
            const currentSession = getGameSessionById(savedSession.gameId);
            if (currentSession) {
              setGameSession(currentSession);
              if (currentSession.status === "waiting") {
                setHostView(HostView.LOBBY);
              } else if (currentSession.status === "active") {
                setHostView(HostView.QUESTION);
                if (currentSession.selectedQuestions && currentSession.selectedQuestions[currentSession.currentQuestionIndex]) {
                  setCurrentQuestion(currentSession.selectedQuestions[currentSession.currentQuestionIndex]);
                } else {
                  const quiz = getQuizById(currentSession.quizId);
                  if (quiz) {
                    const currentQ = quiz.questions[currentSession.currentQuestionIndex];
                    if (currentQ) setCurrentQuestion(currentQ);
                  }
                }
                setTimerActive(true);
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

      const newSession = createGameSession(quizId);
      setGameSession(newSession);
      sessionStorage.setItem("hostSession", JSON.stringify({
        gameId: newSession.id,
        quizId,
      }));
    };

    fetchQuiz();
    initializeGameSession();
  }, [quizId, navigate, toast]);

  useEffect(() => {
    if (hostView === HostView.LOBBY && gameSession) {
      const interval = window.setInterval(() => {
        const updatedSession = getGameSessionById(gameSession.id);
        if (updatedSession) {
          setGameSession(updatedSession);
        }
      }, 1000);
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
        variant: "destructive",
      });
      return;
    }

    const startSound = new Audio('/start-game.mp3');
    startSound.play().catch(() => {
      console.log("Audio playback prevented - user hasn't interacted with the document yet");
    });

    const updatedSession = startGame(gameSession.id);
    if (updatedSession) {
      setGameSession(updatedSession);
      if (updatedSession.selectedQuestions && updatedSession.selectedQuestions.length > 0) {
        setCurrentQuestion(updatedSession.selectedQuestions[0]);
      } else {
        const firstQuestion = quiz?.questions[0];
        if (firstQuestion) {
          setCurrentQuestion(firstQuestion);
        }
      }
      setHostView(HostView.QUESTION);
      setTimerActive(true);
    }
  };

  const handleNextQuestion = () => {
    if (!gameSession || !quiz) return;

    const nextSound = new Audio('/next-question.mp3');
    nextSound.play().catch(() => {
      console.log("Audio playback prevented - user hasn't interacted with the document yet");
    });

    const nextQuestionIndex = advanceQuestion(gameSession.id);

    console.log("Debug - Next Question Index:", nextQuestionIndex);
    console.log("Debug - Current Index:", gameSession.currentQuestionIndex);
    console.log("Debug - Total Questions:", gameSession.selectedQuestions?.length || quiz.questions.length);

    if (nextQuestionIndex === null || nextQuestionIndex === -1) {
      // Check if we've reached the end of all questions
      const totalQuestions = gameSession.selectedQuestions?.length || quiz.questions.length;
      if (gameSession.currentQuestionIndex + 1 >= totalQuestions) {
        const endSound = new Audio('/end-game.mp3');
        endSound.play().catch(() => {
          console.log("Audio playback prevented - user hasn't interacted with the document yet");
        });

        const finalSession = getGameSessionById(gameSession.id);
        if (finalSession) {
          setGameSession(finalSession);
          setHostView(HostView.FINAL_RESULTS);
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to advance to the next question",
          variant: "destructive",
        });
      }
      return;
    }

    let nextQuestion = null;
    if (gameSession.selectedQuestions && gameSession.selectedQuestions[nextQuestionIndex]) {
      nextQuestion = gameSession.selectedQuestions[nextQuestionIndex];
    } else if (quiz) {
      nextQuestion = quiz.questions[nextQuestionIndex];
    }

    if (nextQuestion) {
      setCurrentQuestion(nextQuestion);
      setHostView(HostView.QUESTION);
      setTimerActive(true);

      const updatedSession = getGameSessionById(gameSession.id);
      if (updatedSession) {
        setGameSession(updatedSession);
      }
    }
  };

  const handleTimeUp = () => {
    const timeUpSound = new Audio('/time-up.mp3');
    timeUpSound.play().catch(err => {
      console.log("Error playing time-up sound:", err);
    });

    setTimerActive(false);
    setHostView(HostView.QUESTION_RESULTS);
  };

  const handleEndGame = () => {
    if (!gameSession) return;

    endGame(gameSession.id);
    sessionStorage.removeItem("hostSession");
    navigate("/");
  };

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
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6">
        <AnimatedContainer delay={100} className="glass rounded-2xl p-6 sm:p-8 bg-opacity-80 shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Teams Waiting ({gameSession.players.length})
            </h2>
            <Button 
              onClick={handleStartGame} 
              disabled={gameSession.players.length === 0}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full transition-all"
            >
              Start Game
            </Button>
          </div>

          {gameSession.players.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-300 text-lg">Waiting for teams to join...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {gameSession.players.map((player, index) => (
                <AnimatedContainer 
                  key={player.id} 
                  delay={150 + index * 50} 
                  className="bg-gray-800/50 p-4 rounded-xl flex items-center gap-3 hover:bg-gray-800/70 transition-colors"
                >
                  <User className="w-5 h-5 text-blue-400" />
                  <span className="font-medium text-white truncate">{player.name}</span>
                </AnimatedContainer>
              ))}
            </div>
          )}
        </AnimatedContainer>

        <AnimatedContainer delay={200} className="mt-6 flex justify-center">
          <Button 
            variant="outline" 
            onClick={() => navigate("/")}
            className="w-full sm:w-auto border-gray-500 text-gray-300 hover:bg-gray-800 px-6 py-2 rounded-full transition-all"
          >
            Cancel
          </Button>
        </AnimatedContainer>
      </div>
    );
  };

  const renderQuestion = () => {
    if (!currentQuestion) return null;

    const updatedGameSession = getGameSessionById(gameSession?.id || "");
    const answeredCount = updatedGameSession ? updatedGameSession.players.filter(player => 
      player.answers.some(a => a.questionIndex === updatedGameSession.currentQuestionIndex)
    ).length : 0;

    const answeredPlayers = updatedGameSession ? updatedGameSession.players.filter(player => 
      player.answers.some(a => a.questionIndex === updatedGameSession.currentQuestionIndex)
    ) : [];

    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <AnimatedContainer>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Question {gameSession?.currentQuestionIndex !== undefined ? gameSession.currentQuestionIndex + 1 : ""}
              {gameSession ? ` / ${gameSession.selectedQuestions?.length || quiz?.questions.length}` : ""}
            </h2>
          </AnimatedContainer>
          <AnimatedContainer delay={100}>
            <Timer 
              duration={currentQuestion.timeLimit || 20} 
              onTimeUp={handleTimeUp} 
              isActive={timerActive}
              className="bg-gray-800/50 p-3 rounded-full text-white text-lg font-semibold"
            />
          </AnimatedContainer>
        </div>

        <QuestionCard 
          question={currentQuestion} 
          onAnswer={() => {}} 
          isHost={true}
          className="shadow-xl"
        />

        <AnimatedContainer delay={150} className="glass rounded-2xl p-6 mt-6 bg-opacity-80">
          {answeredCount > 0 && (
            <div className="flex flex-wrap justify-center gap-3">
              {answeredPlayers.map(player => (
                <div 
                  key={player.id} 
                  className="px-4 py-2 bg-green-600/20 text-green-300 border border-green-500/30 rounded-full text-sm hover:bg-green-600/30 transition-colors"
                >
                  {player.name} ✓
                </div>
              ))}
            </div>
          )}
        </AnimatedContainer>
      </div>
    );
  };

  const renderQuestionResults = () => {
    if (!currentQuestion || !gameSession) return null;

    const playerAnswers = gameSession.players.flatMap(player => 
      player.answers.filter(a => a.questionIndex === gameSession.currentQuestionIndex)
    );

    const totalResponses = playerAnswers.length;
    const correctResponses = playerAnswers.filter(a => a.correct).length;

    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
        <AnimatedContainer className="glass rounded-2xl p-6 sm:p-8 mb-8 bg-opacity-80 text-center shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Question Results</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-8 sm:gap-12 mb-6">
            <div>
              <p className="text-sm text-gray-400 mb-2">Responses</p>
              <p className="text-3xl sm:text-4xl font-bold text-white">{totalResponses}/{gameSession.players.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-2">Correct</p>
              <p className="text-3xl sm:text-4xl font-bold text-green-400">
                {totalResponses > 0 ? Math.round(correctResponses / totalResponses * 100) : 0}%
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
          className="shadow-xl"
        />

        <AnimatedContainer delay={300} className="mt-8 flex justify-center">
          <Button 
            onClick={handleNextQuestion}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full text-lg transition-all"
          >
            {gameSession.currentQuestionIndex < (gameSession.selectedQuestions?.length - 1 || 0) 
              ? "Next Question" 
              : "See Final Results"}
          </Button>
        </AnimatedContainer>
      </div>
    );
  };

  const renderFinalResults = () => {
    if (!gameSession) return null;

    const questionCount = gameSession.selectedQuestions?.length || quiz?.questions.length || 0;

    return (
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6">
        <AnimatedContainer className="glass rounded-2xl p-6 sm:p-8 mb-8 bg-opacity-80 text-center shadow-lg">
          <div className="flex justify-center mb-6">
            <Award className="h-14 w-14 text-yellow-400" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Final Results</h2>
          <p className="text-gray-300 text-lg">
            {quiz?.title} • {questionCount} questions
          </p>
        </AnimatedContainer>

        <AnimatedContainer delay={200} className="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            onClick={handleEndGame}
            className="w-full sm:w-auto bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-full text-lg transition-all"
          >
            End Game
          </Button>
          <ScoreExporter 
            players={gameSession.players} 
            quizTitle={quiz?.title || 'IT Quiz'}
            asButton={true}
            buttonText="Download Scores"
            className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full text-lg transition-all"
          />
        </AnimatedContainer>
      </div>
    );
  };

  if (!quiz || !gameSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="glass rounded-2xl p-6 bg-opacity-80 animate-pulse">
          <p className="text-lg text-white">Loading quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <AnimatedContainer className="text-center mb-10 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            {quiz?.title || "IT Quiz"}
          </h1>
          {hostView === HostView.LOBBY && 
            <p className="text-gray-400 text-lg">
              Waiting for teams to join
            </p>
          }
        </AnimatedContainer>

        {renderView()}
      </div>
    </div>
  );
};

export default HostQuiz;