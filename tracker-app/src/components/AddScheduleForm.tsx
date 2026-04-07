'use client'

import { createSchedule, updateSchedule } from '@/lib/actions'
import { SubmitButton } from './SubmitButton'
import { useState, useActionState, useTransition, useEffect } from 'react'

type Resource = { id: string; name: string; role: string | null }

type Schedule = {
  id: string
  type: string
  name: string | null
  moduleName: string | null
  date: string
  startDate: string | null
  recurrence: string
  amount: number | null
  resourceId: string | null
  status: string
}

export function AddScheduleForm({ projectId, resources, editingSchedule, onCancelEdit, onSuccess, scheduleType }: { 
  projectId: string; 
  resources: Resource[]; 
  editingSchedule?: Schedule | null; 
  onCancelEdit?: () => void;
  onSuccess?: () => void;
  scheduleType?: string;
}) {
  const [type, setType] = useState(editingSchedule?.type || scheduleType ? scheduleType : 'dev')
  const [isPending, startTransition] = useTransition()
  const [state, formAction] = useActionState(async (prevState: any, formData: FormData) => {
    return editingSchedule ? await updateSchedule(formData) : await createSchedule(formData)
  }, { success: false, timestamp: 0 })

  useEffect(() => {
    setType(editingSchedule?.type || scheduleType ? scheduleType : 'dev')
  }, [editingSchedule])

  useEffect(() => {
    if (state.success && onSuccess) {
      onSuccess()
    }
  }, [state, onSuccess])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(() => {
      formAction(formData)
    })
  }

  const formatDate = (value: string | Date | null | undefined) => {
    if (!value) return ''
    return new Date(value).toISOString().split('T')[0]
  } 
  return (
    <form key={editingSchedule?.id ?? 'new'} onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="projectId" value={projectId} />
      {editingSchedule && <input type="hidden" name="id" value={editingSchedule.id} />}
      
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
          defaultValue={editingSchedule?.resourceId || ''}
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
              <input 
                type="date" 
                id="startDate" 
                name="startDate" 
                defaultValue={formatDate(editingSchedule?.startDate)} 
                required 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
              />
            </div>
        )}
        {type === 'delivery' && (
            <div>
              <label htmlFor="moduleName" className="block text-sm font-medium text-gray-700">Module Name</label>
              <input 
                type="text" 
                id="moduleName" 
                name="moduleName" 
                defaultValue={editingSchedule?.moduleName || ''} 
                required 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
              />
            </div>
        )}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date/Deadline</label>
          <input 
            type="date" 
            name="date" 
            id="date" 
            defaultValue={formatDate(editingSchedule?.date)} 
            required 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
          />
        </div>

        {type === 'payment' && (
          <div className="space-y-4 p-4 border border-blue-100 bg-blue-50 rounded-md">
            <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide">Payment Details</p>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Title (e.g. Cloud Hosting)</label>
              <input 
                type="text" 
                name="name" 
                id="name" 
                defaultValue={editingSchedule?.name || ''} 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount (₹)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  name="amount" 
                  id="amount" 
                  defaultValue={editingSchedule?.amount || ''} 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
                />
              </div>
              <div>
                <label htmlFor="recurrence" className="block text-sm font-medium text-gray-700">Recurrence</label>
                <select 
                  name="recurrence" 
                  id="recurrence" 
                  defaultValue={editingSchedule?.recurrence || 'none'} 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border bg-white"
                >
                  <option value="none">One-time</option>
                  <option value="monthly">Monthly</option>
                  <option value="annual">Annual</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex space-x-4">
        {/* Passing loading state manually since we are bypassing the autoform status */}
        <SubmitButton title={editingSchedule ? "Update Schedule" : "Add Schedule"} loadingTitle={editingSchedule ? "Updating..." : "Adding..."} forceLoading={isPending} />
        {editingSchedule && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
