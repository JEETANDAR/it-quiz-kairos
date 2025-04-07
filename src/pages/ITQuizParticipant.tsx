
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button";
import AnimatedContainer from "@/components/AnimatedContainer";
import { joinGame, getGameSessionById, createGameSession, getQuizById, clearAllPlayers } from "@/lib/quizStore";
import { useToast } from "@/hooks/use-toast";

const ITQuizParticipant = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [playerName, setPlayerName] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [gameExists, setGameExists] = useState(true);
  
  // Check if the game exists on component mount
  useEffect(() => {
    const gameId = "ITQUIZ";
    let gameSession = getGameSessionById(gameId);
    
    // If game doesn't exist, create it
    if (!gameSession) {
      const itQuizId = "itquiz123";
      const quiz = getQuizById(itQuizId);
      
      if (quiz) {
        // Create a new session with the IT quiz
        const newSession = createGameSession(itQuizId);
        newSession.id = gameId;
        
        // Save to localStorage
        const sessions = JSON.parse(localStorage.getItem("kahoot_clone_sessions") || "[]");
        sessions.push(newSession);
        localStorage.setItem("kahoot_clone_sessions", JSON.stringify(sessions));
        
        gameSession = newSession;
        setGameExists(true);
      } else {
        setGameExists(false);
        toast({
          title: "Quiz data error",
          description: "The IT Quiz data couldn't be loaded",
          variant: "destructive"
        });
      }
    }
    
    // Reset game state if it's not in waiting status
    if (gameSession && gameSession.status !== "waiting") {
      gameSession.status = "waiting";
      gameSession.currentQuestionIndex = -1;
      
      // Update the session in localStorage
      const sessions = JSON.parse(localStorage.getItem("kahoot_clone_sessions") || "[]");
      const sessionIndex = sessions.findIndex(s => s.id === gameSession.id);
      
      if (sessionIndex !== -1) {
        sessions[sessionIndex] = gameSession;
        localStorage.setItem("kahoot_clone_sessions", JSON.stringify(sessions));
      }
    }
  }, [toast]);
  
  const handleJoinQuiz = () => {
    if (!playerName.trim()) {
      toast({
        title: "Missing team name",
        description: "Please enter your team name to join",
        variant: "destructive"
      });
      return;
    }

    setIsJoining(true);
    try {
      // Always use the fixed IT Quiz game ID
      const gameId = "ITQUIZ";
      
      // Check if the game exists
      let gameSession = getGameSessionById(gameId);
      
      // If game doesn't exist, create it
      if (!gameSession) {
        const itQuizId = "itquiz123";
        const quiz = getQuizById(itQuizId);
        
        if (!quiz) {
          toast({
            title: "Quiz data error",
            description: "The IT Quiz data couldn't be loaded",
            variant: "destructive"
          });
          setIsJoining(false);
          return;
        }
        
        // Create a new session with the IT quiz
        gameSession = createGameSession(itQuizId);
        gameSession.id = gameId;
        
        // Save to localStorage
        const sessions = JSON.parse(localStorage.getItem("kahoot_clone_sessions") || "[]");
        const sessionIndex = sessions.findIndex(s => s.id === gameSession?.id);
        
        if (sessionIndex !== -1) {
          sessions[sessionIndex] = gameSession;
        } else {
          sessions.push(gameSession);
        }
        
        localStorage.setItem("kahoot_clone_sessions", JSON.stringify(sessions));
      }
      
      // Reset game state if needed
      if (gameSession.status !== "waiting") {
        gameSession.status = "waiting";
        gameSession.currentQuestionIndex = -1;
        
        // Update the session in localStorage
        const sessions = JSON.parse(localStorage.getItem("kahoot_clone_sessions") || "[]");
        const sessionIndex = sessions.findIndex(s => s.id === gameSession.id);
        
        if (sessionIndex !== -1) {
          sessions[sessionIndex] = gameSession;
          localStorage.setItem("kahoot_clone_sessions", JSON.stringify(sessions));
        }
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
            <p className="text-gray-300">Enter your team name to join</p>
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
              disabled={isJoining || !gameExists} 
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
