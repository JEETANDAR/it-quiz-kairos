
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@/components/Button";
import AnimatedContainer from "@/components/AnimatedContainer";
import { cn } from "@/lib/utils";
import { 
  getQuizById, 
  getGameSessionById, 
  createGameSession, 
  approvePlayer,
  startGame,
  Quiz,
  GameSession,
} from "@/lib/quizStore";
import { useToast } from "@/hooks/use-toast";
import { Check, X, Users, Play } from "lucide-react";

const HostLobby = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [lobbyRefreshInterval, setLobbyRefreshInterval] = useState<number | null>(null);

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
      const sessionString = sessionStorage.getItem("hostSession");
      
      if (sessionString) {
        try {
          const savedSession = JSON.parse(sessionString);
          
          if (savedSession.quizId === quizId) {
            const currentSession = getGameSessionById(savedSession.gameId);
            
            if (currentSession) {
              setGameSession(currentSession);
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
        quizId
      }));
    };

    fetchQuiz();
    initializeGameSession();
  }, [quizId, navigate, toast]);

  useEffect(() => {
    if (gameSession) {
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
    }
  }, [gameSession]);

  const handleApprovePlayer = (playerId: string) => {
    if (!gameSession) return;
    
    const success = approvePlayer(gameSession.id, playerId);
    
    if (success) {
      toast({
        title: "Player approved",
        description: "The player has been approved to join the game",
      });
      
      const updatedSession = getGameSessionById(gameSession.id);
      if (updatedSession) {
        setGameSession(updatedSession);
      }
    }
  };

  const handleStartGame = () => {
    if (!gameSession) return;
    
    const approvedPlayers = gameSession.players.filter(p => p.approved);
    
    if (approvedPlayers.length === 0) {
      toast({
        title: "No approved players",
        description: "Approve at least one player before starting the game",
        variant: "destructive"
      });
      return;
    }
    
    const startSound = new Audio('/start-game.mp3');
    startSound.play().catch(() => {
      console.log("Audio playback prevented - user hasn't interacted with the document yet");
    });
    
    startGame(gameSession.id);
    navigate(`/host/${gameSession.id}`);
  };

  if (!quiz || !gameSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="glass rounded-xl p-6 animate-pulse-soft">
          <p className="text-lg text-high-contrast">Loading quiz...</p>
        </div>
      </div>
    );
  }

  const pendingPlayers = gameSession.players.filter(p => !p.approved);
  const approvedPlayers = gameSession.players.filter(p => p.approved);

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <AnimatedContainer className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2 text-high-contrast">
            Host Lobby: {quiz.title}
          </h1>
          <p className="text-muted-foreground">
            Approve players and start the game when ready
          </p>
        </AnimatedContainer>
        
        <div className="max-w-3xl mx-auto">
          <AnimatedContainer className="glass rounded-xl p-6 mb-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Game Code</h2>
            <div className="text-4xl font-bold tracking-widest bg-secondary py-3 px-6 rounded-lg mb-4">
              {gameSession.id}
            </div>
            <p className="text-gray-600">
              Share this code with players to join the game
            </p>
          </AnimatedContainer>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <AnimatedContainer delay={100} className="glass rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Pending Players ({pendingPlayers.length})</h2>
                </div>
              </div>
              
              {pendingPlayers.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No pending players</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingPlayers.map((player) => (
                    <AnimatedContainer 
                      key={player.id}
                      className="bg-secondary/50 p-4 rounded-lg flex items-center justify-between"
                    >
                      <span className="font-medium">{player.name}</span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleApprovePlayer(player.id)}
                          className="p-2 bg-green-500/20 rounded-full hover:bg-green-500/40 transition-colors"
                        >
                          <Check className="h-5 w-5 text-green-500" />
                        </button>
                      </div>
                    </AnimatedContainer>
                  ))}
                </div>
              )}
            </AnimatedContainer>
            
            <AnimatedContainer delay={150} className="glass rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <h2 className="text-xl font-semibold">Approved Players ({approvedPlayers.length})</h2>
                </div>
              </div>
              
              {approvedPlayers.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No approved players yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {approvedPlayers.map((player) => (
                    <AnimatedContainer 
                      key={player.id}
                      className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="font-medium">{player.name}</span>
                      </div>
                    </AnimatedContainer>
                  ))}
                </div>
              )}
            </AnimatedContainer>
          </div>

          <AnimatedContainer delay={200} className="flex justify-between">
            <Button variant="outline" onClick={() => navigate("/my-quizzes")}>
              Cancel
            </Button>
            <Button 
              onClick={handleStartGame}
              disabled={approvedPlayers.length === 0}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Start Game
            </Button>
          </AnimatedContainer>
        </div>
      </div>
    </div>
  );
};

export default HostLobby;
