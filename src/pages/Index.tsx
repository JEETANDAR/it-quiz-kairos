
import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button";
import AnimatedContainer from "@/components/AnimatedContainer";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen animated-bg flex flex-col items-center justify-center text-center">
      <div className="max-w-2xl px-4">
        <AnimatedContainer animation="slide-down">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Interactive Quiz Game
          </h1>
          <p className="text-xl text-white/80 mb-8">
            Create, host, and play interactive quizzes with friends and teammates
          </p>
        </AnimatedContainer>

        <AnimatedContainer delay={100} animation="scale-in" className="glass rounded-xl p-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-4">
              <h2 className="text-xl font-semibold mb-2">I'm a Host</h2>
              <Button 
                onClick={() => navigate("/create")}
                className="bg-primary text-white w-full"
              >
                Create a Quiz
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate("/my-quizzes")}
                className="w-full"
              >
                My Quizzes
              </Button>
            </div>
            
            <div className="flex flex-col space-y-4">
              <h2 className="text-xl font-semibold mb-2">I'm a Player</h2>
              <Button 
                onClick={() => navigate("/join")}
                className="bg-blue-500 text-white w-full hover:bg-blue-600"
              >
                Join a Quiz
              </Button>
            </div>
          </div>
        </AnimatedContainer>
      </div>
    </div>
  );
};

export default Index;
