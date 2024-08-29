import SessionDetails from './SessionDetails'

async function getSession(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sessions/${id}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch session');
  }
  return res.json();
}

export default async function SessionPage({ params }: { params: { id: string } }) {
  const session = await getSession(params.id);
  return <SessionDetails session={session} />
}
