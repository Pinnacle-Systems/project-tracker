import { getCategorizedSchedules, getResourcesWithStats } from '@/lib/actions'
import Link from 'next/link'
import { ResourceFilter } from '@/components/ResourceFilter'

export const dynamic = 'force-dynamic'

export default async function DashboardPage(props: { searchParams?: Promise<{ resourceId?: string }> }) {
  const searchParams = await props.searchParams
  const resourceId = searchParams?.resourceId

  const [schedules, resources] = await Promise.all([
    getCategorizedSchedules(resourceId),
    getResourcesWithStats()
  ])

  const { overdue, thisWeek, upcoming } = schedules

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h2>
          <p className="text-gray-500 mt-2">Here is what needs your attention.</p>
        </div>
        <ResourceFilter resources={resources} />
      </div>

      {resources.length > 0 && (
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {resources.map(r => (
            <div key={r.id} className="bg-white border border-gray-200 rounded-md px-4 py-2 text-sm whitespace-nowrap shadow-sm">
              <span className="font-semibold text-gray-800">{r.name}</span>
              <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                {r.pendingCount} pending
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800">Overdue</h3>
          <ul className="mt-4 space-y-4">
            {overdue.length === 0 ? <li className="text-sm text-red-600">No overdue tasks.</li> : null}
            {overdue.map(s => (
              <li key={s.id} className="bg-white p-4 rounded shadow-sm flex flex-col items-start text-sm">
                <div className="flex justify-between w-full">
                  <span className="font-bold text-red-700 uppercase tracking-wide text-xs">{s.type}</span>
                  {s.amount && <span className="font-bold text-red-700 text-xs">₹{s.amount}</span>}
                </div>
                <span className="mt-1 font-medium">{s.name || s.project.name} {s.name ? <span className="text-gray-500 font-normal">({s.project.name})</span> : null}</span>
                <div className="flex justify-between w-full mt-1">
                  <span className="text-gray-500">{s.project.customer.name}</span>
                  {s.recurrence !== 'none' && <span className="text-xs text-gray-400 capitalize">{s.recurrence}</span>}
                </div>
                <span className="mt-1 text-orange-600 text-[12px] whitespace-nowrap">
                  {s.startDate ? new Date(s.startDate).toLocaleDateString('en-US', { year: 'numeric',month: 'long', day: 'numeric' }) : ''} { s.startDate ? ' -   ' : '' }
                  {s.date ? new Date(s.date).toLocaleDateString('en-US', { year: 'numeric',month: 'long', day: 'numeric' }) : ''}</span>
                {(s as any).resource && (
                  <div className="mt-2 text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    👤 {(s as any).resource.name}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-amber-800">This Week</h3>
          <ul className="mt-4 space-y-4">
            {thisWeek.length === 0 ? <li className="text-sm text-amber-600">No tasks this week.</li> : null}
            {thisWeek.map(s => (
              <li key={s.id} className="bg-white p-4 rounded shadow-sm flex flex-col items-start text-sm">
                <div className="flex justify-between w-full">
                  <span className="font-bold text-amber-700 uppercase tracking-wide text-xs">{s.type}</span>
                  {s.amount && <span className="font-bold text-amber-700 text-xs">₹{s.amount}</span>}
                </div>
                <span className="mt-1 font-medium">{s.name || s.project.name} {s.name ? <span className="text-gray-500 font-normal">({s.project.name})</span> : null}</span>
                <div className="flex justify-between w-full mt-1">
                  <span className="text-gray-500">{s.project.customer.name}</span>
                  {s.recurrence !== 'none' && <span className="text-xs text-gray-400 capitalize">{s.recurrence}</span>}
                </div>
                <span className="mt-1 text-orange-600 text-[12px] whitespace-nowrap">
                  {s.startDate ? new Date(s.startDate).toLocaleDateString('en-US', { year: 'numeric',month: 'long', day: 'numeric' }) : ''} { s.startDate ? ' -  ' : '' }
                  {s.date ? new Date(s.date).toLocaleDateString('en-US', { year: 'numeric',month: 'long', day: 'numeric' }) : ''}</span>
                {(s as any).resource && (
                  <div className="mt-2 text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    👤 {(s as any).resource.name}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800">Upcoming</h3>
          <ul className="mt-4 space-y-4">
            {upcoming.length === 0 ? <li className="text-sm text-blue-600">No upcoming tasks.</li> : null}
            {upcoming.map(s => (
              <li key={s.id} className="bg-white p-4 rounded shadow-sm flex flex-col items-start text-sm">
                <div className="flex justify-between w-full">
                  <span className="font-bold text-blue-700 uppercase tracking-wide text-xs">{s.type}</span>
                  {s.amount && <span className="font-bold text-blue-700 text-xs">₹{s.amount}</span>}
                </div>
                <span className="mt-1 font-medium">{s.name || s.project.name} {s.name ? <span className="text-gray-500 font-normal">({s.project.name})</span> : null}</span>
                <div className="flex justify-between w-full mt-1">
                  <span className="text-gray-500">{s.project.customer.name}</span>
                  {s.recurrence !== 'none' && <span className="text-xs text-gray-400 capitalize">{s.recurrence}</span>}
                </div>
                <span className="mt-1 text-orange-600 text-[12px] whitespace-nowrap">
                  {s.startDate ? new Date(s.startDate).toLocaleDateString('en-US', { year: 'numeric',month: 'long', day: 'numeric' }) : ''} { s.startDate ? ' -  ' : '' }
                  {s.date ? new Date(s.date).toLocaleDateString('en-US', { year: 'numeric',month: 'long', day: 'numeric' }) : ''}</span>
                {(s as any).resource && (
                  <div className="mt-2 text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    👤 {(s as any).resource.name}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
