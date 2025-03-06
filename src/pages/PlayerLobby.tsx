
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@/components/Button";
import AnimatedContainer from "@/components/AnimatedContainer";
import { getGameSessionById, GameSession, Player } from "@/lib/quizStore";
import { useToast } from "@/hooks/use-toast";
import { HourglassIcon, Check, AlertCircle } from "lucide-react";

const PlayerLobby = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<{gameId: string; playerId: string; playerName: string} | null>(null);
  const [lobbyRefreshInterval, setLobbyRefreshInterval] = useState<number | null>(null);

  useEffect(() => {
    if (!gameId) {
      navigate("/join");
      return;
    }

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
      
    } catch (error) {
      console.error("Error loading player session:", error);
      navigate("/join");
    }
  }, [gameId, navigate, toast]);

  useEffect(() => {
    if (!gameId || !currentPlayer) return;
    
    const interval = window.setInterval(() => {
      const updatedSession = getGameSessionById(gameId);
      
      if (!updatedSession) {
        clearInterval(interval);
        toast({
          title: "Game ended",
          description: "The host has ended the game session",
        });
        sessionStorage.removeItem("currentPlayer");
        navigate("/join");
        return;
      }
      
      setGameSession(updatedSession);
      
      // Check if player is approved and game has started
      const playerInGame = updatedSession.players.find(p => p.id === currentPlayer.playerId);
      
      if (playerInGame && playerInGame.approved && updatedSession.status === "active") {
        // Player is approved and game is active, redirect to game
        navigate(`/play/${gameId}`);
      }
      
      // Check if player has been removed (not in player list anymore)
      const playerExists = updatedSession.players.some(p => p.id === currentPlayer.playerId);
      if (!playerExists) {
        clearInterval(interval);
        toast({
          title: "Removed from game",
          description: "You have been removed from the game by the host",
          variant: "destructive"
        });
        sessionStorage.removeItem("currentPlayer");
        navigate("/join");
      }
      
    }, 2000);
    
    setLobbyRefreshInterval(interval);
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameId, currentPlayer, navigate, toast]);

  const handleLeaveGame = () => {
    sessionStorage.removeItem("currentPlayer");
    navigate("/join");
  };

  if (!gameSession || !currentPlayer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="glass rounded-xl p-6 animate-pulse-soft">
          <p className="text-lg text-high-contrast">Loading...</p>
        </div>
      </div>
    );
  }

  const player = gameSession.players.find(p => p.id === currentPlayer.playerId);
  const isApproved = player?.approved || false;

  return (
    <div className="min-h-screen animated-bg flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <AnimatedContainer animation="scale-in" className="glass rounded-xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Waiting Room</h1>
            <p className="text-gray-600 mb-6">Please wait for host approval</p>
            
            {isApproved ? (
              <div className="flex flex-col items-center justify-center bg-green-500/20 rounded-xl p-6 mb-6 border border-green-500/30">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                  <Check className="h-8 w-8 text-green-500" />
                </div>
                <h2 className="text-xl font-semibold text-green-500 mb-1">Approved!</h2>
                <p className="text-gray-600">
                  Waiting for the host to start the game
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center bg-blue-500/20 rounded-xl p-6 mb-6 border border-blue-500/30">
                <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                  <HourglassIcon className="h-8 w-8 text-blue-500 animate-pulse-soft" />
                </div>
                <h2 className="text-xl font-semibold text-blue-500 mb-1">Pending Approval</h2>
                <p className="text-gray-600">
                  The host needs to approve your participation
                </p>
              </div>
            )}
            
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Game Code:</span>
                <span className="font-semibold">{gameSession.id}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Your Name:</span>
                <span className="font-semibold">{currentPlayer.playerName}</span>
              </div>
            </div>
            
            <Button
              variant="outline"
              onClick={handleLeaveGame}
            >
              Leave Waiting Room
            </Button>
          </div>
        </AnimatedContainer>
      </div>
    </div>
  );
};

export default PlayerLobby;
