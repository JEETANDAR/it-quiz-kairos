
export const createGameSession = (quizId: string): GameSession => {
  const sessions = getGameSessions();
  const gameId = generateId();
  
  const quiz = getQuizById(quizId);
  if (!quiz) {
    throw new Error(`Quiz with ID ${quizId} not found`);
  }
  
  // Create a deep copy of the quiz questions
  const selectedQuestions = JSON.parse(JSON.stringify(quiz.questions));
  
  const newSession: GameSession = {
    id: gameId,
    quizId,
    players: [],
    currentQuestionIndex: -1,
    status: "waiting",
    selectedQuestions
  };
  
  const updatedSessions = [...sessions, newSession];
  localStorage.setItem(GAME_SESSIONS_KEY, JSON.stringify(updatedSessions));
  return newSession;
};
