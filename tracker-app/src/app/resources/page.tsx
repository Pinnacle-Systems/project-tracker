import { getResources, createResource } from '@/lib/actions'
import { Card } from '@/components/Card'
import { SubmitButton } from '@/components/SubmitButton'
import { EditResourceForm } from '@/components/EditResourceForm'

export const dynamic = 'force-dynamic'

export default async function ResourcesPage() {
  const resources = await getResources()

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Resources</h2>
        <p className="text-gray-500 mt-2">Manage the people or entities that can be assigned to schedules.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card title="Add New Resource">
            <form action={createResource} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" name="name" id="name" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" placeholder="John Doe" />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                <input type="text" name="role" id="role" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" placeholder="Developer" />
              </div>
              <SubmitButton title="Create Resource" loadingTitle="Creating..." />
            </form>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-4 overflow-auto h-[70vh]">
          {resources.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-lg border border-gray-200 text-gray-500">
              No resources found. Create one to get started!
            </div>
          ) : null}
          {resources.map(r => (
            <Card key={r.id} title={r.name}>
              <EditResourceForm resource={r} />
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
