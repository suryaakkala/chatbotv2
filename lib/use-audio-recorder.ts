"use client"

import { useState, useEffect, useRef } from "react"

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [error, setError] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // Reset previous recording
      setAudioURL(null)
      setAudioBlob(null)
      chunksRef.current = []

      // Create new MediaRecorder with WAV format (audio/wav)
      const options = { mimeType: "audio/wav" } // We'll convert to WAV later
      mediaRecorderRef.current = new MediaRecorder(stream, options)

      mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      })

      mediaRecorderRef.current.addEventListener("stop", () => {
        const blob = new Blob(chunksRef.current, { type: "audio/wav" })
        setAudioBlob(blob)
        const url = URL.createObjectURL(blob)
        setAudioURL(url)
      })

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setError(null)
    } catch (err) {
      setError("Error accessing microphone. Please ensure you have granted permission.")
      console.error("Error starting recording:", err)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
    }
  }

  // Convert Blob to File (WAV format)
  const getAudioFile = async (): Promise<File | null> => {
    if (!audioBlob) return null

    // In a real implementation, you would convert webm to wav here
    // For this example, we'll just rename the file extension
    return new File([audioBlob], "recording.wav", { type: "audio/wav" })
  }

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
      }
      if (audioURL) {
        URL.revokeObjectURL(audioURL)
      }
    }
  }, [isRecording, audioURL])

  return {
    isRecording,
    audioURL,
    audioBlob,
    error,
    startRecording,
    stopRecording,
    getAudioFile,
  }
}
