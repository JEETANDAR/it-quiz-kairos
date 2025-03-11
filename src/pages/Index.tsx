
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button";
import AnimatedContainer from "@/components/AnimatedContainer";
import { cn } from "@/lib/utils";
import { PlusCircle, Zap, Users, Award } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [hoverButton, setHoverButton] = useState<string | null>(null);

  return (
    <div className="min-h-screen animated-bg overflow-hidden">
      <div className="container max-w-6xl mx-auto px-4 py-12 md:py-24">
        <AnimatedContainer animation="slide-down" className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
              Quizzy
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
            Create and play interactive quizzes in real-time.
          </p>
        </AnimatedContainer>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <AnimatedContainer delay={200} animation="slide-up">
            <div 
              className={cn(
                "glass rounded-2xl p-8 text-center transition-all duration-300",
                hoverButton === "create" ? "shadow-lg scale-[1.01]" : "shadow"
              )}
              onMouseEnter={() => setHoverButton("create")}
              onMouseLeave={() => setHoverButton(null)}
            >
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-800">
                <PlusCircle className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-semibold mb-3 text-white">Create a Quiz</h2>
              <p className="text-white/80 mb-6">
                Build your own quiz with custom questions and share it with others.
              </p>
              <Button 
                size="lg" 
                onClick={() => navigate("/create")}
                fullWidth
              >
                Start Creating
              </Button>
            </div>
          </AnimatedContainer>

          <AnimatedContainer delay={300} animation="slide-up">
            <div 
              className={cn(
                "glass rounded-2xl p-8 text-center transition-all duration-300",
                hoverButton === "join" ? "shadow-lg scale-[1.01]" : "shadow"
              )}
              onMouseEnter={() => setHoverButton("join")}
              onMouseLeave={() => setHoverButton(null)}
            >
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-800">
                <Zap className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-semibold mb-3 text-white">Join a Quiz</h2>
              <p className="text-white/80 mb-6">
                Enter a game code to join an existing quiz session.
              </p>
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate("/join")}
                fullWidth
              >
                Join Quiz
              </Button>
            </div>
          </AnimatedContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-8">
          <AnimatedContainer delay={400} animation="slide-up">
            <div 
              className={cn(
                "glass rounded-2xl p-8 text-center transition-all duration-300",
                hoverButton === "itparticipant" ? "shadow-lg scale-[1.01]" : "shadow"
              )}
              onMouseEnter={() => setHoverButton("itparticipant")}
              onMouseLeave={() => setHoverButton(null)}
            >
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 text-purple-800">
                <Users className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-semibold mb-3 text-white">IT Quiz Participant</h2>
              <p className="text-white/80 mb-6">
                Direct access for IT quiz participants. Enter your team name to join.
              </p>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate("/itquizparticipant")}
                fullWidth
              >
                Join as Participant
              </Button>
            </div>
          </AnimatedContainer>

          <AnimatedContainer delay={500} animation="slide-up">
            <div 
              className={cn(
                "glass rounded-2xl p-8 text-center transition-all duration-300",
                hoverButton === "ithost" ? "shadow-lg scale-[1.01]" : "shadow"
              )}
              onMouseEnter={() => setHoverButton("ithost")}
              onMouseLeave={() => setHoverButton(null)}
            >
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 text-orange-800">
                <Award className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-semibold mb-3 text-white">IT Quiz Host</h2>
              <p className="text-white/80 mb-6">
                Host access for IT quiz. Monitor participants and start when ready.
              </p>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate("/itquizhost")}
                fullWidth
              >
                Host IT Quiz
              </Button>
            </div>
          </AnimatedContainer>
        </div>

        <AnimatedContainer delay={600} className="text-center mt-16">
          <div className="glass rounded-xl p-6 inline-block">
            <p className="text-white/80 mb-3">
              Already have a quiz?
            </p>
            <Button 
              variant="outline" 
              onClick={() => navigate("/my-quizzes")}
            >
              View My Quizzes
            </Button>
          </div>
        </AnimatedContainer>
      </div>
    </div>
  );
};

export default Index;
