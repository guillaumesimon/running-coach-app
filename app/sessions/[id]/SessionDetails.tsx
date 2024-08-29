'use client'

import Link from 'next/link'

interface Session {
  id: string
  title: string
  distance: number
  targetPace: string
  comment?: string
  duration: string
  date: string
}

export default function SessionDetails({ session }: { session: Session }) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{session.title}</h1>
      <div className="mb-4">
        <p>Date: {session.date}</p>
        <p>Distance: {session.distance} km</p>
        <p>Target Pace: {session.targetPace} min/km</p>
        <p>Duration: {session.duration}</p>
        {session.comment && <p>Comment: {session.comment}</p>}
      </div>
      <Link href="/" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">
        Back to All Sessions
      </Link>
    </div>
  )
}
