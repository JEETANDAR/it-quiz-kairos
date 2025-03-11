
// Quiz data types
export interface Question {
  question: string;
  options: string[];
  correctOptionIndex: number;
  timeLimit?: number;
  image?: string;
  points?: number;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  createdAt: number;
}

export interface PlayerAnswer {
  playerId: string;
  questionIndex: number;
  answerIndex: number;
  timeToAnswer: number; // in seconds
  correct: boolean;
  points: number;
}

export interface Player {
  id: string;
  name: string;
  answers: PlayerAnswer[];
  totalPoints: number;
}

export interface GameSession {
  id: string;
  quizId: string;
  players: Player[];
  currentQuestionIndex: number;
  status: "waiting" | "active" | "finished";
  startTime?: number;
  selectedQuestions?: Question[]; // New field to store selected questions
}

// Sample data for IT quiz
const itQuizQuestions: Question[] = [
  {
    question: "What does CPU stand for?",
    options: ["Central Processing Unit", "Computer Personal Unit", "Central Process Utility", "Central Processor Unit"],
    correctOptionIndex: 0,
    timeLimit: 20,
    points: 1000
  },
  {
    question: "Which of these is not a programming language?",
    options: ["Java", "Python", "HTML", "Ruby"],
    correctOptionIndex: 2,
    timeLimit: 20,
    points: 1000
  },
  {
    question: "What is the main function of an operating system?",
    options: ["Run applications", "Manage hardware and software resources", "Create documents", "Connect to the internet"],
    correctOptionIndex: 1,
    timeLimit: 20,
    points: 1000
  },
  {
    question: "Which company developed the first smartphone?",
    options: ["Apple", "Samsung", "IBM", "Nokia"],
    correctOptionIndex: 2,
    timeLimit: 20,
    points: 1000
  },
  {
    question: "What does HTTP stand for?",
    options: ["HyperText Transfer Protocol", "High Tech Transfer Protocol", "Hyperlink Text Transfer Process", "Home Tool Transfer Protocol"],
    correctOptionIndex: 0,
    timeLimit: 20,
    points: 1000
  },
  {
    question: "What is the function of RAM in a computer?",
    options: ["Long-term storage", "Processing data", "Temporary memory storage", "Network connectivity"],
    correctOptionIndex: 2,
    timeLimit: 20,
    points: 1000
  },
  {
    question: "Which of these is a cloud storage service?",
    options: ["Excel", "Dropbox", "Photoshop", "Notepad"],
    correctOptionIndex: 1,
    timeLimit: 20,
    points: 1000
  },
  {
    question: "What is the purpose of a firewall?",
    options: ["Speed up internet connection", "Filter network traffic for security", "Improve display resolution", "Increase processing power"],
    correctOptionIndex: 1,
    timeLimit: 20,
    points: 1000
  },
  {
    question: "Which of these is an example of a database management system?",
    options: ["Microsoft Word", "SQL Server", "Windows 10", "Chrome"],
    correctOptionIndex: 1,
    timeLimit: 20,
    points: 1000
  },
  {
    question: "What does VPN stand for?",
    options: ["Virtual Private Network", "Visual Processing Node", "Virtual Personal Navigator", "Very Powerful Network"],
    correctOptionIndex: 0,
    timeLimit: 20,
    points: 1000
  },
  {
    question: "Which programming language is primarily used for iOS app development?",
    options: ["Java", "Swift", "C#", "Python"],
    correctOptionIndex: 1,
    timeLimit: 20,
    points: 1000
  },
  {
    question: "What is the function of an IP address?",
    options: ["Secure websites", "Identify devices on a network", "Store passwords", "Process graphics"],
    correctOptionIndex: 1,
    timeLimit: 20,
    points: 1000
  },
  {
    question: "Which of these is not a web browser?",
    options: ["Chrome", "Firefox", "Safari", "Oracle"],
    correctOptionIndex: 3,
    timeLimit: 20,
    points: 1000
  },
  {
    question: "What is phishing?",
    options: ["A computer virus", "An attempt to obtain sensitive information by disguising as a trustworthy entity", "A programming language", "A networking protocol"],
    correctOptionIndex: 1,
    timeLimit: 20,
    points: 1000
  },
  {
    question: "What is the purpose of a DNS server?",
    options: ["Store websites", "Convert domain names to IP addresses", "Create secure connections", "Process online payments"],
    correctOptionIndex: 1,
    timeLimit: 20,
    points: 1000
  }
];

