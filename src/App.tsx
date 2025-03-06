
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
import HostLobby from "./pages/HostLobby";
import PlayerLobby from "./pages/PlayerLobby";

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
          <Route path="/host/lobby/:quizId" element={<HostLobby />} />
          <Route path="/play/:gameId" element={<PlayerQuiz />} />
          <Route path="/play/lobby/:gameId" element={<PlayerLobby />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
