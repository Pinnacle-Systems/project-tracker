'use client'

import { useState, useTransition } from 'react'
import { updateCustomer, deleteCustomer } from '@/lib/actions'

type Project = { id: string; name: string; numberOfUsersForBilling: number }

type Customer = {
  id: string
  name: string
  contact: string | null
  projects: Project[]
}

export function EditCustomerForm({ customer }: { customer: Customer }) {
  const [editing, setEditing] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (
      window.confirm(
        `Delete "${customer.name}"? This will also permanently delete all their projects and schedules.`
      )
    ) {
      startTransition(() => deleteCustomer(customer.id))
    }
  }

  const projectTooltip = customer.projects?.length > 0
    ? customer.projects.map(p => `• ${p.name} (${p.numberOfUsersForBilling} users)`).join('\n')
    : "No projects yet";

  if (editing) {
    return (
      <form
        action={(formData) => {
          startTransition(async () => {
            await updateCustomer(customer.id, formData)
            setEditing(false)
          })
        }}
        className="space-y-3 border border-gray-300 rounded-lg p-4 my-2"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">Company Name</label>
          <input
            name="name"
            defaultValue={customer.name}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Email</label>
          <input
            name="contact"
            type="email"
            defaultValue={customer.contact ?? ''}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          />
        </div>
        <div className="flex items-center justify-between pt-1">
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isPending}
              className="cursor-pointer text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-md disabled:opacity-50"
            >
              {isPending ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-md border border-gray-300"
            >
              Cancel
            </button>
          </div>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="cursor-pointer text-sm font-medium text-red-600 hover:text-red-900 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </form>
    )
  }

  return (
    <div>
      {/* <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-gray-500">{customer.contact || 'No contact provided'}</p>
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
      <h4 className="text-sm font-medium text-gray-900 mb-2">Projects ({customer.projects.length})</h4>
      {customer.projects.length === 0 ? (
        <p className="text-sm text-gray-500">No projects yet.</p>
      ) : (
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          {customer.projects.map((p) => (
            <li key={p.id}>
              {p.name} <span className="text-gray-400">({p.numberOfUsersForBilling} users)</span>
            </li>
          ))}
        </ul>
      )} */}
      <div className="flex justify-between p-2 border border-gray-300 rounded-lg">
        <div>
          <p className="text-sm">{customer.name}</p>
          <p className="text-sm text-gray-500">{customer.contact || 'No contact provided'}</p>
        </div>
        <div >
          <div className="text-right">
            <button
              onClick={() => setEditing(true)}
              className="text-sm cursor-pointer text-right font-medium text-blue-600 hover:text-blue-900"
            >
              <i className="material-icons !text-[16px]">edit</i>
            </button>
            {/* <button
            onClick={handleDelete}
            disabled={isPending}
            className="text-sm font-medium text-red-600 hover:text-red-900 disabled:opacity-50"
          >
            <i className="material-icons !text-[16px]">delete</i>
          </button> */}
          </div>
          <button className="text-sm cursor-pointer text-blue-600 hover:text-blue-800" title={projectTooltip}>
            Projects ({customer.projects.length})
          </button>
        </div>
      </div>
    </div>
  )
}
