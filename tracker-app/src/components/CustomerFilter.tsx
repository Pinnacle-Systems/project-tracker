'use client'

export function CustomerFilter({
  customers,
  projects = [],
  category = 'customer',
  resources = [],
  selectedCustomerId,
  onValueChange,
  from
}: {
  customers: Array<{ id: string; name: string }>
  category?: string
  resources?: Array<{ id: string; name: string; role: string | null }>
  projects?: Array<{ id: string; customerId: string; name: string; schedules: any[]; customer: { id: string, name: string }; resourceId: string }>
  selectedCustomerId: string
  from?: string
  onValueChange: (value: string) => void
}) {

  return (
    <div>
      <select
        value={selectedCustomerId}
        onChange={(e) => onValueChange(e.target.value)}
        className="cursor-pointer rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border bg-white"
      >
        <option value="">All {category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Customers'}</option>
        {(category== null ||category === 'customer') && customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        {/* {category === 'project' && projects.map(p => <option key={p.id} value={p.customer.id}>{p.name}</option>)} */}
        {category === 'type' && [...new Set(projects.flatMap(p => p.schedules.map((s: any) => s.type)))].map(type => <option key={type} value={type}>{type}</option>)}
        {category === 'status' && [...new Set(projects.flatMap(p => p.schedules.map((s: any) => s.status)))].map(status => <option key={status} value={status}>{status}</option>)}
        {category === 'resources' &&  [...new Set(projects.flatMap(p => p.schedules.flatMap((s: any) => s.resourceId || [])))].map(resourceId => {
          const resource = resources.find(r => r.id === resourceId);
          return <option key={resourceId} value={resourceId}>{resource ? `${resource.name} (${resource.role})` : resourceId}</option>
        })}
      </select>
    </div>
  )
}