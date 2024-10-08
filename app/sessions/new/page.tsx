'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'


export default function CreateSession() {
  const router = useRouter()
  const [session, setSession] = useState({
    title: '',
    distance: '',
    targetPace: '',
    comment: '',
  })
  const [duration, setDuration] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSession({ ...session, [e.target.name]: e.target.value })
    if (e.target.name === 'distance' || e.target.name === 'targetPace') {
      calculateDuration()
    }
  }

  const calculateDuration = () => {
    const distance = parseFloat(session.distance)
    const pace = session.targetPace.split(':')
    const paceMinutes = parseInt(pace[0])
    const paceSeconds = parseInt(pace[1] || '0')

    if (distance && paceMinutes) {
      const totalMinutes = distance * (paceMinutes + paceSeconds / 60)
      const hours = Math.floor(totalMinutes / 60)
      const minutes = Math.floor(totalMinutes % 60)
      setDuration(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`)
    } else {
      setDuration('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    console.log('Submitting session:', session)
    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...session, duration }),
      })
      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)
      const responseText = await response.text()
      console.log('Response text:', responseText)
      if (!response.ok) {
        const errorData = JSON.parse(responseText)
        throw new Error(`Failed to create session: ${response.status} ${response.statusText}. ${errorData.error}`)
      }
      const data = JSON.parse(responseText)
      console.log('Created session:', data)
      router.push(`/sessions/${data.id}`)
    } catch (error) {
      console.error('Error creating session:', error)
      setError(`Failed to create session. Please try again. ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Create New Running Session</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block">Session Title*</label>
          <input
            type="text"
            id="title"
            name="title"
            value={session.title}
            onChange={handleChange}
            required
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label htmlFor="distance" className="block">Distance (km)*</label>
          <input
            type="number"
            id="distance"
            name="distance"
            value={session.distance}
            onChange={handleChange}
            required
            step="0.01"
            min="0"
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label htmlFor="targetPace" className="block">Target Pace (min:sec per km)*</label>
          <input
            type="text"
            id="targetPace"
            name="targetPace"
            value={session.targetPace}
            onChange={handleChange}
            required
            placeholder="00:00"
            pattern="[0-9]{2}:[0-5][0-9]"
            className="border p-2 w-full"
          />
        </div>
        {duration && (
          <div>
            <label className="block">Estimated Duration</label>
            <p>{duration}</p>
          </div>
        )}
        <div>
          <label htmlFor="comment" className="block">Comment</label>
          <textarea
            id="comment"
            name="comment"
            value={session.comment}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300"
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Create Session'}
        </button>
      </form>
    </div>
  )
}
