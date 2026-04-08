'use client'

import { useState, useTransition } from 'react'
import { createProject, updateProject } from '@/lib/actions'
import { Card } from './Card'

type Customer = { id: string; name: string }

type Project = {
  id: string
  name: string
  numberOfUsersForBilling: number
  customer: Customer
  customerId?: string
}

export function EditProjectForm({
  customers,
  editingProject,
  onCancelEdit,
  onSuccess
}: {
  customers?: Customer[]
  editingProject?: Project | null
  onCancelEdit?: () => void
  onSuccess?: () => void
}) {
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      if (editingProject?.id) {
        await updateProject(editingProject.id, formData)
      } else {
        await createProject(formData)
      }
      onSuccess?.()
    })
  }

  const cardTitle = editingProject ? 'Edit Project' : 'Start New Project'

  return (
    <Card title={cardTitle}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Project Name</label>
          <input
            type="text"
            name="name"
            id="name"
            defaultValue={editingProject?.name || ''}
            placeholder={!editingProject ? 'Lunar Base UX' : ''}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          />
        </div>
        {customers && (
        <div>
          <label htmlFor="customerId" className="block text-sm font-medium text-gray-700">Customer</label>
          <select
            key={editingProject?.id || 'new'}
            name="customerId"
            id="customerId"
            defaultValue={editingProject?.customerId}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border bg-white"
          >
            <option value="">Select a customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        )}
        <div>
          <label htmlFor="numberOfUsersForBilling" className="block text-sm font-medium text-gray-700">Billable Users</label>
          <input
            type="number"
            name="numberOfUsersForBilling"
            id="numberOfUsersForBilling"
            defaultValue={editingProject?.numberOfUsersForBilling || 1}
            min="1"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          />
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isPending}
              className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-md disabled:opacity-50"
            >
              {isPending ? 'Saving...' : editingProject ? 'Update' : 'Create Project'}
            </button>
            {editingProject && (
              <button
                type="button"
                onClick={onCancelEdit}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-md border border-gray-300"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>
    </Card>
  )
}
