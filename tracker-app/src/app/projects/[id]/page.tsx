import { getProjectById, completeSchedule, deleteSchedule } from '@/lib/actions'
import { Card } from '@/components/Card'
import { AddScheduleForm } from '@/components/AddScheduleForm'
import { DeleteButton } from '@/components/DeleteButton'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function ProjectDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const project = await getProjectById(params.id)

  if (!project) notFound()

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
          <Link href="/projects" className="hover:text-blue-600">Projects</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{project.name}</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">{project.name}</h2>
        <p className="text-gray-500 mt-2">Customer: {project.customer.name} • {project.numberOfUsersForBilling} Users</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 border border-blue-200 rounded-lg overflow-hidden shadow-sm bg-blue-50/50">
          <div className="px-4 py-5 border-b border-blue-100 bg-blue-50">
            <h3 className="text-lg font-medium text-blue-900">Add New Schedule</h3>
          </div>
          <div className="p-6 bg-white">
            <AddScheduleForm projectId={project.id} />
          </div>
        </div>

        <div className="md:col-span-2">
          <Card title="Current Schedules">
            {project.schedules.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No schedules have been added yet.</p>
            ) : (
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Type & Info</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {project.schedules.map((s) => (
                      <tr key={s.id}>
                        <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                          <span className="uppercase tracking-widest text-xs font-bold block">{s.type}</span>
                          {s.name && <span className="block mt-1 font-medium text-gray-700">{s.name}</span>}
                          {s.recurrence !== 'none' || s.amount ? (
                            <span className="block text-xs text-gray-500 mt-1">
                              {s.amount ? `₹${s.amount}` : ''} {s.recurrence !== 'none' ? `(${s.recurrence})` : ''}
                            </span>
                          ) : null}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{s.date.toLocaleDateString()}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${s.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{s.status}</span>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          {s.status === 'pending' && (
                            <form action={completeSchedule.bind(null, s.id)} className="inline">
                              <button type="submit" className="text-blue-600 hover:text-blue-900">Mark Complete<span className="sr-only">, {s.type}</span></button>
                            </form>
                          )}
                          <form action={deleteSchedule.bind(null, s.id)} className="inline">
                            <DeleteButton />
                          </form>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
