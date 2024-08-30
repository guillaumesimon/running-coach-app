'use client';

import { useState, useEffect } from 'react';
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
    throw new Error(`Failed to fetch session: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

async function generateSpeech(sessionId: string): Promise<string> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/generate-speech`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId }),
  });

  if (!res.ok) {
    throw new Error(`Failed to generate speech: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.speech;
}

export default function SessionPage({ params }: { params: { id: string } }) {
  const [session, setSession] = useState<Session | null>(null);
  const [speech, setSpeech] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSession(params.id)
      .then(setSession)
      .catch(err => setError(err.message));
  }, [params.id]);

  const handleGenerateSpeech = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const generatedSpeech = await generateSpeech(params.id);
      setSpeech(generatedSpeech);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p>{error}</p>
        <Link href="/" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">
          Back to All Sessions
        </Link>
      </div>
    );
  }

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{session.title}</h1>
      <p>Date: {session.date}</p>
      <p>Distance: {session.distance} km</p>
      <p>Target Pace: {session.targetPace} min/km</p>
      <p>Duration: {session.duration}</p>
      {session.comment && <p>Comment: {session.comment}</p>}
      
      <button
        onClick={handleGenerateSpeech}
        disabled={isGenerating}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {isGenerating ? 'Generating...' : 'Generate Coaching Speech'}
      </button>

      {speech && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Coaching Speech</h2>
          <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded">{speech}</pre>
        </div>
      )}

      <Link href="/" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">
        Back to All Sessions
      </Link>
    </div>
  );
}
