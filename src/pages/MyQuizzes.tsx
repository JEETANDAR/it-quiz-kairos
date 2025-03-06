
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button";
import AnimatedContainer from "@/components/AnimatedContainer";
import QuizCard from "@/components/QuizCard";
import { getQuizzes, Quiz } from "@/lib/quizStore";
import { useToast } from "@/hooks/use-toast";

const MyQuizzes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    const loadedQuizzes = getQuizzes();
    setQuizzes(loadedQuizzes);
  }, []);

  const handleHost = (quizId: string) => {
    navigate(`/host/lobby/${quizId}`);
  };

  const handleCreateQuiz = () => {
    navigate("/create");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <AnimatedContainer className="flex justify-between items-center mb-8">
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="mb-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back
            </Button>
            <h1 className="text-3xl font-bold">My Quizzes</h1>
          </div>
          <Button 
            onClick={handleCreateQuiz}
            className="shadow-md"
          >
            Create Quiz
          </Button>
        </AnimatedContainer>

        {quizzes.length === 0 ? (
          <AnimatedContainer delay={100} className="glass rounded-xl p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">No quizzes found</h2>
            <p className="text-gray-600 mb-6">
              You haven't created any quizzes yet. Get started by creating your first quiz.
            </p>
            <Button onClick={handleCreateQuiz}>
              Create a Quiz
            </Button>
          </AnimatedContainer>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz, index) => (
              <AnimatedContainer key={quiz.id} delay={100 + (index * 50)}>
                <QuizCard 
                  quiz={quiz} 
                  onHost={() => handleHost(quiz.id)}
                />
              </AnimatedContainer>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyQuizzes;
