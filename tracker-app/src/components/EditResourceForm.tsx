'use client'

import { useState, useTransition } from 'react'
import { updateResource, deleteResource } from '@/lib/actions'
import { Pagination } from './Pagination'

type Resource = {
  id: string
  name: string
  role: string | null
}

export function EditResourceForm({ resources, onEditResource, totalPages, currentPage, totalCount }: { resources: Resource[]; onEditResource?: (resource: Resource) => void; totalPages: number; currentPage: number; totalCount: number }) {

  const [isPending, startTransition] = useTransition()
  const handleDelete = (name: string, id: string) => {
    if (
      window.confirm(
        `Delete "${name}"? This will remove them from any assigned schedules.`
      )
    ) {
      startTransition(async () => {
        await deleteResource(id)
      })
    }
  }

  return (
    <div>
      <div className="flex mb-2 justify-end text-sm items-center">
        <Pagination totalPages={totalPages} currentPage={currentPage} totalCount={totalCount} />
      </div>
      <div className="border border-gray-300 rounded-lg max-h-[64vh] overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50 whitespace-nowrap">
            <tr>
              <th className="sticky top-0 z-10 bg-gray-50 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">S No</th>
              <th className="sticky top-0 z-10 bg-gray-50 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Name</th>
              <th className="sticky top-0 z-10 bg-gray-50 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Role</th>
              <th className="sticky top-0 z-10 bg-gray-50 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {resources.map((r, index) => (
              <tr key={r.id}>
                <td className="whitespace-nowrap px-3 py-1 text-sm text-gray-500">{index + 1}</td>
                <td className="whitespace-nowrap px-3 py-1 text-sm text-gray-500">{r.name}</td>
                <td className="whitespace-nowrap px-3 py-1 text-sm text-gray-500">{r.role ?? '-'}</td>
                <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onEditResource?.(r)}
                      disabled={isPending}
                      className="flex text-sm cursor-pointer mr-2 font-medium text-blue-600 hover:text-blue-900"
                      title="Edit"
                    >
                      <i className="material-icons !text-[16px]">edit</i>
                    </button>
                    <button
                      onClick={() => handleDelete(r.name, r.id)}
                      className="flex text-sm cursor-pointer font-medium text-red-600 hover:text-red-900"
                      title="Delete" disabled={isPending}
                    >
                      <i className="material-icons !text-[16px]">delete</i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
