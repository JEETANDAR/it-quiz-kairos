
import React from "react";
import { cn } from "@/lib/utils";
import AnimatedContainer from "./AnimatedContainer";
import { Question } from "@/lib/quizStore";
import { Check, X } from "lucide-react";

interface QuestionCardProps {
  question: Question;
  onAnswer: (answerIndex: number) => void;
  answered?: boolean;
  selectedAnswer?: number;
  correctAnswer?: number;
  isHost?: boolean;
}

const QuestionCard = ({
  question,
  onAnswer,
  answered = false,
  selectedAnswer,
  correctAnswer,
  isHost = false
}: QuestionCardProps) => {
  const colors = ["quiz-option-red", "quiz-option-blue", "quiz-option-yellow", "quiz-option-green"];

  const renderOption = (option: string, index: number) => {
    let optionClass = `quiz-option ${colors[index]} text-white`;
    
    if (answered) {
      if (index === correctAnswer) {
        optionClass += " ring-4 ring-green-500 ring-opacity-50";
      } else if (index === selectedAnswer && index !== correctAnswer) {
        optionClass += " ring-4 ring-red-500 ring-opacity-50 opacity-60";
      } else {
        optionClass += " opacity-60";
      }
    }

    return (
      <AnimatedContainer 
        key={index} 
        delay={150 + (index * 100)} 
        animation="slide-up"
        className="w-full"
      >
        <button
          className={cn(optionClass)}
          onClick={() => !answered && onAnswer(index)}
          disabled={answered || isHost}
        >
          <div className="flex items-center space-x-3">
            {index === 0 && <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              {answered && index === correctAnswer && <Check className="h-4 w-4 text-green-600" />}
              {answered && index === selectedAnswer && index !== correctAnswer && <X className="h-4 w-4 text-red-600" />}
            </div>}
            {index === 1 && <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
              {answered && index === correctAnswer && <Check className="h-4 w-4 text-green-600" />}
              {answered && index === selectedAnswer && index !== correctAnswer && <X className="h-4 w-4 text-red-600" />}
            </div>}
            {index === 2 && <div className="w-6 h-6 bg-white rounded-full rounded-tl-none flex items-center justify-center">
              {answered && index === correctAnswer && <Check className="h-4 w-4 text-green-600" />}
              {answered && index === selectedAnswer && index !== correctAnswer && <X className="h-4 w-4 text-red-600" />}
            </div>}
            {index === 3 && <div className="w-6 h-6 bg-white rounded-xl border-2 border-white/80 flex items-center justify-center">
              {answered && index === correctAnswer && <Check className="h-4 w-4 text-green-600" />}
              {answered && index === selectedAnswer && index !== correctAnswer && <X className="h-4 w-4 text-red-600" />}
            </div>}
            <span className="font-medium">{option}</span>
          </div>
        </button>
      </AnimatedContainer>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatedContainer delay={50} animation="slide-down" className="w-full">
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-2">{question.question}</h2>
          {question.image && (
            <div className="my-4 rounded-lg overflow-hidden">
              <img 
                src={question.image} 
                alt={question.question} 
                className="w-full h-auto object-cover"
              />
            </div>
          )}
        </div>
      </AnimatedContainer>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.options.map((option, index) => renderOption(option, index))}
      </div>
    </div>
  );
};

export default QuestionCard;
