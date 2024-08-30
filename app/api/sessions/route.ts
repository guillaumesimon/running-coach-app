import { NextResponse } from 'next/server';

// This is a mock database. In a real application, you'd use a actual database.
let sessions = [
  { id: '1', title: 'Morning Run', date: '2023-04-01', distance: 5, targetPace: '05:30', duration: '00:27:30' },
  { id: '2', title: 'Evening Jog', date: '2023-03-30', distance: 3, targetPace: '06:00', duration: '00:18:00' },
];

export async function GET(req: Request) {
  console.log('GET /api/sessions called');
  console.log('Request headers:', Object.fromEntries(req.headers.entries()));
  console.log('Current sessions:', sessions);
  return new NextResponse(JSON.stringify(sessions), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }
    const newSession = {
      id: (sessions.length + 1).toString(),
      ...data,
      date: new Date().toISOString().split('T')[0], // Current date
    };
    sessions.push(newSession);
    console.log('Created new session:', newSession);
    return new NextResponse(JSON.stringify(newSession), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Error in POST /api/sessions:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error', details: errorMessage }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
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
