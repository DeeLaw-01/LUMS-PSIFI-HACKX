import React, { useState } from 'react'
import { PlusIcon } from 'lucide-react'

interface TimelineEvent {
  id: string
  date: string
  title: string
  description: string
}

const Timeline: React.FC = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([
    {
      id: '1',
      date: '2022-01-01',
      title: 'Founded',
      description: 'Company was founded'
    },
    {
      id: '2',
      date: '2022-06-15',
      title: 'First Funding Round',
      description: 'Raised $1M seed round'
    }
  ])

  const [newEvent, setNewEvent] = useState({
    date: '',
    title: '',
    description: ''
  })

  const addEvent = (e: React.FormEvent) => {
    e.preventDefault()
    if (newEvent.date && newEvent.title) {
      setEvents([...events, { ...newEvent, id: String(events.length + 1) }])
      setNewEvent({ date: '', title: '', description: '' })
    }
  }

  return (
    <div className='bg-white rounded-lg shadow p-6'>
      <h2 className='text-2xl font-bold mb-4'>Timeline</h2>
      <div className='space-y-6'>
        {events.map((event, index) => (
          <div key={event.id} className='flex'>
            <div className='flex flex-col items-center mr-4'>
              <div className='w-3 h-3 bg-blue-600 rounded-full'></div>
              {index < events.length - 1 && (
                <div className='w-0.5 h-full bg-blue-600'></div>
              )}
            </div>
            <div>
              <div className='font-semibold'>{event.date}</div>
              <div className='font-bold'>{event.title}</div>
              <div className='text-gray-600'>{event.description}</div>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={addEvent} className='mt-6'>
        <h3 className='text-lg font-semibold mb-2'>Add Custom Milestone</h3>
        <div className='space-y-2'>
          <input
            type='date'
            value={newEvent.date}
            onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
            className='w-full p-2 border rounded'
            required
          />
          <input
            type='text'
            value={newEvent.title}
            onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
            placeholder='Milestone Title'
            className='w-full p-2 border rounded'
            required
          />
          <textarea
            value={newEvent.description}
            onChange={e =>
              setNewEvent({ ...newEvent, description: e.target.value })
            }
            placeholder='Description (optional)'
            className='w-full p-2 border rounded'
          ></textarea>
        </div>
        <button
          type='submit'
          className='mt-2 flex items-center justify-center w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300'
        >
          <PlusIcon className='w-5 h-5 mr-2' />
          Add Milestone
        </button>
      </form>
    </div>
  )
}

export default Timeline
