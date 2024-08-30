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
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/sessions`;
  console.log('Fetching sessions from:', apiUrl);
  try {
    const res = await fetch(apiUrl, { cache: 'no-store' });
    console.log('Fetch response status:', res.status);
    if (!res.ok) {
      throw new Error(`Failed to fetch sessions: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Fetched sessions:', data);
    return data;
  } catch (error) {
    console.error('Error fetching sessions:', error);
    throw error;
  }
}

export default async function Home() {
  const sessions = await getSessions();

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
}
