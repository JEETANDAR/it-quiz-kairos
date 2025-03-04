
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
}

// Sample data
const sampleQuizzes: Quiz[] = [
  {
    id: "quiz1",
    title: "General Knowledge",
    description: "Test your general knowledge with these questions!",
    createdAt: Date.now(),
    questions: [
      {
        question: "What is the capital of France?",
        options: ["Paris", "London", "Berlin", "Madrid"],
        correctOptionIndex: 0,
        timeLimit: 20,
        points: 1000
      },
      {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctOptionIndex: 1,
        timeLimit: 15,
        points: 1000
      },
      {
        question: "Who painted the Mona Lisa?",
        options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
        correctOptionIndex: 2,
        timeLimit: 20,
        points: 1000
      }
    ]
  },
  {
    id: "quiz2",
    title: "Science Quiz",
    description: "Challenge your science knowledge!",
    createdAt: Date.now() - 86400000,
    questions: [
      {
        question: "What is the chemical symbol for water?",
        options: ["WA", "H2O", "CO2", "O2"],
        correctOptionIndex: 1,
        timeLimit: 15,
        points: 1000
      },
      {
        question: "What is the largest organ in the human body?",
        options: ["Brain", "Liver", "Skin", "Heart"],
        correctOptionIndex: 2,
        timeLimit: 20,
        points: 1000
      }
    ]
  }
];

// Local storage keys
const QUIZZES_KEY = "kahoot_clone_quizzes";
const GAME_SESSIONS_KEY = "kahoot_clone_sessions";

// Helper functions
const generateId = () => Math.random().toString(36).substring(2, 9);

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
  
  const newSession: GameSession = {
    id: gameId,
    quizId,
    players: [],
    currentQuestionIndex: -1,
    status: "waiting"
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
  const quiz = getQuizById(session.quizId);
  
  if (!quiz) return null;
  
  const questionIndex = session.currentQuestionIndex;
  const question = quiz.questions[questionIndex];
  
  const playerIndex = session.players.findIndex(player => player.id === playerId);
  if (playerIndex === -1) return null;
  
  const isCorrect = answerIndex === question.correctOptionIndex;
  
  // Calculate points based on how quickly they answered
  const maxPoints = question.points || 1000;
  const pointsEarned = isCorrect ? Math.round(maxPoints * (1 - timeToAnswer / (question.timeLimit || 20))) : 0;
  
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
  const quiz = getQuizById(session.quizId);
  
  if (!quiz) return null;
  
  const newQuestionIndex = session.currentQuestionIndex + 1;
  
  // Check if we've reached the end of the quiz
  if (newQuestionIndex >= quiz.questions.length) {
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
