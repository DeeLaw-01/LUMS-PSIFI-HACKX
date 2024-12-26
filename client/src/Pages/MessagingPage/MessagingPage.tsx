import React, { useState } from 'react'
import { useAuthStore } from '@/store/useAuthStore'

interface Message {
  id: string
  sender: string
  content: string
  timestamp: string
}

const MessagingPage: React.FC = () => {
  const { user } = useAuthStore()

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'John Doe',
      content: "Hey, how's your startup going?",
      timestamp: '2023-05-15T10:30:00Z' 
    },
    {
      id: '2',
      sender: 'Current User',
      content: "It's going great! We just secured our first round of funding.",
      timestamp: '2023-05-15T10:35:00Z'
    }
  ])
  const [newMessage, setNewMessage] = useState('')

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim()) {
      const message: Message = {
        id: String(messages.length + 1),
        sender: 'Current User',
        content: newMessage,
        timestamp: new Date().toISOString()
      }
      setMessages([...messages, message])
      setNewMessage('')
    }
  }

  return (
    <div className='max-w-2xl mx-auto bg-white rounded-lg shadow'>
      <div className='p-4 border-b'>
        <h1 className='text-xl font-semibold'>Messages</h1>
      </div>
      <div className='h-96 overflow-y-auto p-4 space-y-4'>
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === 'Current User'
                ? 'justify-end'
                : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs ${
                message.sender === 'Current User'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200'
              } rounded-lg p-3`}
            >
              <p className='text-sm'>{message.content}</p>
              <p className='text-xs text-gray-500 mt-1'>
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className='p-4 border-t'>
        <div className='flex space-x-2'>
          <input
            type='text'
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder='Type a message...'
            className='flex-grow p-2 border rounded'
          />
          <button
            type='submit'
            className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300'
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}

export default MessagingPage
