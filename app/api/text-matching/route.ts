import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { main_topic, difficulty } = body

    // This is a mock response. In a real application, you would call your actual API
    const mockResponse = [
      {
        "Column A": "1) Apple",
        "Column B": "A) పండు",
      },
      {
        "Column A": "2) Book",
        "Column B": "B) పుస్తకం",
      },
      {
        "Column A": "3) Chair",
        "Column B": "C) కూర్చీ",
      },
      {
        "Column A": "4) Tree",
        "Column B": "D) చెట్టు",
      },
      {
        "Column A": "5) Water",
        "Column B": "E) నీరు",
      },
    ]

    return NextResponse.json(mockResponse)
  } catch (error) {
    console.error("Error in text matching API:", error)
    return NextResponse.json({ error: "Failed to generate text matching activity" }, { status: 500 })
  }
}
