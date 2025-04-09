"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { generateQuiz, type QuizQuestion } from "@/lib/api-service"

export default function QuizPage() {
  const [topic, setTopic] = useState("")
  const [numQuestions, setNumQuestions] = useState(5)
  const [difficulty, setDifficulty] = useState("Beginner")
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerateQuiz = async () => {
    if (!topic) {
      setError("Please enter a topic")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const quizQuestions = await generateQuiz(topic, numQuestions, difficulty)
      setQuestions(quizQuestions)
      setSelectedAnswers(new Array(quizQuestions.length).fill(""))
      setCurrentQuestion(0)
      setShowResults(false)
    } catch (err) {
      setError("Failed to generate quiz. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answer
    setSelectedAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateScore = () => {
    let score = 0
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.answer) {
        score++
      }
    })
    return score
  }

  const resetQuiz = () => {
    setQuestions([])
    setSelectedAnswers([])
    setCurrentQuestion(0)
    setShowResults(false)
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Telugu Quiz</h1>

      {questions.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Generate a Quiz</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                placeholder="e.g., Basic Telugu Vocabulary"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numQuestions">Number of Questions</Label>
              <Select
                value={numQuestions.toString()}
                onValueChange={(value) => setNumQuestions(Number.parseInt(value))}
              >
                <SelectTrigger id="numQuestions">
                  <SelectValue placeholder="Select number of questions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="15">15</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select value={difficulty} onValueChange={(value) => setDifficulty(value)}>
                <SelectTrigger id="difficulty">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {error && <p className="text-destructive">{error}</p>}

            <Button onClick={handleGenerateQuiz} disabled={isLoading} className="w-full">
              {isLoading ? "Generating..." : "Generate Quiz"}
            </Button>
          </CardContent>
        </Card>
      ) : showResults ? (
        <Card>
          <CardHeader>
            <CardTitle>Quiz Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-2xl font-bold">
                Your Score: {calculateScore()} / {questions.length}
              </p>
              <p className="text-lg">
                {calculateScore() === questions.length
                  ? "Perfect! Great job!"
                  : calculateScore() >= questions.length / 2
                    ? "Good work! Keep practicing!"
                    : "Keep practicing to improve your score!"}
              </p>
            </div>

            <div className="space-y-4 mt-6">
              <h3 className="text-xl font-semibold">Review Questions</h3>
              {questions.map((question, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <p className="font-medium">{question.question}</p>
                  <div className="mt-2">
                    {question.options.map((option, optIndex) => (
                      <div
                        key={optIndex}
                        className={`p-2 rounded-md mt-1 ${
                          option === question.answer
                            ? "bg-green-100 dark:bg-green-900"
                            : option === selectedAnswers[index] && option !== question.answer
                              ? "bg-red-100 dark:bg-red-900"
                              : ""
                        }`}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                  <p className="mt-2">
                    {selectedAnswers[index] === question.answer
                      ? "✅ Correct"
                      : `❌ Incorrect. The correct answer is: ${question.answer}`}
                  </p>
                </div>
              ))}
            </div>

            <Button onClick={resetQuiz} className="w-full mt-4">
              Start New Quiz
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>
              Question {currentQuestion + 1} of {questions.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg font-medium">{questions[currentQuestion].question}</p>

            <RadioGroup value={selectedAnswers[currentQuestion]} onValueChange={handleAnswerSelect}>
              {questions[currentQuestion].options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
                Previous
              </Button>
              <Button onClick={handleNext}>{currentQuestion === questions.length - 1 ? "Finish" : "Next"}</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
