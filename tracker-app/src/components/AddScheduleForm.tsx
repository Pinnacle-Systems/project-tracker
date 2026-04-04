'use client'

import { createSchedule } from '@/lib/actions'
import { SubmitButton } from './SubmitButton'
import { useState, useActionState, useTransition } from 'react'

type Resource = { id: string; name: string; role: string | null }

export function AddScheduleForm({ projectId, resources }: { projectId: string; resources: Resource[] }) {
  const [type, setType] = useState('dev')
  const [isPending, startTransition] = useTransition()
  
  const [state, formAction] = useActionState(async (prevState: any, formData: FormData) => {
    return await createSchedule(formData)
  }, { success: false, timestamp: 0 })

  // Manual submit handler to prevent the browser's automatic form reset
  // which is triggered by React 19's form action prop.
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(() => {
      formAction(formData)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <label htmlFor="resourceId" className="block text-sm font-medium text-gray-700">Assigned Resource (Optional)</label>
        <select 
          name="resourceId" 
          id="resourceId" 
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border bg-white"
        >
          <option value="">Unassigned</option>
          {resources.map(r => (
            <option key={r.id} value={r.id}>
              {r.name} {r.role ? `(${r.role})` : ''}
            </option>
          ))}
        </select>
      </div>

      <div key={state.timestamp} className="space-y-4">
        {type === 'dev' && (
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
              <input type="date" id="startDate" name="startDate" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
            </div>
        )}
        {type === 'delivery' && (
            <div>
              <label htmlFor="moduleName" className="block text-sm font-medium text-gray-700">Module Name</label>
              <input type="text" id="moduleName" name="moduleName" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
            </div>
        )}
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
      </div>

      {/* Passing loading state manually since we are bypassing the autoform status */}
      <SubmitButton title="Add Schedule" loadingTitle="Adding..." forceLoading={isPending} />
    </form>
  )
}
