import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { topic, difficulty } = body

    // This is a mock response. In a real application, you would call your actual API
    const mockResponse = {
      status: "success",
      data: [
        {
          English: "Hello, my name is John.",
          Telugu: "హలో, నా పేరు జాన్.",
        },
        {
          English: "I am from Hyderabad.",
          Telugu: "నేను హైదరాబాద్ నుండి వచ్చాను.",
        },
        {
          English: "I am learning English.",
          Telugu: "నేను ఇంగ్లీష్ నేర్చుకుంటున్నాను.",
        },
        {
          English: "I like to read books.",
          Telugu: "నాకు పుస్తకాలు చదవడం ఇష్టం.",
        },
        {
          English: "I work as a software engineer.",
          Telugu: "నేను సాఫ్ట్‌వేర్ ఇంజనీర్‌గా పని చేస్తున్నాను.",
        },
      ],
    }

    return NextResponse.json(mockResponse)
  } catch (error) {
    console.error("Error in voice input practice API:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Error generating voice input practice sentences",
      },
      { status: 500 },
    )
  }
}
