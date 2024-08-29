'use client'

import { useState } from 'react'

export default function Settings() {
  const [settings, setSettings] = useState({
    firstName: '',
    coachingStyle: '',
    language: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Save settings to backend
    console.log('Settings saved:', settings)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">User Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="firstName" className="block">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={settings.firstName}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label htmlFor="coachingStyle" className="block">Coaching Style</label>
          <select
            id="coachingStyle"
            name="coachingStyle"
            value={settings.coachingStyle}
            onChange={handleChange}
            className="border p-2 w-full"
          >
            <option value="">Select a style</option>
            <option value="motivational">Motivational</option>
            <option value="technical">Technical</option>
            <option value="supportive">Supportive</option>
          </select>
        </div>
        <div>
          <label htmlFor="language" className="block">Language</label>
          <select
            id="language"
            name="language"
            value={settings.language}
            onChange={handleChange}
            className="border p-2 w-full"
          >
            <option value="">Select a language</option>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Save Settings
        </button>
      </form>
    </div>
  )
}
