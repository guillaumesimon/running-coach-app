import { NextResponse } from 'next/server';
import Cors from 'cors';

// Initialize the cors middleware
const cors = Cors({
  methods: ['GET', 'HEAD', 'POST', 'OPTIONS'],
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req: Request, res: NextResponse, fn: Function) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

// This is a mock database. In a real application, you'd use a actual database.
let sessions = [
  { id: '1', title: 'Morning Run', date: '2023-04-01', distance: 5, targetPace: '05:30', duration: '00:27:30' },
  { id: '2', title: 'Evening Jog', date: '2023-03-30', distance: 3, targetPace: '06:00', duration: '00:18:00' },
];

export async function GET(req: Request) {
  const res = NextResponse.next();
  await runMiddleware(req, res, cors);
  
  console.log('GET /api/sessions called');
  console.log('Returning sessions:', sessions);
  return NextResponse.json(sessions);
}

export async function POST(req: Request) {
  const res = NextResponse.next();
  await runMiddleware(req, res, cors);

  console.log('POST /api/sessions called');
  try {
    const data = await req.json();
    console.log('Received data:', data);
    if (!data.title || !data.distance || !data.targetPace) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const newSession = {
      id: (sessions.length + 1).toString(),
      ...data,
      date: new Date().toISOString().split('T')[0], // Current date
    };
    sessions.push(newSession);
    console.log('Created new session:', newSession);
    return NextResponse.json(newSession, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/sessions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
