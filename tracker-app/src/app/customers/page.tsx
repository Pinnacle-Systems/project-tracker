import { getCustomers, createCustomer } from '@/lib/actions'
import { Card } from '@/components/Card'
import { SubmitButton } from '@/components/SubmitButton'
import { EditCustomerForm } from '@/components/EditCustomerForm'
import SearchValue from '@/components/SearchValue'

export const dynamic = 'force-dynamic'

export default async function CustomersPage() {
  const customers = await getCustomers()

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Customers</h2>
        <p className="text-gray-500 mt-2">Manage your customer database and their contacts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.3fr_2fr_1fr] gap-8">
        <div className="md:col-span-1">
          <Card title="Add New Customer">
            <form action={createCustomer} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Company Name</label>
                <input type="text" name="name" id="name" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" placeholder="Acme Corp" />
              </div>
              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Primary Contact Email</label>
                <input type="email" name="contact" id="contact" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" placeholder="hello@acme.corp" />
              </div>
              <SubmitButton title="Create Customer" loadingTitle="Creating..." />
            </form>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-4">
          {customers.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-lg border border-gray-200 text-gray-500">
              No customers found. Create one to get started!
            </div>
          ) : <SearchValue data={customers} />}
          {/* {customers.map(c => (
            <Card key={c.id} title={c.name}>
              <EditCustomerForm customer={c} />
            </Card>
          ))} */}
          
        </div>
      </div>
    </div>
  )
}
