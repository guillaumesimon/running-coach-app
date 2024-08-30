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
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sessions`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to fetch sessions: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export default async function Home() {
  try {
    const sessions = await getSessions();

    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Your Running Sessions</h1>
        {sessions.length > 0 ? (
          <ul>
            {sessions.map((session: Session) => (
              <li key={session.id} className="mb-2">
                <Link href={`/sessions/${session.id}`}>
                  {session.date} - {session.title} ({session.distance} km)
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
    console.error('Error fetching sessions:', error);
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Error fetching sessions</h1>
        <p>{error instanceof Error ? error.message : String(error)}</p>
        <p>API URL: {process.env.NEXT_PUBLIC_API_URL}</p>
        <Link href="/sessions/new" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">
          Create New Session
        </Link>
      </div>
    )
  }
}
