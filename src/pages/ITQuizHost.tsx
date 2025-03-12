
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button";
import AnimatedContainer from "@/components/AnimatedContainer";
import { getGameSessionById, createGameSession, getQuizById, GameSession, clearAllPlayers } from "@/lib/quizStore";
import { useToast } from "@/hooks/use-toast";
import { Users, X } from "lucide-react";

const ITQuizHost = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);

  // Create or fetch the IT quiz session on component mount
  useEffect(() => {
    // Fixed gameId for the IT quiz
    const gameId = "ITQUIZ";
    let session = getGameSessionById(gameId);
    
    // Get the IT quiz ID
    const itQuizId = "itquiz123";
    const quiz = getQuizById(itQuizId);
    
    if (!quiz) {
      toast({
        title: "Quiz data error",
        description: "The IT Quiz data couldn't be loaded",
        variant: "destructive"
      });
      return;
    }
    
    if (!session) {
      // Create a new session using the IT quiz ID
      session = createGameSession(itQuizId);
      
      // We need to manually set the id since createGameSession generates a random one
      session.id = gameId;
      
      // Update the session in localStorage
      const sessions = JSON.parse(localStorage.getItem("kahoot_clone_sessions") || "[]");
      const sessionIndex = sessions.findIndex((s: GameSession) => s.id === session?.id);
      
      if (sessionIndex !== -1) {
        sessions[sessionIndex] = session;
      } else {
        sessions.push(session);
      }
      
      localStorage.setItem("kahoot_clone_sessions", JSON.stringify(sessions));
    }
    
    setGameSession(session);
    
    // Store host session info
    sessionStorage.setItem("hostSession", JSON.stringify({
      gameId: session.id,
      quizId: session.quizId
    }));

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [toast]);

  // Set up polling to refresh the player list
  useEffect(() => {
    if (gameSession) {
      const interval = window.setInterval(() => {
        const updatedSession = getGameSessionById(gameSession.id);
        if (updatedSession) {
          setGameSession(updatedSession);
        }
      }, 1000); // Refresh more frequently
      
      setRefreshInterval(interval);
      
      return () => {
        clearInterval(interval);
      };
    }
  }, [gameSession]);

  const handleStartQuiz = () => {
    if (!gameSession) {
      toast({
        title: "Session not available",
        description: "Cannot start the quiz. Session is not available.",
        variant: "destructive"
      });
      return;
    }

    if (gameSession.players.length === 0) {
      toast({
        title: "No participants",
        description: "Wait for participants to join before starting the quiz",
        variant: "destructive"
      });
      return;
    }

    // Navigate to the host page
    navigate(`/host/${gameSession.quizId}`);
  };

  const handleClearAllPlayers = () => {
    if (!gameSession) return;
    
    clearAllPlayers(gameSession.id);
    
    // Update the local state with fresh session
    const updatedSession = getGameSessionById(gameSession.id);
    if (updatedSession) {
      setGameSession(updatedSession);
      
      toast({
        title: "Teams cleared",
        description: "All teams have been removed from the lobby",
      });
    }
  };

  const handleRemovePlayer = (playerId: string) => {
    if (!gameSession) return;
    
    const updatedPlayers = gameSession.players.filter(p => p.id !== playerId);
    
    // Update the session with the filtered players
    const updatedSession = {...gameSession, players: updatedPlayers};
    
    // Save to localStorage
    const sessions = JSON.parse(localStorage.getItem("kahoot_clone_sessions") || "[]");
    const sessionIndex = sessions.findIndex((s: GameSession) => s.id === gameSession.id);
    
    if (sessionIndex !== -1) {
      sessions[sessionIndex] = updatedSession;
      localStorage.setItem("kahoot_clone_sessions", JSON.stringify(sessions));
      
      // Update local state
      setGameSession(updatedSession);
      
      toast({
        title: "Team removed",
        description: "The team has been removed from the lobby",
      });
    }
  };

  return (
    <div className="min-h-screen animated-bg py-12 bg-slate-800">
      <div className="container mx-auto px-4">
        <AnimatedContainer className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">IT Quiz Host Control</h1>
          <p className="text-gray-300">Monitor participants and start the quiz when ready</p>
        </AnimatedContainer>

        <div className="max-w-2xl mx-auto">
          <AnimatedContainer delay={100} className="glass rounded-xl p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Users className="text-blue-400" />
                <h2 className="text-xl font-semibold text-white">
                  Teams ({gameSession?.players.length || 0})
                </h2>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleClearAllPlayers}
                  disabled={!gameSession || gameSession.players.length === 0}>
                  Clear All
                </Button>
                <Button 
                  onClick={handleStartQuiz} 
                  disabled={!gameSession || gameSession.players.length === 0}>
                  Start Quiz
                </Button>
              </div>
            </div>
            
            {(!gameSession || gameSession.players.length === 0) ? (
              <div className="text-center py-10">
                <p className="text-gray-300">Waiting for teams to join...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {gameSession.players.map((player, index) => (
                  <AnimatedContainer 
                    key={player.id} 
                    delay={150 + index * 50} 
                    className="bg-secondary p-3 rounded-lg text-center relative"
                  >
                    <button 
                      onClick={() => handleRemovePlayer(player.id)}
                      className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center rounded-full bg-red-500/20 hover:bg-red-500/50 transition-colors"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                    <span className="font-medium text-white">{player.name}</span>
                  </AnimatedContainer>
                ))}
              </div>
            )}
          </AnimatedContainer>

          <AnimatedContainer delay={200} className="flex justify-center">
            <Button 
              variant="outline" 
              onClick={() => navigate("/")}
            >
              Back to Home
            </Button>
          </AnimatedContainer>
        </div>
      </div>
    </div>
  );
};

export default ITQuizHost;
