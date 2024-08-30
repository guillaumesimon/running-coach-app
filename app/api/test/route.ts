import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  console.log('GET /api/test called');
  return new NextResponse(JSON.stringify({ message: 'API is working' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
