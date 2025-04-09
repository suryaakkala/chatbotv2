"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Mic, MicOff, Send } from "lucide-react"
import { useAudioRecorder } from "@/lib/use-audio-recorder"
import { sendChatMessage, type ChatMessage } from "@/lib/api-service"

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "నమస్కారం! నేను తెలుగు చాట్‌బాట్‌ని. మీకు ఎలా సహాయం చేయగలను?",
      type: "text",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const {
    isRecording,
    audioURL,
    error: recordingError,
    startRecording,
    stopRecording,
    getAudioFile,
  } = useAudioRecorder()

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (input.trim() === "") return

    const userMessage: ChatMessage = {
      role: "user",
      content: input,
      type: "text",
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await sendChatMessage({
        type: "text",
        prompt: input,
      })

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response.response,
        type: response.type,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error sending message:", error)

      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "Sorry, there was an error processing your request. Please try again.",
        type: "text",
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendAudio = async () => {
    if (!audioURL) return

    const audioFile = await getAudioFile()
    if (!audioFile) return

    const userMessage: ChatMessage = {
      role: "user",
      content: "Sent an audio message",
      type: "audio",
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await sendChatMessage({
        type: "audio",
        prompt: audioFile,
      })

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response.response,
        type: response.type,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error sending audio message:", error)

      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "Sorry, there was an error processing your audio. Please try again.",
        type: "text",
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <h1 className="text-3xl font-bold mb-6 text-center">Telugu Chatbot</h1>

      <Card className="flex-1 mb-4 overflow-hidden">
        <CardContent className="p-4 h-full overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  {message.type === "audio" ? (
                    <audio src={message.content} controls className="w-full" />
                  ) : (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col space-y-2">
        {audioURL && (
          <div className="flex items-center justify-between p-2 bg-muted rounded-md">
            <audio src={audioURL} controls className="w-full max-w-xs" />
            <Button onClick={handleSendAudio} disabled={isLoading}>
              <Send className="h-4 w-4 mr-2" />
              Send Audio
            </Button>
          </div>
        )}

        {recordingError && <p className="text-destructive text-sm">{recordingError}</p>}

        <div className="flex space-x-2">
          <Button
            variant={isRecording ? "destructive" : "outline"}
            size="icon"
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>

          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            disabled={isLoading}
            className="flex-1"
          />

          <Button onClick={handleSendMessage} disabled={isLoading || input.trim() === ""}>
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}
