import Link from 'next/link';

interface Session {
  id: string;
  title: string;
  date: string;
  distance: number;
  targetPace: string;
  duration: string;
  comment?: string;
}

async function getSession(id: string): Promise<Session> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sessions/${id}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch session');
  }
  return res.json();
}

export default async function SessionPage({ params }: { params: { id: string } }) {
  try {
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
    );
  } catch (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Error fetching session</h1>
        <p>{error instanceof Error ? error.message : String(error)}</p>
        <Link href="/" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">
          Back to All Sessions
        </Link>
      </div>
    );
  }
}
