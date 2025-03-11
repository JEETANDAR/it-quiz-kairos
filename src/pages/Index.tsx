
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button";
import AnimatedContainer from "@/components/AnimatedContainer";
import { cn } from "@/lib/utils";
import { Users, Award } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [hoverButton, setHoverButton] = useState<string | null>(null);

  return (
    <div className="min-h-screen animated-bg overflow-hidden">
      <div className="container max-w-6xl mx-auto px-4 py-12 md:py-24">
        <AnimatedContainer animation="slide-down" className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
              IT Quiz
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
            Participate in an interactive IT knowledge quiz
          </p>
        </AnimatedContainer>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
              <h2 className="text-2xl font-semibold mb-3 text-white">Join as Participant</h2>
              <p className="text-white/80 mb-6">
                Enter your team name to join the IT quiz and test your knowledge.
              </p>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate("/itquizparticipant")}
                fullWidth
              >
                Join Quiz
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
              <h2 className="text-2xl font-semibold mb-3 text-white">Host IT Quiz</h2>
              <p className="text-white/80 mb-6">
                Start an IT quiz session and monitor participants in real-time.
              </p>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate("/itquizhost")}
                fullWidth
              >
                Host Quiz
              </Button>
            </div>
          </AnimatedContainer>
        </div>
      </div>
    </div>
  );
};

export default Index;
