
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import Button from "@/components/Button";
import AnimatedContainer from "@/components/AnimatedContainer";
import { Question, saveQuiz } from "@/lib/quizStore";
import { useToast } from "@/hooks/use-toast";

const CreateQuiz = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Partial<Question>[]>([
    {
      question: "",
      options: ["", "", "", ""],
      correctOptionIndex: 0,
      timeLimit: 20,
      points: 1000
    }
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: ["", "", "", ""],
        correctOptionIndex: 0,
        timeLimit: 20,
        points: 1000
      }
    ]);
    setCurrentQuestionIndex(questions.length);
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = {
      ...updatedQuestions[currentQuestionIndex],
      [name]: value
    };
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedQuestions = [...questions];
    const currentOptions = [...(updatedQuestions[currentQuestionIndex].options || [])];
    currentOptions[index] = value;
    
    updatedQuestions[currentQuestionIndex] = {
      ...updatedQuestions[currentQuestionIndex],
      options: currentOptions
    };
    
    setQuestions(updatedQuestions);
  };

  const handleCorrectOptionChange = (index: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = {
      ...updatedQuestions[currentQuestionIndex],
      correctOptionIndex: index
    };
    setQuestions(updatedQuestions);
  };

  const handleSaveQuiz = () => {
    if (!title) {
      toast({
        title: "Missing title",
        description: "Please enter a title for your quiz",
        variant: "destructive"
      });
      return;
    }

    if (questions.some(q => !q.question || q.options?.some(opt => !opt))) {
      toast({
        title: "Incomplete questions",
        description: "Please fill in all questions and options",
        variant: "destructive"
      });
      return;
    }

    try {
      const completeQuestions = questions as Question[];
      const savedQuiz = saveQuiz({
        title,
        description,
        questions: completeQuestions
      });

      toast({
        title: "Quiz saved",
        description: "Your quiz has been created successfully"
      });

      navigate("/my-quizzes");
    } catch (error) {
      toast({
        title: "Error saving quiz",
        description: "An error occurred while saving your quiz",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <AnimatedContainer className="mb-8">
          <Button
            variant="outline"
            className="mb-6"
            onClick={() => navigate(-1)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back
          </Button>

          <h1 className="text-3xl font-bold mb-6">Create a New Quiz</h1>
          
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Quiz Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter quiz title"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter quiz description"
                rows={2}
              />
            </div>
          </div>
        </AnimatedContainer>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Questions</h2>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddQuestion}
              >
                Add Question
              </Button>
            </div>
          </div>

          <div className="flex mb-4 overflow-x-auto pb-2">
            {questions.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "min-w-[3rem] h-10 flex items-center justify-center rounded-md mr-2 transition-all",
                  index === currentQuestionIndex
                    ? "bg-primary text-white"
                    : "bg-secondary text-primary hover:bg-secondary/80"
                )}
                onClick={() => setCurrentQuestionIndex(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <AnimatedContainer key={currentQuestionIndex} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Question {currentQuestionIndex + 1}
              </label>
              <input
                type="text"
                name="question"
                value={questions[currentQuestionIndex]?.question || ""}
                onChange={handleQuestionChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter your question"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time Limit (seconds)
              </label>
              <input
                type="number"
                name="timeLimit"
                value={questions[currentQuestionIndex]?.timeLimit || 20}
                onChange={handleQuestionChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                min={5}
                max={60}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Points
              </label>
              <input
                type="number"
                name="points"
                value={questions[currentQuestionIndex]?.points || 1000}
                onChange={handleQuestionChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                min={100}
                max={2000}
                step={100}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Options (Click to mark correct answer)
              </label>
              <div className="space-y-3">
                {questions[currentQuestionIndex]?.options?.map((option, index) => (
                  <div key={index} className="flex items-center">
                    <button
                      type="button"
                      onClick={() => handleCorrectOptionChange(index)}
                      className={cn(
                        "w-6 h-6 rounded-full mr-3 flex items-center justify-center transition-all",
                        questions[currentQuestionIndex]?.correctOptionIndex === index
                          ? "bg-green-500 text-white"
                          : "bg-gray-200"
                      )}
                    >
                      {questions[currentQuestionIndex]?.correctOptionIndex === index && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder={`Option ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </AnimatedContainer>
        </div>

        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={() => navigate("/my-quizzes")}>
            Cancel
          </Button>
          <Button onClick={handleSaveQuiz}>
            Save Quiz
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;
