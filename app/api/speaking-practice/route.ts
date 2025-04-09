import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { main_topic, difficulty } = body

    // This is a mock response. In a real application, you would call your actual API
    const mockResponse = {
      Title: "Ordering Food at a Restaurant",
      Description: "Practice ordering food at a restaurant in English.",
      "Avg Time": "5 minutes",
      Scenario: "You are at a restaurant, ordering your favorite dish.",
      Dialogue: [
        {
          English: "Can I have the menu, please?",
          Telugu: "మెనూ ఇవ్వగలరా దయచేసి?",
        },
        {
          English: "I would like to order a coffee.",
          Telugu: "నేను కాఫీ ఆర్డర్ చేయాలని అనుకుంటున్నాను.",
        },
        {
          English: "How much does it cost?",
          Telugu: "దీని ధర ఎంత?",
        },
      ],
    }

    return NextResponse.json(mockResponse)
  } catch (error) {
    console.error("Error in speaking practice API:", error)
    return NextResponse.json(
      {
        message: "Error generating speaking practice activity",
      },
      { status: 500 },
    )
  }
}
