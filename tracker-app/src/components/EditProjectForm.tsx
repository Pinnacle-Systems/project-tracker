'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { updateProject, deleteProject } from '@/lib/actions'

type Schedule = { id: string; type: string; date: Date; status: string }

type Project = {
  id: string
  name: string
  numberOfUsersForBilling: number
  customer: { name: string }
  schedules: Schedule[]
}

export function EditProjectForm({ project }: { project: Project }) {
  const [editing, setEditing] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (
      window.confirm(
        `Delete "${project.name}"? This will also permanently delete all its schedules.`
      )
    ) {
      startTransition(() => deleteProject(project.id))
    }
  }

  if (editing) {
    return (
      <form
        action={(formData) => {
          startTransition(async () => {
            await updateProject(project.id, formData)
            setEditing(false)
          })
        }}
        className="space-y-3"
      >
        <div className="flex">
          <div className='mr-5'>
            <label className="block text-sm font-medium text-gray-700">Project Name</label>
            <input
              name="name"
              defaultValue={project.name}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Billable Users</label>
            <input
              name="numberOfUsersForBilling"
              type="number"
              min="1"
              defaultValue={project.numberOfUsersForBilling}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            />
          </div>
        </div>
        {/* <div className="flex items-center justify-between pt-1"> */}
          <div className="flex justify-end gap-2">
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
          {/* <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="text-sm font-medium text-red-600 hover:text-red-900 disabled:opacity-50"
          >
            Delete
          </button> */}
        {/* </div> */}
      </form>
    )
  }

  return (
    <div>
      <div className="flex justify-end-safe items-center">
        <Link
          href={`/projects/${project.id}`}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-3 py-1 rounded-md"
        >
          Manage Schedules &rarr;
        </Link>
        <button
          onClick={() => setEditing(true)}
          className="text-sm ml-5 font-medium text-blue-600 hover:text-blue-900"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="text-sm ml-5 font-medium text-red-600 hover:text-red-900 disabled:opacity-50"
        >
          Delete
        </button>
      </div>
      {/* <h4 className="text-sm font-medium text-gray-900 mb-2">
        Schedules ({project.schedules.length})
      </h4> */}
      {/* {project.schedules.length === 0 ? (
        <p className="text-sm text-gray-500">No schedules defined yet.</p>
      ) : (
        <ul className="space-y-2">
          {project.schedules.map((s) => (
            <li
              key={s.id}
              className="flex justify-between items-center text-sm p-3 bg-gray-50 rounded border border-gray-200"
            >
              <div className="flex items-center space-x-3">
                <span className="uppercase text-xs font-bold tracking-wider text-gray-500">
                  {s.type}
                </span>
                <span className="text-gray-900 font-medium">
                  {new Date(s.date).toLocaleDateString()}
                </span>
              </div>
              <span
                className={`px-2 py-1 text-xs rounded-full font-medium ${
                  s.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {s.status}
              </span>
            </li>
          ))}
        </ul>
      )} */}
    </div>
  )
}
