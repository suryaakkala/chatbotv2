"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { generateTextMatching, type TextMatchingItem } from "@/lib/api-service"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

export default function TextMatchingPage() {
  const [topic, setTopic] = useState("")
  const [difficulty, setDifficulty] = useState("Beginner")
  const [items, setItems] = useState<TextMatchingItem[]>([])
  const [matches, setMatches] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [columnBItems, setColumnBItems] = useState<string[]>([])

  const handleGenerateActivity = async () => {
    if (!topic) {
      setError("Please enter a topic")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const matchingItems = await generateTextMatching(topic, difficulty)
      setItems(matchingItems)

      // Extract Column B items and shuffle them
      const columnB = matchingItems.map((item) => item["Column B"])
      setColumnBItems(shuffleArray([...columnB]))

      // Reset matches
      setMatches({})
      setShowResults(false)
    } catch (err) {
      setError("Failed to generate text matching activity. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const shuffleArray = (array: string[]) => {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result

    // Update the matches state
    const newMatches = { ...matches }

    // If the item was already matched to something else, remove that match
    Object.keys(newMatches).forEach((key) => {
      if (newMatches[key] === draggableId) {
        delete newMatches[key]
      }
    })

    // Add the new match
    newMatches[destination.droppableId] = draggableId

    setMatches(newMatches)
  }

  const handleCheckAnswers = () => {
    setShowResults(true)
  }

  const handleReset = () => {
    setMatches({})
    setShowResults(false)
  }

  const calculateScore = () => {
    if (!showResults) return 0

    let score = 0
    items.forEach((item) => {
      const columnA = item["Column A"]
      const columnB = item["Column B"]

      if (matches[columnA] === columnB) {
        score++
      }
    })

    return score
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Text Matching Activity</h1>

      {items.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Generate a Text Matching Activity</CardTitle>
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

            <Button onClick={handleGenerateActivity} disabled={isLoading} className="w-full">
              {isLoading ? "Generating..." : "Generate Activity"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Card>
            <CardHeader>
              <CardTitle>Match the items in Column A with Column B</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Column A */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Column A</h3>
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <Droppable key={item["Column A"]} droppableId={item["Column A"]}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`p-4 border rounded-lg ${snapshot.isDraggingOver ? "bg-primary/10" : ""} ${
                              showResults && matches[item["Column A"]] === item["Column B"]
                                ? "bg-green-100 dark:bg-green-900"
                                : showResults &&
                                    matches[item["Column A"]] &&
                                    matches[item["Column A"]] !== item["Column B"]
                                  ? "bg-red-100 dark:bg-red-900"
                                  : ""
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span>{item["Column A"]}</span>
                              {matches[item["Column A"]] && (
                                <div className="ml-4 p-2 bg-muted rounded-md">
                                  {matches[item["Column A"]]}
                                  {showResults && (
                                    <span className="ml-2">
                                      {matches[item["Column A"]] === item["Column B"] ? "✅" : "❌"}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    ))}
                  </div>
                </div>

                {/* Column B */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Column B</h3>
                  <Droppable droppableId="columnB">
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-4">
                        {columnBItems.map((item, index) => {
                          // Skip if this item is already matched
                          if (Object.values(matches).includes(item)) {
                            return null
                          }

                          return (
                            <Draggable key={item} draggableId={item} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`p-4 border rounded-lg ${
                                    snapshot.isDragging ? "bg-primary/10" : "bg-muted"
                                  }`}
                                >
                                  {item}
                                </div>
                              )}
                            </Draggable>
                          )
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <Button variant="outline" onClick={handleReset}>
                  Reset
                </Button>
                <Button onClick={handleCheckAnswers} disabled={Object.keys(matches).length !== items.length}>
                  Check Answers
                </Button>
              </div>

              {showResults && (
                <div className="mt-6 p-4 bg-muted rounded-lg text-center">
                  <p className="text-xl font-bold">
                    Your Score: {calculateScore()} / {items.length}
                  </p>
                  <p className="mt-2">
                    {calculateScore() === items.length
                      ? "Perfect! Great job!"
                      : calculateScore() >= items.length / 2
                        ? "Good work! Keep practicing!"
                        : "Keep practicing to improve your score!"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </DragDropContext>
      )}
    </div>
  )
}
