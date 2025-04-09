import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { telugu, english } = body

    if (!telugu || !english) {
      return NextResponse.json(
        {
          status: "failed",
          message: "Missing required fields",
        },
        { status: 400 },
      )
    }

    // This is a mock response. In a real application, you would check the translation
    // against the expected English text
    const mockResponse = {
      "correct sentence": "I am learning Telugu.",
      "your sentence": english,
      status: Math.random() > 0.5 ? "success" : "failed", // Randomly succeed or fail for demo purposes
    }

    return NextResponse.json(mockResponse)
  } catch (error) {
    console.error("Error in typing practice check API:", error)
    return NextResponse.json(
      {
        status: "failed",
        message: "Error checking typing practice",
      },
      { status: 500 },
    )
  }
}
