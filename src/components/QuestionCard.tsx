
import React from "react";
import { cn } from "@/lib/utils";
import AnimatedContainer from "./AnimatedContainer";
import { Question } from "@/lib/quizStore";
import { Check, X, Star, Zap, CircleDot, Triangle } from "lucide-react";

interface QuestionCardProps {
  question: Question;
  onAnswer: (answerIndex: number) => void;
  answered?: boolean;
  selectedAnswer?: number;
  correctAnswer?: number;
  isHost?: boolean;
  playerView?: boolean;
  className?: string;
}

const QuestionCard = ({
  question,
  onAnswer,
  answered = false,
  selectedAnswer,
  correctAnswer,
  isHost = false,
  playerView = false,
  className
}: QuestionCardProps) => {
  const colors = ["quiz-option-red", "quiz-option-blue", "quiz-option-yellow", "quiz-option-green"];
  
  // Cool shape icons for each option
  const optionIcons = [
    <CircleDot className="h-7 w-7" />, 
    <Triangle className="h-7 w-7" />, 
    <Star className="h-7 w-7" />, 
    <Zap className="h-7 w-7" />
  ];

  const renderOption = (option: string, index: number) => {
    let optionClass = `quiz-option ${colors[index]} text-high-contrast interactive-option`;
    
    if (answered) {
      if (index === correctAnswer) {
        optionClass += " ring-4 ring-green-500 ring-opacity-80";
      } else if (index === selectedAnswer && index !== correctAnswer) {
        optionClass += " ring-4 ring-red-500 ring-opacity-80 opacity-80";
      } else {
        optionClass += " opacity-70";
      }
    }

    return (
      <AnimatedContainer 
        key={index} 
        delay={150 + (index * 100)} 
        animation="slide-up"
        className={`w-full ${playerView && !isHost ? 'h-20' : ''}`}
      >
        <button
          className={cn(
            optionClass,
            playerView && !isHost ? "flex items-center justify-center" : ""
          )}
          onClick={() => !answered && onAnswer(index)}
          disabled={answered || isHost}
        >
          {playerView && !isHost ? (
            <div className="flex items-center justify-center h-full w-full">
              <div className={`w-16 h-16 ${index === 0 ? "rounded-full" : index === 1 ? "rounded-xl" : index === 2 ? "rounded-lg" : "rounded-full"} bg-white flex items-center justify-center`}>
                {answered && index === correctAnswer && <Check className="h-6 w-6 text-green-600" />}
                {answered && index === selectedAnswer && index !== correctAnswer && <X className="h-6 w-6 text-red-600" />}
                {!answered && optionIcons[index]}
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              {index === 0 && <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                {answered && index === correctAnswer && <Check className="h-4 w-4 text-green-600" />}
                {answered && index === selectedAnswer && index !== correctAnswer && <X className="h-4 w-4 text-red-600" />}
              </div>}
              {index === 1 && <div className="w-6 h-6 bg-white rounded-xl flex items-center justify-center">
                {answered && index === correctAnswer && <Check className="h-4 w-4 text-green-600" />}
                {answered && index === selectedAnswer && index !== correctAnswer && <X className="h-4 w-4 text-red-600" />}
              </div>}
              {index === 2 && <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center">
                {answered && index === correctAnswer && <Check className="h-4 w-4 text-green-600" />}
                {answered && index === selectedAnswer && index !== correctAnswer && <X className="h-4 w-4 text-red-600" />}
              </div>}
              {index === 3 && <div className="w-6 h-6 bg-white rounded-full border-2 border-white/80 flex items-center justify-center">
                {answered && index === correctAnswer && <Check className="h-4 w-4 text-green-600" />}
                {answered && index === selectedAnswer && index !== correctAnswer && <X className="h-4 w-4 text-red-600" />}
              </div>}
              <span className="font-medium text-lg">{option}</span>
            </div>
          )}
        </button>
      </AnimatedContainer>
    );
  };

  return (
    <div className={cn("w-full max-w-2xl mx-auto", className)}>
      {(!playerView || isHost) && (
        <AnimatedContainer delay={50} animation="slide-down" className="w-full">
          <div className="bg-card rounded-xl p-6 shadow-sm mb-6 border border-white/10">
            <h2 className="text-xl font-semibold mb-2 text-white">{question.question}</h2>
            {question.image && (
              <div className="my-4 rounded-lg overflow-hidden border border-white/20">
                <img 
                  src={question.image} 
                  alt={question.question} 
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
          </div>
        </AnimatedContainer>
      )}

      <div className={cn(
        "grid gap-4",
        playerView && !isHost ? "grid-cols-2 justify-items-center max-w-md mx-auto" : "grid-cols-1 sm:grid-cols-2"
      )}>
        {question.options.map((option, index) => renderOption(option, index))}
      </div>
    </div>
  );
};

export default QuestionCard;
