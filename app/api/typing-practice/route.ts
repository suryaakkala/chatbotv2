import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user, difficulty_level } = body

    // This is a mock response. In a real application, you would call your actual API
    const mockResponse = {
      sentences: {
        sen1: "నేను తెలుగు నేర్చుకుంటున్నాను.",
        sen2: "నాకు తెలుగు భాష అంటే చాలా ఇష్టం.",
        sen3: "తెలుగు భారతదేశంలోని ప్రాచీన భాషలలో ఒకటి.",
        sen4: "నేను ప్రతిరోజూ తెలుగు పుస్తకాలు చదువుతాను.",
        sen5: "తెలుగు సాహిత్యం చాలా సమృద్ధిగా ఉంది.",
      },
      status: "success",
    }

    return NextResponse.json(mockResponse)
  } catch (error) {
    console.error("Error in typing practice API:", error)
    return NextResponse.json(
      {
        status: "failed",
        message: "Error getting typing practice sentences",
      },
      { status: 500 },
    )
  }
}
