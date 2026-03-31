'use client'

import { createSchedule } from '@/lib/actions'
import { SubmitButton } from './SubmitButton'
import { useState } from 'react'

export function AddScheduleForm({ projectId }: { projectId: string }) {
  const [type, setType] = useState('dev')

  return (
    <form action={createSchedule} className="space-y-4">
      <input type="hidden" name="projectId" value={projectId} />
      
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
        <select 
          name="type" 
          id="type" 
          value={type}
          onChange={(e) => setType(e.target.value)}
          required 
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border bg-white"
        >
          <option value="dev">Dev</option>
          <option value="delivery">Delivery</option>
          <option value="payment">Payment</option>
        </select>
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date/Deadline</label>
        <input type="date" name="date" id="date" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
      </div>

      {type === 'payment' && (
        <div className="space-y-4 p-4 border border-blue-100 bg-blue-50 rounded-md">
          <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide">Payment Details</p>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Title (e.g. Cloud Hosting)</label>
            <input type="text" name="name" id="name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount (₹)</label>
              <input type="number" step="0.01" name="amount" id="amount" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
            </div>
            <div>
              <label htmlFor="recurrence" className="block text-sm font-medium text-gray-700">Recurrence</label>
              <select name="recurrence" id="recurrence" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border bg-white">
                <option value="none">One-time</option>
                <option value="monthly">Monthly</option>
                <option value="annual">Annual</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <SubmitButton title="Add Schedule" loadingTitle="Adding..." />
    </form>
  )
}
