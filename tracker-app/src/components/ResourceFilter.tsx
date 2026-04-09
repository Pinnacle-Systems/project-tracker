'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'

export function ResourceFilter({ resources }: { resources: { id: string; name: string; role: string | null }[] }) {

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentResource = searchParams.get('resourceId') || ''

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newResourceId = e.target.value
    const params = new URLSearchParams(searchParams)
    if (newResourceId) {
      params.set('resourceId', newResourceId)
    } else {
      params.delete('resourceId')
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="resourceFilter" className="text-sm font-medium text-gray-700">Filter by Resource:</label>
      <select
        id="resourceFilter"
        value={currentResource}
        onChange={handleChange}
        className="block w-48 cursor-pointer rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border bg-white"
      >
        <option value="">All Resources</option>
        {resources.map((r) => (
          <option key={r.id} value={r.id}>
            {r.name} {r.role ? `(${r.role})` : ''}
          </option>
        ))}
      </select>
    </div>
  )
}