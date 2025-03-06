import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button";
import AnimatedContainer from "@/components/AnimatedContainer";
import { joinGame, getGameSessionById } from "@/lib/quizStore";
import { useToast } from "@/hooks/use-toast";
const JoinQuiz = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [gameId, setGameId] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const handleJoinQuiz = () => {
    if (!gameId.trim()) {
      toast({
        title: "Missing game code",
        description: "Please enter a game code to join",
        variant: "destructive"
      });
      return;
    }
    if (!playerName.trim()) {
      toast({
        title: "Missing name",
        description: "Please enter your name to join",
        variant: "destructive"
      });
      return;
    }
    setIsJoining(true);
    try {
      // Verify game exists and is waiting for players
      const session = getGameSessionById(gameId);
      if (!session) {
        toast({
          title: "Game not found",
          description: "The game code you entered doesn't exist",
          variant: "destructive"
        });
        setIsJoining(false);
        return;
      }
      if (session.status !== "waiting") {
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
      toast({
        title: "Error joining game",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      setIsJoining(false);
    }
  };
  return <div className="min-h-screen animated-bg flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <AnimatedContainer animation="scale-in" className="glass rounded-xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <Button variant="ghost" onClick={() => navigate("/")} className="absolute top-4 left-4 py-0 px-0 mx-[180px] my-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </Button>
            
            <h1 className="text-3xl font-bold mb-2">Join a Quiz</h1>
            <p className="text-gray-600">Enter the game code and your name to join</p>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="gameId" className="block text-sm font-medium text-gray-700 mb-1">
                Game Code
              </label>
              <input type="text" id="gameId" value={gameId} onChange={e => setGameId(e.target.value)} className="w-full px-4 py-3 text-center text-lg tracking-wider border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Enter game code" maxLength={7} />
            </div>

            <div>
              <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <input type="text" id="playerName" value={playerName} onChange={e => setPlayerName(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Enter your name" maxLength={20} />
            </div>

            <Button onClick={handleJoinQuiz} disabled={isJoining} fullWidth size="lg" className="mt-4">
              {isJoining ? "Joining..." : "Join Game"}
            </Button>
          </div>
        </AnimatedContainer>
      </div>
    </div>;
};
export default JoinQuiz;