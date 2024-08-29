import Link from 'next/link'

async function getSessions() {
  try {
    console.log('Fetching sessions from:', `${process.env.NEXT_PUBLIC_API_URL}/api/sessions`);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sessions`, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Failed to fetch sessions: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Fetched sessions:', data);
    return data;
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return [];
  }
}

export default async function Home() {
  console.log('Rendering Home page');
  const sessions = await getSessions();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Your Running Sessions</h1>
      {sessions.length > 0 ? (
        <ul>
          {sessions.map(session => (
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
