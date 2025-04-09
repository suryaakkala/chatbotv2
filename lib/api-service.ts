// API service for handling all API requests

// Base API URLs
const CHAT_API_URL = "http://localhost:5000/chat"
const AUDIO_TRANS_API_URL = "/audio_trans"

// Types
export type ChatMessage = {
  role: "user" | "assistant"
  content: string
  type: "text" | "audio"
}

export type ChatRequest = {
  type: "text" | "audio"
  prompt: string | File
}

export type ChatResponse = {
  type: "text" | "audio"
  response: string
}

export type QuizQuestion = {
  question_number: number
  question: string
  options: string[]
  answer: string
}

export type TextMatchingItem = {
  "Column A": string
  "Column B": string
}

export type VoiceInputPracticeItem = {
  English: string
  Telugu: string
}

export type SpeakingPracticeActivity = {
  Title: string
  Description: string
  "Avg Time": string
  Scenario: string
  Dialogue: VoiceInputPracticeItem[]
}

export type VoiceInputCheckResponse = {
  status: string
  words: Record<string, string>
  "correct-english-text"?: string
}

export type TypingPracticeRequest = {
  user: string
  difficulty_level: "easy" | "medium" | "hard"
}

export type TypingPracticeResponse = {
  sentences: {
    [key: string]: string
  }
  status: "success" | "failed"
}

export type TypingPracticeCheckRequest = {
  telugu: string
  english: string
}

export type TypingPracticeCheckResponse = {
  "correct sentence": string
  "your sentence": string
  status: "success" | "failed"
}

// API functions
export async function sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
  const formData = new FormData()

  if (request.type === "text") {
    formData.append("type", "text")
    formData.append("prompt", request.prompt as string)
  } else {
    formData.append("type", "audio")
    formData.append("prompt", request.prompt as File)
  }

  const response = await fetch(CHAT_API_URL, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Failed to send chat message")
  }

  return response.json()
}

export async function generateQuiz(topic: string, numQuestions: number, difficulty: string): Promise<QuizQuestion[]> {
  const response = await fetch("/api/quiz", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      topic,
      num_questions: numQuestions,
      difficulty,
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to generate quiz")
  }

  return response.json()
}

export async function generateTextMatching(mainTopic: string, difficulty: string): Promise<TextMatchingItem[]> {
  const response = await fetch("/api/text-matching", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      main_topic: mainTopic,
      difficulty,
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to generate text matching activity")
  }

  return response.json()
}

export async function generateVoiceInputPractice(topic: string, difficulty: string): Promise<VoiceInputPracticeItem[]> {
  const response = await fetch("/api/voice-input-practice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      topic,
      difficulty,
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to generate voice input practice")
  }

  const data = await response.json()
  return data.data
}

export async function generateSpeakingPractice(
  mainTopic: string,
  difficulty: string,
): Promise<SpeakingPracticeActivity> {
  const response = await fetch("/api/speaking-practice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      main_topic: mainTopic,
      difficulty,
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to generate speaking practice activity")
  }

  return response.json()
}

export async function checkVoiceInput(
  data: { English: string; Telugu: string },
  audioFile: File,
): Promise<VoiceInputCheckResponse> {
  const formData = new FormData()
  formData.append("telugu-text", data.Telugu)
  formData.append("audio", audioFile)

  const response = await fetch("/api/voice-input-check", {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Failed to check voice input")
  }

  return response.json()
}

export async function getTypingPracticeSentences(
  user: string,
  difficultyLevel: string,
): Promise<TypingPracticeResponse> {
  const response = await fetch("/api/typing-practice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user,
      difficulty_level: difficultyLevel,
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to get typing practice sentences")
  }

  return response.json()
}

export async function checkTypingPractice(telugu: string, english: string): Promise<TypingPracticeCheckResponse> {
  const response = await fetch("/api/typing-practice-check", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      telugu,
      english,
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to check typing practice")
  }

  return response.json()
}

export async function transcribeAudio(audioFile: File): Promise<string> {
  const formData = new FormData()
  formData.append("audio", audioFile)

  const response = await fetch(AUDIO_TRANS_API_URL, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Failed to transcribe audio")
  }

  const data = await response.json()
  return data.data
}
