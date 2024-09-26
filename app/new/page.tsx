'use client'

import React, { useState, FormEvent } from 'react'
import { title } from 'process'
import { deployContract } from '@/libs/contract/deployer'
import { useDynamicContext, useUserWallets } from '@dynamic-labs/sdk-react-core'
import { useAccount, useConnect, useProvider } from '@starknet-react/core'

interface EventData {
  title: string
  description: string
  date: string
}

interface FormErrors {
  title?: string
  description?: string
  date?: string
}

const NewEvent = () => {
    const [eventData, setEventData] = useState<EventData>({
        title: '',
        description: '',
        date: '',
      })
      

      const userWallets = useUserWallets()
      const { primaryWallet } = useDynamicContext()
      const { account, isConnected, address: starkAddress } = useAccount()
      const { provider } = useProvider()
      const { connect, connectors } = useConnect()
  
      const wallet = userWallets?.[0]
      const address = wallet?.address || starkAddress || ''

      const [errors, setErrors] = useState<FormErrors>({})
      const [isSubmitting, setIsSubmitting] = useState(false)
      const [submitSuccess, setSubmitSuccess] = useState(false)
    
      const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setEventData(prevData => ({
          ...prevData,
          [name]: value
        }))
      }
    
      const validateForm = (): boolean => {
        const newErrors: FormErrors = {}
        if (!eventData.title.trim()) {
          newErrors.title = 'Title is required'
        }
        if (!eventData.description.trim()) {
          newErrors.description = 'Description is required'
        }
        if (!eventData.date) {
          newErrors.date = 'Date is required'
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
      }
    
      const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        setSubmitSuccess(false)
    
        if (validateForm()) {
          try {
            await new Promise(resolve => setTimeout(resolve, 1000))
            console.log('Form submitted:', eventData)

            const contractAddress = await deployContract(
                primaryWallet,
                address,
                eventData.title,
                eventData.date,
                eventData.description || ''
            )
            console.log("address: ", contractAddress)

            setSubmitSuccess(true)
            setEventData({ title: '', description: '', date: '' })
          } catch (error) {
            console.error('Error submitting form:', error)
          }
        }
    
        setIsSubmitting(false)
      }

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create New Event</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={eventData.title}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${errors.title ? 'border-red-500' : ''}`}
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                name="description"
                value={eventData.description}
                onChange={handleChange}
                rows={3}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${errors.description ? 'border-red-500' : ''}`}
              ></textarea>
              {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={eventData.date}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${errors.date ? 'border-red-500' : ''}`}
              />
              {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date}</p>}
            </div>
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Submitting...' : 'Create Event'}
              </button>
            </div>
          </form>
          {submitSuccess && (
            <div className="mt-4 p-2 bg-green-100 border border-green-400 text-green-700 rounded">
              Event created successfully!
            </div>
          )}
        </div>
      )
}

export default NewEvent
