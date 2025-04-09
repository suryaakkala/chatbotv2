import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { topic, num_questions, difficulty } = body

    // This is a mock response. In a real application, you would call your actual API
    const mockResponse = [
      {
        question_number: 1,
        question: "Translate the word 'tree' into Telugu.",
        options: ["A) చెట్టు", "B) పూలు", "C) కాపురం", "D) ఇల్లు"],
        answer: "A) చెట్టు",
      },
      {
        question_number: 2,
        question: "Translate the word 'book' into Telugu.",
        options: ["A) పుస్తకం", "B) చెట్టు", "C) కూర్చీ", "D) నీరు"],
        answer: "A) పుస్తకం",
      },
      {
        question_number: 3,
        question: "Translate the word 'water' into Telugu.",
        options: ["A) చెట్టు", "B) పూలు", "C) నీరు", "D) ఇల్లు"],
        answer: "C) నీరు",
      },
      {
        question_number: 4,
        question: "Translate the word 'chair' into Telugu.",
        options: ["A) చెట్టు", "B) కూర్చీ", "C) పూలు", "D) ఇల్లు"],
        answer: "B) కూర్చీ",
      },
      {
        question_number: 5,
        question: "Translate the word 'house' into Telugu.",
        options: ["A) చెట్టు", "B) పూలు", "C) ఇల్లు", "D) కూర్చీ"],
        answer: "C) ఇల్లు",
      },
    ]

    // Limit the number of questions based on the request
    const limitedResponse = mockResponse.slice(0, num_questions)

    return NextResponse.json(limitedResponse)
  } catch (error) {
    console.error("Error in quiz API:", error)
    return NextResponse.json({ error: "Failed to generate quiz" }, { status: 500 })
  }
}
