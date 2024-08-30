import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import Cors from 'cors';

const SESSIONS_KEY = 'running_sessions';

// Initialiser le middleware CORS
const cors = Cors({
  methods: ['GET', 'HEAD'],
});

// Helper function to run middleware
function runMiddleware(req: Request, res: NextResponse, fn: Function) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

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
  // Exécuter le middleware CORS
  await runMiddleware(request, new NextResponse(), cors);

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
