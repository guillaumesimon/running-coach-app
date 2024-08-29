'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface CoachSpeech {
  timestamp: string
  text: string
}

interface Session {
  id: string
  title: string
  distance: number
  targetPace: string
  comment?: string
  duration: string
  coachSpeech: CoachSpeech[]
}

export default function SessionDetails({ id }: { id: string }) {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    // TODO: Fetch session data from backend
    // For now, we'll use mock data
    const mockSession: Session = {
      id: id,
      title: 'Morning Run',
      distance: 5,
      targetPace: '05:30',
      comment: 'Easy run',
      duration: '00:27:30',
      coachSpeech: [
        { timestamp: '00:00', text: "Let's get started! Remember to warm up properly." },
        { timestamp: '00:05:00', text: "Great pace! You're doing well. Keep it up!" },
        { timestamp: '00:15:00', text: "Halfway there! Stay focused and maintain your form." },
        { timestamp: '00:25:00', text: "Final push! You've got this. Finish strong!" },
      ]
    }
    setSession(mockSession)
  }, [id])

  if (!session) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{session.title}</h1>
      <div className="mb-4">
        <p>Distance: {session.distance} km</p>
        <p>Target Pace: {session.targetPace} min/km</p>
        <p>Duration: {session.duration}</p>
        {session.comment && <p>Comment: {session.comment}</p>}
      </div>
      <h2 className="text-xl font-bold mb-2">Coach Speech</h2>
      <ul className="space-y-2">
        {session.coachSpeech.map((speech, index) => (
          <li key={index} className="border p-2">
            <span className="font-bold">{speech.timestamp}:</span> {speech.text}
          </li>
        ))}
      </ul>
      <Link href="/" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">
        Back to All Sessions
      </Link>
    </div>
  )
}
