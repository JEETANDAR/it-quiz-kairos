
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button";
import AnimatedContainer from "@/components/AnimatedContainer";
import { joinGame, getGameSessionById, createGameSession } from "@/lib/quizStore";
import { useToast } from "@/hooks/use-toast";

const ITQuizParticipant = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [playerName, setPlayerName] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [gameSession, setGameSession] = useState(null);
  
  // Create or fetch the IT quiz session on component mount
  useEffect(() => {
    // We use a fixed gameId for the IT quiz
    const gameId = "ITQUIZ";
    const existingSession = getGameSessionById(gameId);
    
    if (existingSession) {
      setGameSession(existingSession);
    } else {
      // Create a new session using a fixed quiz ID 
      // (you may want to replace this with your actual IT quiz ID)
      const itQuizId = "itquiz123"; 
      const newSession = createGameSession(itQuizId);
      
      // We need to manually set the id since createGameSession generates a random one
      newSession.id = gameId;
      // Update the session in localStorage
      const sessions = JSON.parse(localStorage.getItem("kahoot_clone_sessions") || "[]");
      const sessionIndex = sessions.findIndex(s => s.id === newSession.id);
      if (sessionIndex !== -1) {
        sessions[sessionIndex] = newSession;
      } else {
        sessions.push(newSession);
      }
      localStorage.setItem("kahoot_clone_sessions", JSON.stringify(sessions));
      
      setGameSession(newSession);
    }
  }, []);

  const handleJoinQuiz = () => {
    if (!playerName.trim()) {
      toast({
        title: "Missing team name",
        description: "Please enter your team name to join",
        variant: "destructive"
      });
      return;
    }

    if (!gameSession) {
      toast({
        title: "Session not available",
        description: "The quiz session is not available yet. Please try again.",
        variant: "destructive"
      });
      return;
    }

    setIsJoining(true);
    try {
      const gameId = gameSession.id;
      
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

  return (
    <div className="min-h-screen animated-bg flex items-center justify-center bg-slate-800">
      <div className="w-full max-w-md px-4">
        <AnimatedContainer animation="scale-in" className="glass rounded-xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">IT Quiz Participant</h1>
            <p className="text-gray-300">Enter your team name to join the IT quiz</p>
          </div>

          <div className="space-y-6">
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
              {isJoining ? "Joining..." : "Join IT Quiz"}
            </Button>
          </div>
        </AnimatedContainer>
      </div>
    </div>
  );
};

export default ITQuizParticipant;
