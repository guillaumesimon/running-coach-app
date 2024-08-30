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
  const sessionsJson = await kv.get<string>(SESSIONS_KEY);
  if (!sessionsJson) return null;
  
  const sessions = JSON.parse(sessionsJson) as Session[];
  return sessions.find(session => session.id === id) || null;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log(`GET /api/sessions/${params.id} called`);
  const session = await getSession(params.id);
  
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'Session not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new NextResponse(JSON.stringify(session), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
