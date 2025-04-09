"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getTypingPracticeSentences, checkTypingPractice } from "@/lib/api-service"

export default function TypingPracticePage() {
  const [username, setUsername] = useState("")
  const [difficulty, setDifficulty] = useState("easy")
  const [sentences, setSentences] = useState<Record<string, string>>({})
  const [currentSentenceKey, setCurrentSentenceKey] = useState<string | null>(null)
  const [userInput, setUserInput] = useState("")
  const [result, setResult] = useState<{
    "correct sentence": string
    "your sentence": string
    status: "success" | "failed"
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [completedSentences, setCompletedSentences] = useState<string[]>([])

  const handleGetSentences = async () => {
    if (!username) {
      setError("Please enter your username")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await getTypingPracticeSentences(username, difficulty)

      if (response.status === "success" && response.sentences) {
        setSentences(response.sentences)
        const keys = Object.keys(response.sentences)
        if (keys.length > 0) {
          setCurrentSentenceKey(keys[0])
        }
        setCompletedSentences([])
        setResult(null)
      } else {
        setError("Failed to get sentences. Please try again.")
      }
    } catch (err) {
      setError("Failed to get sentences. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCheckTyping = async () => {
    if (!currentSentenceKey || !userInput) return

    setIsLoading(true)

    try {
      const response = await checkTypingPractice(sentences[currentSentenceKey], userInput)

      setResult(response)

      if (response.status === "success") {
        setCompletedSentences([...completedSentences, currentSentenceKey])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNextSentence = () => {
    const keys = Object.keys(sentences).filter((key) => !completedSentences.includes(key))
    if (keys.length > 0) {
      setCurrentSentenceKey(keys[0])
      setUserInput("")
      setResult(null)
    } else {
      // All sentences completed
      setCurrentSentenceKey(null)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Typing Practice</h1>

      {Object.keys(sentences).length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Start Typing Practice</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Your Name</Label>
              <Input
                id="username"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Select value={difficulty} onValueChange={(value) => setDifficulty(value)}>
                <SelectTrigger id="difficulty">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {error && <p className="text-destructive">{error}</p>}

            <Button onClick={handleGetSentences} disabled={isLoading} className="w-full">
              {isLoading ? "Loading..." : "Start Practice"}
            </Button>
          </CardContent>
        </Card>
      ) : currentSentenceKey ? (
        <Card>
          <CardHeader>
            <CardTitle>Translate the Telugu Sentence</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-lg font-medium">{sentences[currentSentenceKey]}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="translation">Your English Translation</Label>
              <Input
                id="translation"
                placeholder="Type your translation here..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                disabled={!!result}
              />
            </div>

            {!result ? (
              <Button onClick={handleCheckTyping} disabled={isLoading || !userInput} className="w-full">
                {isLoading ? "Checking..." : "Check Translation"}
              </Button>
            ) : (
              <div className="space-y-4">
                <div
                  className={`p-4 rounded-lg ${
                    result.status === "success" ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900"
                  }`}
                >
                  <p className="font-medium">
                    {result.status === "success" ? "Correct! ✅" : "Not quite right. Try again! ❌"}
                  </p>
                  <div className="mt-2">
                    <p>
                      <strong>Your translation:</strong> {result["your sentence"]}
                    </p>
                    <p>
                      <strong>Correct translation:</strong> {result["correct sentence"]}
                    </p>
                  </div>
                </div>

                <Button onClick={handleNextSentence} className="w-full">
                  {Object.keys(sentences).length - completedSentences.length <= 1 ? "Finish Practice" : "Next Sentence"}
                </Button>
              </div>
            )}

            <div className="mt-4">
              <p>
                Progress: {completedSentences.length} / {Object.keys(sentences).length} sentences completed
              </p>
              <div className="w-full bg-muted rounded-full h-2.5 mt-2">
                <div
                  className="bg-primary h-2.5 rounded-full"
                  style={{ width: `${(completedSentences.length / Object.keys(sentences).length) * 100}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Practice Completed!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-lg">Congratulations! You have completed all the sentences.</p>
            <Button onClick={() => setSentences({})} className="mt-4">
              Start New Practice
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
