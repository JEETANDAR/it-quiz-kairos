
import React from "react";
import { cn } from "@/lib/utils";
import AnimatedContainer from "./AnimatedContainer";

interface QuizCardProps {
  title: string;
  questionCount: number;
  onSelect: () => void;
  index: number;
}

const QuizCard = ({ title, questionCount, onSelect, index }: QuizCardProps) => {
  const colors = ["bg-quiz-red/10", "bg-quiz-blue/10", "bg-quiz-yellow/10", "bg-quiz-green/10"];
  const borders = ["border-quiz-red/30", "border-quiz-blue/30", "border-quiz-yellow/30", "border-quiz-green/30"];
  const colorIndex = index % 4;

  return (
    <AnimatedContainer
      delay={index * 100}
      animation="slide-up"
      className="w-full"
    >
      <div 
        className={cn(
          "rounded-xl p-6 cursor-pointer transition-all duration-300 border",
          colors[colorIndex],
          borders[colorIndex],
          "hover:shadow-lg hover:scale-[1.02] hover:border-opacity-50"
        )}
        onClick={onSelect}
      >
        <h3 className="text-lg font-semibold mb-2 truncate">{title}</h3>
        <p className="text-sm text-muted-foreground">
          {questionCount} question{questionCount !== 1 ? "s" : ""}
        </p>
      </div>
    </AnimatedContainer>
  );
};

export default QuizCard;
