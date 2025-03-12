
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button";
import AnimatedContainer from "@/components/AnimatedContainer";
import { joinGame, getGameSessionById } from "@/lib/quizStore";
import { useToast } from "@/hooks/use-toast";

const ITQuizParticipant = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [playerName, setPlayerName] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [gameId, setGameId] = useState("");
  
  const handleJoinQuiz = () => {
    if (!playerName.trim()) {
      toast({
        title: "Missing team name",
        description: "Please enter your team name to join",
        variant: "destructive"
      });
      return;
    }

    if (!gameId.trim()) {
      toast({
        title: "Missing game code",
        description: "Please enter the game code provided by the host",
        variant: "destructive"
      });
      return;
    }

    setIsJoining(true);
    try {
      // Check if the game exists
      const gameSession = getGameSessionById(gameId);
      if (!gameSession) {
        toast({
          title: "Game not found",
          description: "The game code you entered doesn't exist",
          variant: "destructive"
        });
        setIsJoining(false);
        return;
      }
      
      if (gameSession.status !== "waiting") {
        toast({
          title: "Game already started",
          description: "This game has already started or ended",
          variant: "destructive"
        });
        setIsJoining(false);
        return;
      }
      
      // Join the game
      const player = joinGame(gameId, playerName);
      if (!player) {
        toast({
          title: "Couldn't join game",
          description: "An error occurred while joining the game",
          variant: "destructive"
        });
        setIsJoining(false);
        return;
      }

      // Store player info in session storage
      sessionStorage.setItem("currentPlayer", JSON.stringify({
        gameId,
        playerId: player.id,
        playerName
      }));
      
      toast({
        title: "Joined successfully",
        description: "You've joined the game. Waiting for host to start."
      });

      // Navigate to player waiting room
      navigate(`/play/${gameId}`);
    } catch (error) {
      console.error("Error joining game:", error);
      toast({
        title: "Error joining game",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen animated-bg flex items-center justify-center bg-slate-800">
      <div className="w-full max-w-md px-4">
        <AnimatedContainer animation="scale-in" className="glass rounded-xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-white">IT Quiz Participant</h1>
            <p className="text-gray-300">Enter the game code and your team name to join</p>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="gameId" className="block text-sm font-medium text-gray-300 mb-1">
                Game Code
              </label>
              <input 
                type="text" 
                id="gameId" 
                value={gameId} 
                onChange={(e) => setGameId(e.target.value.toUpperCase())} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-black uppercase" 
                placeholder="Enter game code" 
                maxLength={10} 
              />
            </div>
            
            <div>
              <label htmlFor="playerName" className="block text-sm font-medium text-gray-300 mb-1">
                Team Name
              </label>
              <input 
                type="text" 
                id="playerName" 
                value={playerName} 
                onChange={(e) => setPlayerName(e.target.value)} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-black" 
                placeholder="Enter your team name" 
                maxLength={20} 
              />
            </div>

            <Button 
              onClick={handleJoinQuiz} 
              disabled={isJoining} 
              fullWidth 
              size="lg" 
              className="mt-4"
            >
              {isJoining ? "Joining..." : "Join Game"}
            </Button>
          </div>
        </AnimatedContainer>
      </div>
    </div>
  );
};

export default ITQuizParticipant;
