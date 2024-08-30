import Link from 'next/link'

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
  console.log('Fetching sessions from:', `${process.env.NEXT_PUBLIC_API_URL}/api/sessions`);
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sessions`, { 
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  console.log('Response status:', res.status);
  console.log('Response headers:', JSON.stringify(Object.fromEntries(res.headers.entries()), null, 2));
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error('Error response body:', errorText);
    throw new Error(`Failed to fetch sessions: ${res.status} ${res.statusText}. Body: ${errorText}`);
  }
  
  const data = await res.json();
  console.log('Fetched sessions:', data);
  return data;
}

export default async function Home() {
  try {
    console.log('Rendering Home page');
    const sessions = await getSessions();
    console.log('Sessions fetched successfully:', sessions);

    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Your Running Sessions</h1>
        {sessions.length > 0 ? (
          <ul>
            {sessions.map((session: Session) => (
              <li key={session.id} className="mb-2">
                <Link href={`/sessions/${session.id}`}>
                  {session.title} - {session.date}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No sessions found. Create a new one!</p>
        )}
        <Link href="/sessions/new" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">
          Create New Session
        </Link>
      </div>
    )
  } catch (error) {
    console.error('Error in Home component:', error);
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Error fetching sessions</h1>
        <p>Error details: {error instanceof Error ? error.message : String(error)}</p>
        <p>API URL: {process.env.NEXT_PUBLIC_API_URL}</p>
        <Link href="/sessions/new" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">
          Create New Session
        </Link>
      </div>
    )
  }
}