// Create the IT quiz
const itQuiz: Quiz = {
  id: "itquiz123",
  title: "IT Knowledge Quiz",
  description: "Test your knowledge of information technology concepts and terms",
  createdAt: Date.now(),
  questions: itQuizQuestions
};

// Sample data
const sampleQuizzes: Quiz[] = [
  itQuiz
];

// Local storage keys
const QUIZZES_KEY = "kahoot_clone_quizzes";
const GAME_SESSIONS_KEY = "kahoot_clone_sessions";

// Helper functions
const generateId = () => Math.random().toString(36).substring(2, 9);

// Function to select 10 random questions from a quiz
const selectRandomQuestions = (quiz: Quiz): Question[] => {
  const allQuestions = [...quiz.questions];
  const shuffled = allQuestions.sort(() => 0.5 - Math.random());
  // Get first 10 questions, or all if less than 10
  return shuffled.slice(0, Math.min(10, shuffled.length));
};

// Store operations
export const getQuizzes = (): Quiz[] => {
  const storedQuizzes = localStorage.getItem(QUIZZES_KEY);
  if (storedQuizzes) {
    return JSON.parse(storedQuizzes);
  }
  // Initialize with sample quizzes if empty
  localStorage.setItem(QUIZZES_KEY, JSON.stringify(sampleQuizzes));
  return sampleQuizzes;
};

export const saveQuiz = (quiz: Omit<Quiz, "id" | "createdAt">): Quiz => {
  const quizzes = getQuizzes();
  const newQuiz: Quiz = {
    ...quiz,
    id: generateId(),
    createdAt: Date.now()
  };
  
  localStorage.setItem(QUIZZES_KEY, JSON.stringify([...quizzes, newQuiz]));
  return newQuiz;
};

export const getQuizById = (id: string): Quiz | undefined => {
  const quizzes = getQuizzes();
  return quizzes.find(quiz => quiz.id === id);
};

