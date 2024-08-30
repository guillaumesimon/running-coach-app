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

async function getSession(id: string): Promise<Session | null> {
  console.log(`Fetching session with id: ${id}`);
  const sessions = await kv.get<Session[]>(SESSIONS_KEY);
  console.log('All sessions:', sessions);
  
  if (!sessions) {
    console.log('No sessions found in KV store');
    return null;
  }
  
  const session = sessions.find(s => s.id === id);
  console.log('Found session:', session);
  return session || null;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log(`GET /api/sessions/${params.id} called`);
  const session = await getSession(params.id);
  
  if (!session) {
    console.log(`Session with id ${params.id} not found`);
    return new NextResponse(JSON.stringify({ error: 'Session not found' }), {
      status: 404,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  console.log(`Returning session:`, session);
  return new NextResponse(JSON.stringify(session), {
    status: 200,
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
