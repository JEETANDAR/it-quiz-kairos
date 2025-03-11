
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CreateQuiz from "./pages/CreateQuiz";
import JoinQuiz from "./pages/JoinQuiz";
import MyQuizzes from "./pages/MyQuizzes";
import HostQuiz from "./pages/HostQuiz";
import PlayerQuiz from "./pages/PlayerQuiz";
import ITQuizParticipant from "./pages/ITQuizParticipant";
import ITQuizHost from "./pages/ITQuizHost";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/create" element={<CreateQuiz />} />
          <Route path="/join" element={<JoinQuiz />} />
          <Route path="/my-quizzes" element={<MyQuizzes />} />
          <Route path="/host/:quizId" element={<HostQuiz />} />
          <Route path="/play/:gameId" element={<PlayerQuiz />} />
          <Route path="/itquizparticipant" element={<ITQuizParticipant />} />
          <Route path="/itquizhost" element={<ITQuizHost />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
