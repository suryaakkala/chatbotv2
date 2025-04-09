"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mic, MicOff, Play, ArrowRight, ArrowLeft } from "lucide-react"
import { useAudioRecorder } from "@/lib/use-audio-recorder"
import { generateVoiceInputPractice, type VoiceInputPracticeItem, checkVoiceInput } from "@/lib/api-service"

export default function VoicePracticePage() {
  const [topic, setTopic] = useState("")
  const [difficulty, setDifficulty] = useState("Beginner")
  const [practiceItems, setPracticeItems] = useState<VoiceInputPracticeItem[]>([])
  const [currentItemIndex, setCurrentItemIndex] = useState(0)
  const [result, setResult] = useState<{
    status: string
    words: Record<string, string>
    "correct-english-text"?: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    isRecording,
    audioURL,
    error: recordingError,
    startRecording,
    stopRecording,
    getAudioFile,
  } = useAudioRecorder()

  const handleGeneratePractice = async () => {
    if (!topic) {
      setError("Please enter a topic")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const items = await generateVoiceInputPractice(topic, difficulty)
      setPracticeItems(items)
      setCurrentItemIndex(0)
      setResult(null)
    } catch (err) {
      setError("Failed to generate voice practice. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitAudio = async () => {
    if (!audioURL) return

    const audioFile = await getAudioFile()
    if (!audioFile) return

    setIsLoading(true)

    try {
      const response = await checkVoiceInput(practiceItems[currentItemIndex], audioFile)

      setResult(response)
    } catch (err) {
      console.error(err)
      setError("Failed to check your pronunciation. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleNext = () => {
    if (currentItemIndex < practiceItems.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1)
      setResult(null)
    }
  }

  const handlePrevious = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex(currentItemIndex - 1)
      setResult(null)
    }
  }

  const renderWordWithHighlight = (text: string) => {
    if (!result || !result.words) return text

    return text.split(" ").map((word, index) => {
      const lowerWord = word.toLowerCase().replace(/[.,!?;:]/g, "")
      const color = result.words[lowerWord]

      return (
        <span
          key={index}
          className={`${
            color === "green"
              ? "text-green-600 dark:text-green-400"
              : color === "red"
                ? "text-red-600 dark:text-red-400"
                : ""
          } ${index > 0 ? "ml-1" : ""}`}
        >
          {word}
        </span>
      )
    })
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Voice Practice</h1>

      {practiceItems.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Generate Voice Practice</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                placeholder="e.g., Introducing Yourself"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
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

            <Button onClick={handleGeneratePractice} disabled={isLoading} className="w-full">
              {isLoading ? "Generating..." : "Generate Practice"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Practice Your Pronunciation</CardTitle>
            <CardDescription>Read the Telugu sentence aloud and record your voice</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {currentItemIndex + 1} of {practiceItems.length}
              </p>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" onClick={handlePrevious} disabled={currentItemIndex === 0}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNext}
                  disabled={currentItemIndex === practiceItems.length - 1}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">Telugu:</p>
                <p className="text-lg mt-1">{practiceItems[currentItemIndex].Telugu}</p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">English:</p>
                <p className="text-lg mt-1">
                  {result
                    ? renderWordWithHighlight(practiceItems[currentItemIndex].English)
                    : practiceItems[currentItemIndex].English}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-center">
                <Button
                  variant={isRecording ? "destructive" : "default"}
                  onClick={isRecording ? stopRecording : startRecording}
                  className="flex items-center gap-2"
                >
                  {isRecording ? (
                    <>
                      <MicOff className="h-4 w-4" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4" />
                      Start Recording
                    </>
                  )}
                </Button>
              </div>

              {recordingError && <p className="text-destructive text-sm text-center">{recordingError}</p>}

              {audioURL && (
                <div className="flex flex-col items-center space-y-4">
                  <audio src={audioURL} controls className="w-full max-w-md" />
                  <Button onClick={handleSubmitAudio} disabled={isLoading} className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    {isLoading ? "Checking..." : "Check Pronunciation"}
                  </Button>
                </div>
              )}
            </div>

            {result && (
              <div
                className={`p-4 rounded-lg ${
                  result.status === "success" ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900"
                }`}
              >
                <p className="font-medium">
                  {result.status === "success"
                    ? "Good job! Your pronunciation is clear."
                    : "Keep practicing! Some words need improvement."}
                </p>
                {result["correct-english-text"] && (
                  <p className="mt-2">
                    <strong>Correct English:</strong> {result["correct-english-text"]}
                  </p>
                )}
                <div className="mt-4">
                  <p className="font-medium">Word by word feedback:</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {Object.entries(result.words).map(([word, color], index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 rounded ${
                          color === "green" ? "bg-green-200 dark:bg-green-800" : "bg-red-200 dark:bg-red-800"
                        }`}
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
