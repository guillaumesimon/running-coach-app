import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Votre logique de génération de discours ici
  return NextResponse.json({ message: "Speech generation endpoint" });
}
