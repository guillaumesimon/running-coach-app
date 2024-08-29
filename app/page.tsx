import Link from 'next/link'

async function getSessions() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sessions`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch sessions');
  }
  return res.json();
}

export default async function Home() {
  const sessions = await getSessions();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Your Running Sessions</h1>
      <ul>
        {sessions.map((session: { id: string; title: string; date: string }) => (
          <li key={session.id} className="mb-2">
            <Link href={`/sessions/${session.id}`}>
              {session.title} - {session.date}
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/sessions/new" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">
        Create New Session
      </Link>
    </div>
  )
}
