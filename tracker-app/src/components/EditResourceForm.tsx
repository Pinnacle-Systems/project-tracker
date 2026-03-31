'use client'

import { useState, useTransition } from 'react'
import { updateResource, deleteResource } from '@/lib/actions'

type Resource = {
  id: string
  name: string
  role: string | null
}

export function EditResourceForm({ resource }: { resource: Resource }) {
  const [editing, setEditing] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (
      window.confirm(
        `Delete "${resource.name}"? This will remove them from any assigned schedules.`
      )
    ) {
      startTransition(async () => {
        await deleteResource(resource.id)
      })
    }
  }

  if (editing) {
    return (
      <form
        action={(formData) => {
          startTransition(async () => {
            await updateResource(resource.id, formData)
            setEditing(false)
          })
        }}
        className="space-y-3"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            name="name"
            defaultValue={resource.name}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <input
            name="role"
            type="text"
            defaultValue={resource.role ?? ''}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          />
        </div>
        <div className="flex items-center justify-between pt-1">
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isPending}
              className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-md disabled:opacity-50"
            >
              {isPending ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-md border border-gray-300"
            >
              Cancel
            </button>
          </div>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="text-sm font-medium text-red-600 hover:text-red-900 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </form>
    )
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-gray-500">{resource.role || 'No role provided'}</p>
        <div className="flex gap-3 ml-4">
          <button
            onClick={() => setEditing(true)}
            className="text-sm font-medium text-blue-600 hover:text-blue-900"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="text-sm font-medium text-red-600 hover:text-red-900 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
