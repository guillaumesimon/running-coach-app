import Link from 'next/link'

async function getSession(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sessions/${id}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch session');
  }
  return res.json();
}

export default async function SessionPage({ params }: { params: { id: string } }) {
  const session = await getSession(params.id);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{session.title}</h1>
      <p>Date: {session.date}</p>
      <p>Distance: {session.distance} km</p>
      <p>Target Pace: {session.targetPace} min/km</p>
      <p>Duration: {session.duration}</p>
      {session.comment && <p>Comment: {session.comment}</p>}
      <Link href="/" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">
        Back to All Sessions
      </Link>
    </div>
  )
}
