import { NextResponse } from 'next/server';

// This is a mock database. In a real application, you'd use a actual database.
let sessions = [
  { id: '1', title: 'Morning Run', date: '2023-04-01', distance: 5, targetPace: '05:30', duration: '00:27:30' },
  { id: '2', title: 'Evening Jog', date: '2023-03-30', distance: 3, targetPace: '06:00', duration: '00:18:00' },
];

export async function GET() {
  return NextResponse.json(sessions);
}

export async function POST(request: Request) {
  const data = await request.json();
  const newSession = {
    id: (sessions.length + 1).toString(),
    ...data,
    date: new Date().toISOString().split('T')[0], // Current date
  };
  sessions.push(newSession);
  return NextResponse.json(newSession, { status: 201 });
}
