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
  selectedQuestions?: Question[]; // Array of all questions
}

// Sample data for IT quiz with 30 questions and specific time limits
const itQuizQuestions: Question[] = [
  {
    question: "Which of the following is NOT an input device?",
    options: ["Keyboard", "Mouse", "Monitor", "Scanner"],
    correctOptionIndex: 2,
    timeLimit: 15, // 15 seconds for question 1
    points: 1000
  },
  {
    question: "Which of the following is NOT a NoSQL database?",
    options: ["MongoDB", "Redis", "MySQL", "Cassandra"],
    correctOptionIndex: 2,
    timeLimit: 30, // 30 seconds for question 2
    points: 1000
  },
  {
    question: "In cloud computing, what does IaaS stand for?",
    options: ["Internet as a Service", "Infrastructure as a Service", "Information as a Service", "Integration as a Service"],
    correctOptionIndex: 1,
    timeLimit: 11, // 11 seconds for question 3
    points: 1000
  },
  {
    question: "Which of the following is NOT a valid HTTP request method?",
    options: ["GET", "DELETE", "POST", "PUSH"],
    correctOptionIndex: 3,
    timeLimit: 20, // 20 seconds for question 4
    points: 1000
  },
  {
    question: "What does URL stand for?",
    options: ["Uniform Resource Locator", "Universal Resource Link", "Uniform Response Link", "Unique Resource Locator"],
    correctOptionIndex: 0,
    timeLimit: 25, // 25 seconds for question 5
    points: 1000
  },
  {
    question: "Who built the first mobile cell phone and made the first cell phone call?",
    options: ["Charles Babbage", "Charles Baudelaire", "Martin Cooper", "Alfred George"],
    correctOptionIndex: 2,
    timeLimit: 12, // 12 seconds for question 6
    points: 1000
  },
  {
    question: "ENIAC (Electronic Numerical Integrator and Computer), was introduced to the world on ?",
    options: ["1882", "1946", "1919", "1925"],
    correctOptionIndex: 1,
    timeLimit: 18, // 18 seconds for question 7
    points: 1000
  },
  {
    question: "When was Java came into existence?",
    options: ["1992-1993", "1970-1980", "1990-1993", "1995-1996"],
    correctOptionIndex: 3,
    timeLimit: 22, // 22 seconds for question 8
    points: 1000
  },
  {
    question: "What is the primary role of a CDN (Content Delivery Network)?",
    options: ["Distributing content to reduce latency and load times", "Managing domain name registrations", "Storing backup copies of databases", "Encrypting data transmissions"],
    correctOptionIndex: 0,
    timeLimit: 15, // 15 seconds for question 9
    points: 1000
  },
  {
    question: "Which is the oldest phone in the world?",
    options: ["Cordless phone", "Motorola DynaTAC 8000X", "BlackBerry AT100", "Nokia M120"],
    correctOptionIndex: 1,
    timeLimit: 28, // 28 seconds for question 10
    points: 1000
  },
  {
    question: "How many types of motherboard are there in this world?",
    options: ["15-16", "8-9", "12-15", "5-10"],
    correctOptionIndex: 2,
    timeLimit: 13, // 13 seconds for question 11
    points: 1000
  },
  {
    question: "Name the world's first computer?",
    options: ["Arne Freundt", "ENIAC", "Zipse", "Gernot Dollne"],
    correctOptionIndex: 1,
    timeLimit: 19, // 19 seconds for question 12
    points: 1000
  },
  {
    question: "What does the term 'Big Data' refer to?",
    options: ["High-resolution images and videos", "Data stored only in physical hard drives", "A collection of complex and voluminous datasets", "Large-sized files stored in a computer"],
    correctOptionIndex: 2,
    timeLimit: 24, // 24 seconds for question 13
    points: 1000
  },
  {
    question: "Which programming language is widely used for AI and machine learning?",
    options: ["Java", "Python", "C++", "PHP"],
    correctOptionIndex: 1,
    timeLimit: 14, // 14 seconds for question 14
    points: 1000
  },
  {
    question: "Which of the following is a key feature of Artificial Intelligence (AI)?",
    options: ["Physical hardware upgrades", "Data replication", "Simple rule-based calculations", "Human-like decision-making capabilities"],
    correctOptionIndex: 3,
    timeLimit: 27, // 27 seconds for question 15
    points: 1000
  },
  {
    question: "Who is the CEO of YouTube?",
    options: ["Satya Nadella", "Tim Berners-Lee", "Neal Mohan", "Chad Hurley"],
    correctOptionIndex: 2,
    timeLimit: 16, // 16 seconds for question 16
    points: 1000
  },
  {
    question: "If a file is 4MB in size, how many kilobytes (KB) is it?",
    options: ["5000 KB", "4000 KB", "1024 KB", "4096 KB"],
    correctOptionIndex: 3,
    timeLimit: 21, // 21 seconds for question 17
    points: 1000
  },
  {
    question: "What is the hexadecimal representation of the decimal number 15?",
    options: ["E", "F", "10", "1F"],
    correctOptionIndex: 1,
    timeLimit: 10, // 10 seconds for question 18
    points: 1000
  },
  {
    question: "What is the full form of Wi-Fi?",
    options: ["Wireless Fidelity", "Wireless Feature", "Wide Frequency Internet", "Wired Fiber"],
    correctOptionIndex: 0,
    timeLimit: 23, // 23 seconds for question 19
    points: 1000
  },
  {
    question: "If a computer has 8GB of RAM, how many megabytes (MB) is that?",
    options: ["8000 MB", "1024 MB", "5000 MB", "8192 MB"],
    correctOptionIndex: 3,
    timeLimit: 17, // 17 seconds for question 20
    points: 1000
  },
  {
    question: "What is an array in programming?",
    options: ["A function that repeats a task", "A storage that holds only one value", "A list that can store multiple values in a single variable", "A software used for designing websites"],
    correctOptionIndex: 2,
    timeLimit: 25, // 25 seconds for question 21
    points: 1000
  },
  {
    question: "What is the purpose of a database management system (DBMS)?",
    options: ["To store and organize large amounts of structured data efficiently", "To create and design web applications", "To increase internet browsing speed", "To protect computers from viruses"],
    correctOptionIndex: 0,
    timeLimit: 12, // 12 seconds for question 22
    points: 1000
  },
  {
    question: "If a hard drive has 1TB of storage and 250GB is used, how much is left?",
    options: ["500GB", "750GB", "850B", "900GB"],
    correctOptionIndex: 1,
    timeLimit: 19, // 19 seconds for question 23
    points: 1000
  },
  {
    question: "When was Google invented?",
    options: ["1998", "2000", "1980", "1995"],
    correctOptionIndex: 0,
    timeLimit: 14, // 14 seconds for question 24
    points: 1000
  },
  {
    question: "In IT, what does 'encryption' refer to?",
    options: ["Hiding a file in a secret folder", "Deleting unwanted files permanently", "Making the internet connection faster", "Converting data into a secure code"],
    correctOptionIndex: 3,
    timeLimit: 26, // 26 seconds for question 25
    points: 1000
  },
  {
    question: "What does ACID stand for in database transactions?",
    options: ["Atomicity, Consistency, Isolation, Durability", "Accuracy, Control, Integrity, Data", "Algorithm, Control, Input, Data", "Access, Connectivity, Integrity, Durability"],
    correctOptionIndex: 0,
    timeLimit: 13, // 13 seconds for question 26
    points: 1000
  },
  {
    question: "In a binary search tree (BST), the left subtree of a node contains only nodes with values ________.",
    options: ["Greater than the node", "Smaller than the node", "Both greater and smaller", "Unsorted values"],
    correctOptionIndex: 1,
    timeLimit: 20, // 20 seconds for question 27
    points: 1000
  },
  {
    question: "The worst-case time complexity of QuickSort is?",
    options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"],
    correctOptionIndex: 1,
    timeLimit: 15, // 15 seconds for question 28
    points: 1000
  },
  {
    question: "What is the primary function of a firewall?",
    options: ["Speed up internet connections", "Block unauthorized access", "Encrypt network data", "Improve Wi-Fi signals"],
    correctOptionIndex: 1,
    timeLimit: 22, // 22 seconds for question 29
    points: 1000
  },
  {
    question: "What is the purpose of a VPN (Virtual Private Network)?",
    options: ["Increase internet speed", "Provide secure remote access", "Create a public IP address", "Remove malware"],
    correctOptionIndex: 1,
    timeLimit: 18, // 18 seconds for question 30
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
const generateId = () => Math.random().toString(36).substring(2, 6).toUpperCase();

// Function to select all questions
const selectAllQuestions = (quiz: Quiz): Question[] => {
  return [...quiz.questions]; // Ensure all 30 questions are used
};

// Store operations
export const getQuizzes = (): Quiz[] => {
  const storedQuizzes = localStorage.getItem(QUIZZES_KEY);
  if (storedQuizzes) {
    try {
      const parsedQuizzes = JSON.parse(storedQuizzes);
      const hasITQuiz = parsedQuizzes.some((quiz: Quiz) => quiz.id === itQuiz.id);
      if (!hasITQuiz) {
        parsedQuizzes.push(itQuiz);
        localStorage.setItem(QUIZZES_KEY, JSON.stringify(parsedQuizzes));
      }
      return parsedQuizzes;
    } catch (error) {
      console.error("Error parsing stored quizzes:", error);
      localStorage.setItem(QUIZZES_KEY, JSON.stringify(sampleQuizzes));
      return sampleQuizzes;
    }
  }
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
  if (!quiz) {
    throw new Error(`Quiz with ID ${quizId} not found`);
  }
  
  const selectedQuestions = selectAllQuestions(quiz); // Use all 30 questions
  
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
    try {
      return JSON.parse(storedSessions);
    } catch (error) {
      console.error("Error parsing game sessions:", error);
      return [];
    }
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
  
  if (sessionIndex === -1) {
    return null;
  }
  
  // Check if a player with the same name already exists
  const existingPlayerIndex = sessions[sessionIndex].players.findIndex(
    player => player.name.toLowerCase() === playerName.toLowerCase()
  );
  
  // If player exists, return that player to allow rejoining
  if (existingPlayerIndex !== -1) {
    return sessions[sessionIndex].players[existingPlayerIndex];
  }
  
  // Otherwise create a new player
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
  
  if (sessionIndex === -1) {
    return null;
  }
  
  // We now allow starting the game regardless of previous status
  sessions[sessionIndex].status = "active";
  sessions[sessionIndex].currentQuestionIndex = 0;
  sessions[sessionIndex].startTime = Date.now();
  
  // Reset all player answers when starting a new game
  sessions[sessionIndex].players.forEach(player => {
    player.answers = [];
    player.totalPoints = 0;
  });
  
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
  
  let correctOptionIndex = -1;
  let maxPoints = 1000;
  let questionTimeLimit = 20;
  
  if (session.selectedQuestions && session.selectedQuestions[questionIndex]) {
    correctOptionIndex = session.selectedQuestions[questionIndex].correctOptionIndex;
    maxPoints = session.selectedQuestions[questionIndex].points || 1000;
    questionTimeLimit = session.selectedQuestions[questionIndex].timeLimit || 20;
  } else {
    const quiz = getQuizById(session.quizId);
    if (!quiz) return null;
    correctOptionIndex = quiz.questions[questionIndex].correctOptionIndex;
    maxPoints = quiz.questions[questionIndex].points || 1000;
    questionTimeLimit = quiz.questions[questionIndex].timeLimit || 20;
  }
  
  const playerIndex = session.players.findIndex(player => player.id === playerId);
  if (playerIndex === -1) return null;
  
  const isCorrect = answerIndex === correctOptionIndex;
  const timeRatio = Math.min(1, timeToAnswer / questionTimeLimit);
  const pointsEarned = isCorrect ? Math.max(0, Math.round(maxPoints * (1 - timeRatio))) : 0;
  
  const answer: PlayerAnswer = {
    playerId,
    questionIndex,
    answerIndex,
    timeToAnswer,
    correct: isCorrect,
    points: pointsEarned
  };
  
  const existingAnswerIndex = session.players[playerIndex].answers.findIndex(a => a.questionIndex === questionIndex);
  if (existingAnswerIndex !== -1) {
    const oldPoints = session.players[playerIndex].answers[existingAnswerIndex].points;
    session.players[playerIndex].totalPoints -= oldPoints;
    session.players[playerIndex].answers[existingAnswerIndex] = answer;
  } else {
    session.players[playerIndex].answers.push(answer);
  }
  
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
  
  const questionCount = session.selectedQuestions?.length || 0;
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

export const clearAllPlayers = (gameId: string): void => {
  const sessions = getGameSessions();
  const sessionIndex = sessions.findIndex(session => session.id === gameId);
  
  if (sessionIndex !== -1) {
    sessions[sessionIndex].players = [];
    localStorage.setItem(GAME_SESSIONS_KEY, JSON.stringify(sessions));
  }
};
