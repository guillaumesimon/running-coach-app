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
  console.log(`Fetching session with id: ${id}`);
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sessions/${id}`, { cache: 'no-store' });
  console.log('Response status:', res.status);
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error('Error response:', errorText);
    throw new Error(`Failed to fetch session: ${res.status} ${res.statusText}. ${errorText}`);
  }
  
  const data = await res.json();
  console.log('Fetched session:', data);
  return data;
}

export default async function SessionPage({ params }: { params: { id: string } }) {
  try {
    console.log(`Rendering session page for id: ${params.id}`);
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
    console.error('Error in SessionPage:', error);
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Error fetching session</h1>
        <p>Error details: {error instanceof Error ? error.message : String(error)}</p>
        <p>Session ID: {params.id}</p>
        <p>API URL: {process.env.NEXT_PUBLIC_API_URL}</p>
        <Link href="/" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">
          Back to All Sessions
        </Link>
      </div>
    );
  }
}
