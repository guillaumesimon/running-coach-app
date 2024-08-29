import Link from 'next/link'

export default function Home() {
  // Mock data for now
  const sessions = [
    { id: '1', name: 'Morning Run', date: '2023-04-01' },
    { id: '2', name: 'Evening Jog', date: '2023-03-30' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Your Running Sessions</h1>
      <ul>
        {sessions.map(session => (
          <li key={session.id} className="mb-2">
            <Link href={`/sessions/${session.id}`}>
              {session.name} - {session.date}
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
