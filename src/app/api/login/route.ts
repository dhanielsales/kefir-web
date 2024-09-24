import { NextResponse, NextRequest } from "next/server";

const EMAIL = "manoelnetoark@gmail.com"
const PASSWORD = "k763529Br#"
const secret = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"

export interface TokenPayload {
  id: string
  sub: string
}

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()

  if (typeof email !== "string" || typeof password !== "string") { 
    return new NextResponse(`{"error": "login invalido"}`, { 
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });  }

  if (email.toLowerCase().trim() === EMAIL && password === PASSWORD) {
    return NextResponse.json({ token: secret })
  }
}
