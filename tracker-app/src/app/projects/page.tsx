import { getProjects, getCustomers, createProject } from '@/lib/actions'
import { Card } from '@/components/Card'
import { SubmitButton } from '@/components/SubmitButton'
import { ProjectsList } from '@/components/ProjectsList'

export const dynamic = 'force-dynamic'

export default async function ProjectsPage({ searchParams }: { searchParams?: Promise<{ page?: string; limit?: string }> }) {

  const params: any = await searchParams;
  const currentPage = Number(params.page) || 1;
  const limit = params.limit === 'all' ? 'all' : Number(params.limit) || 25;

  const [{ projects, totalPages, totalCount }, customers] = await Promise.all([
    getProjects(currentPage, limit),
    getCustomers()
  ])
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-[1.3fr_2fr_1fr] gap-8">
        <div className="md:col-span-1">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Projects</h2>
            <p className="text-gray-500 mt-2 mb-2">Manage projects and their associated schedules.</p>
          </div>
          <Card title="Start New Project">
            <form action={createProject} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Project Name</label>
                <input type="text" name="name" id="name" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" placeholder="Lunar Base UX" />
              </div>
              <div>
                <label htmlFor="customerId" className="block text-sm font-medium text-gray-700">Customer</label>
                <select name="customerId" id="customerId" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border bg-white">
                  <option value="">Select a customer</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="numberOfUsersForBilling" className="block text-sm font-medium text-gray-700">Billable Users</label>
                <input type="number" name="numberOfUsersForBilling" id="numberOfUsersForBilling" defaultValue="1" min="1" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
              </div>
              <SubmitButton title="Create Project" loadingTitle="Creating..." />
            </form>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-4 mt-[20px]">
          {/* {projects.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-lg border border-gray-200 text-gray-500">
              No projects found. Create one to get started!
            </div>
          ) : null} */}

          <ProjectsList projects={projects} customers={customers} totalPages={totalPages} currentPage={currentPage} totalCount={totalCount} />

        </div>
      </div>
    </div>
  )
}
