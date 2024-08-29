import { NextResponse } from 'next/server';

// This is a mock database. In a real application, you'd use a actual database.
let sessions = [
  { id: '1', title: 'Morning Run', date: '2023-04-01', distance: 5, targetPace: '05:30', duration: '00:27:30' },
  { id: '2', title: 'Evening Jog', date: '2023-03-30', distance: 3, targetPace: '06:00', duration: '00:18:00' },
];

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = sessions.find(s => s.id === params.id);
  if (session) {
    return NextResponse.json(session);
  } else {
    return new NextResponse('Session not found', { status: 404 });
  }
}
