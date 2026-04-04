'use client'

export function CustomerFilter({ 
  customers, 
  selectedCustomerId, 
  onCustomerChange 
}: { 
  customers: Array<{ id: string; name: string }>
  selectedCustomerId: string
  onCustomerChange: (customerId: string) => void
}) {    
  return (
    <div>
      <select 
        value={selectedCustomerId}
        onChange={(e) => onCustomerChange(e.target.value)}
        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border bg-white"
      >
        <option value="">All Customers</option>
         {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
    </div>
  )
}