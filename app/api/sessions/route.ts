import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

const SESSIONS_KEY = 'running_sessions';

interface Session {
  id: string;
  title: string;
  date: string;
  distance: number;
  targetPace: string;
  duration: string;
  comment?: string;
}

async function getSessions(): Promise<Session[]> {
  console.log('Fetching sessions from KV store');
  const sessionsData = await kv.get(SESSIONS_KEY);
  console.log('Raw sessions data:', sessionsData);

  if (!sessionsData) {
    console.log('No sessions found, initializing with default data');
    const initialSessions: Session[] = [
      { id: '1', title: 'Morning Run', date: '2023-04-01', distance: 5, targetPace: '05:30', duration: '00:27:30' },
      { id: '2', title: 'Evening Jog', date: '2023-03-30', distance: 3, targetPace: '06:00', duration: '00:18:00' },
    ];
    await kv.set(SESSIONS_KEY, JSON.stringify(initialSessions));
    return initialSessions;
  }

  if (typeof sessionsData === 'string') {
    try {
      const parsedSessions = JSON.parse(sessionsData) as Session[];
      console.log('Parsed sessions:', parsedSessions);
      return parsedSessions;
    } catch (error) {
      console.error('Error parsing sessions data:', error);
      return [];
    }
  }

  console.log('Sessions data is not a string:', sessionsData);
  return [];
}

export async function GET(req: Request) {
  console.log('GET /api/sessions called');
  const sessions = await getSessions();
  console.log('Returning sessions:', sessions);
  return new NextResponse(JSON.stringify(sessions), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function POST(req: Request) {
  console.log('POST /api/sessions called');
  try {
    const data = await req.json();
    console.log('Received data:', data);
    if (!data.title || !data.distance || !data.targetPace) {
      return new NextResponse(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const sessions = await getSessions();
    const newSession: Session = {
      id: (Math.max(...sessions.map(s => parseInt(s.id)), 0) + 1).toString(),
      title: data.title,
      date: new Date().toISOString().split('T')[0],
      distance: Number(data.distance),
      targetPace: data.targetPace,
      duration: data.duration,
      comment: data.comment,
    };
    sessions.push(newSession);
    console.log('Saving sessions:', sessions);
    await kv.set(SESSIONS_KEY, JSON.stringify(sessions));
    console.log('Created new session:', newSession);
    return new NextResponse(JSON.stringify(newSession), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in POST /api/sessions:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error', details: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function OPTIONS(req: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
