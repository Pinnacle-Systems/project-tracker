import { getCategorizedSchedules } from '@/lib/actions'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const { overdue, thisWeek, upcoming } = await getCategorizedSchedules()

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h2>
        <p className="text-gray-500 mt-2">Here is what needs your attention.</p>
      </div>

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
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
