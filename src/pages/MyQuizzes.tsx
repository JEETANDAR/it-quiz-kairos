import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import Button from "@/components/Button";
import QuizCard from "@/components/QuizCard";
import AnimatedContainer from "@/components/AnimatedContainer";
import { getQuizzes, Quiz } from "@/lib/quizStore";
const MyQuizzes = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    try {
      const loadedQuizzes = getQuizzes();
      setQuizzes(loadedQuizzes);
    } catch (error) {
      console.error("Failed to load quizzes:", error);
    } finally {
      setLoading(false);
    }
  }, []);
  const handleStartQuiz = (quizId: string) => {
    navigate(`/host/${quizId}`);
  };
  return <div className="min-h-screen bg-background py-12">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <AnimatedContainer>
            <h1 className="text-3xl font-bold">My Quizzes</h1>
          </AnimatedContainer>
          
          <AnimatedContainer delay={100}>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => navigate("/")}>
                Home
              </Button>
              <Button onClick={() => navigate("/create")}>
                Create New Quiz
              </Button>
            </div>
          </AnimatedContainer>
        </div>

        {loading ? <div className="flex justify-center py-12">
            <div className="glass rounded-lg p-6 animate-pulse-soft">
              <p className="text-lg">Loading quizzes...</p>
            </div>
          </div> : quizzes.length === 0 ? <AnimatedContainer delay={200} className="text-center py-16 px-4">
            <div className="glass rounded-xl p-8 max-w-xl mx-auto">
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold mb-3">No Quizzes Yet</h2>
              <p className="text-gray-600 mb-6">
                You haven't created any quizzes yet. Get started by creating your first quiz!
              </p>
              <Button onClick={() => navigate("/create")}>
                Create Your First Quiz
              </Button>
            </div>
          </AnimatedContainer> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz, index) => <AnimatedContainer key={quiz.id} delay={100 + index * 50} className="h-full">
                <div className="glass h-full rounded-xl p-6 flex flex-col">
                  <h3 className="text-xl font-semibold mb-2">{quiz.title}</h3>
                  {quiz.description && <p className="text-sm mb-4 flex-grow text-slate-50">{quiz.description}</p>}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-50">
                      {quiz.questions.length} question{quiz.questions.length !== 1 ? "s" : ""}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(quiz.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <Button fullWidth onClick={() => handleStartQuiz(quiz.id)}>
                    Start Quiz
                  </Button>
                </div>
              </AnimatedContainer>)}
          </div>}
      </div>
    </div>;
};
export default MyQuizzes;