export const createGameSession = (quizId: string): GameSession => {
  const sessions = getGameSessions();
  const gameId = generateId();
  
  const quiz = getQuizById(quizId);
  const selectedQuestions = quiz ? selectRandomQuestions(quiz) : [];
  
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

export const getGameSessions = (): GameSession[] => {
  const storedSessions = localStorage.getItem(GAME_SESSIONS_KEY);
  if (storedSessions) {
    return JSON.parse(storedSessions);
  }
  return [];
};

export const getGameSessionById = (id: string): GameSession | undefined => {
  const sessions = getGameSessions();
  return sessions.find(session => session.id === id);
};

export const updateGameSession = (session: GameSession): void => {
  const sessions = getGameSessions();
  const index = sessions.findIndex(s => s.id === session.id);
  
  if (index !== -1) {
    sessions[index] = session;
    localStorage.setItem(GAME_SESSIONS_KEY, JSON.stringify(sessions));
  }
};

export const joinGame = (gameId: string, playerName: string): Player | null => {
  const sessions = getGameSessions();
  const sessionIndex = sessions.findIndex(session => session.id === gameId);
  
  if (sessionIndex === -1 || sessions[sessionIndex].status !== "waiting") {
    return null;
  }
  
  const playerId = generateId();
  const player: Player = {
    id: playerId,
    name: playerName,
    answers: [],
    totalPoints: 0
  };
  
  sessions[sessionIndex].players.push(player);
  localStorage.setItem(GAME_SESSIONS_KEY, JSON.stringify(sessions));
  
  return player;
};

export const startGame = (gameId: string): GameSession | null => {
  const sessions = getGameSessions();
  const sessionIndex = sessions.findIndex(session => session.id === gameId);
  
  if (sessionIndex === -1 || sessions[sessionIndex].status !== "waiting") {
    return null;
  }
  
  sessions[sessionIndex].status = "active";
  sessions[sessionIndex].currentQuestionIndex = 0;
  sessions[sessionIndex].startTime = Date.now();
  
  localStorage.setItem(GAME_SESSIONS_KEY, JSON.stringify(sessions));
  
  return sessions[sessionIndex];
};

export const submitAnswer = (gameId: string, playerId: string, answerIndex: number, timeToAnswer: number): PlayerAnswer | null => {
  const sessions = getGameSessions();
  const sessionIndex = sessions.findIndex(session => session.id === gameId);
  
  if (sessionIndex === -1 || sessions[sessionIndex].status !== "active") {
    return null;
  }
  
  const session = sessions[sessionIndex];
  const questionIndex = session.currentQuestionIndex;
  
  // Use the selected questions if available, otherwise fallback to the full quiz
  let correctOptionIndex = -1;
  let maxPoints = 1000;
  
  if (session.selectedQuestions && session.selectedQuestions[questionIndex]) {
    correctOptionIndex = session.selectedQuestions[questionIndex].correctOptionIndex;
    maxPoints = session.selectedQuestions[questionIndex].points || 1000;
  } else {
    const quiz = getQuizById(session.quizId);
    if (!quiz) return null;
    correctOptionIndex = quiz.questions[questionIndex].correctOptionIndex;
    maxPoints = quiz.questions[questionIndex].points || 1000;
  }
  
  const playerIndex = session.players.findIndex(player => player.id === playerId);
  if (playerIndex === -1) return null;
  
  const isCorrect = answerIndex === correctOptionIndex;
  
  // Calculate points based on how quickly they answered
  const pointsEarned = isCorrect ? Math.round(maxPoints * (1 - timeToAnswer / 20)) : 0;
  
  const answer: PlayerAnswer = {
    playerId,
    questionIndex,
    answerIndex,
    timeToAnswer,
    correct: isCorrect,
    points: pointsEarned
  };
  
  session.players[playerIndex].answers.push(answer);
  session.players[playerIndex].totalPoints += pointsEarned;
  
  localStorage.setItem(GAME_SESSIONS_KEY, JSON.stringify(sessions));
  
  return answer;
};

export const advanceQuestion = (gameId: string): number | null => {
  const sessions = getGameSessions();
  const sessionIndex = sessions.findIndex(session => session.id === gameId);
  
  if (sessionIndex === -1 || sessions[sessionIndex].status !== "active") {
    return null;
  }
  
  const session = sessions[sessionIndex];
  const newQuestionIndex = session.currentQuestionIndex + 1;
  
  // Check if we've reached the end of the quiz
  const questionCount = session.selectedQuestions 
    ? session.selectedQuestions.length 
    : getQuizById(session.quizId)?.questions.length || 0;
    
  if (newQuestionIndex >= questionCount) {
    session.status = "finished";
    localStorage.setItem(GAME_SESSIONS_KEY, JSON.stringify(sessions));
    return -1; // Indicates quiz is finished
  }
  
  session.currentQuestionIndex = newQuestionIndex;
  localStorage.setItem(GAME_SESSIONS_KEY, JSON.stringify(sessions));
  
  return newQuestionIndex;
};

export const endGame = (gameId: string): GameSession | null => {
  const sessions = getGameSessions();
  const sessionIndex = sessions.findIndex(session => session.id === gameId);
  
  if (sessionIndex === -1) {
    return null;
  }
  
  sessions[sessionIndex].status = "finished";
  localStorage.setItem(GAME_SESSIONS_KEY, JSON.stringify(sessions));
  
  return sessions[sessionIndex];
};
