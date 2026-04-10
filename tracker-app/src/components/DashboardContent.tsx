import { getCategorizedSchedules, getResourcesWithStats } from '@/lib/actions'
import { ResourceFilter } from '@/components/ResourceFilter'
import React from 'react'

export const dynamic = 'force-dynamic'

export async function DashboardContent({resourceId} : {resourceId:any}) {

  const [schedules, resources] = await Promise.all([
    getCategorizedSchedules(resourceId ? resourceId : ''),
    getResourcesWithStats(),
  ])

  const { overdue, thisWeek, upcoming } = schedules

  const groupedWeek = thisWeek.reduce((acc: any, current: any) => {
    const type = current.type
    if (!acc[type]) {
      acc[type] = []
    }
    acc[type].push(current)
    return acc
  }, { dev: [], delivery: [], payment: [] })

  const groupedUpcoming = upcoming.reduce((acc: any, current: any) => {
    const type = current.type
    if (!acc[type]) {
      acc[type] = []
    }
    acc[type].push(current)
    return acc
  }, { dev: [], delivery: [], payment: [] })

  const groupedOverdue = overdue.reduce((acc: any, current: any) => {
    const type = current.type
    if (!acc[type]) {
      acc[type] = []
    }
    acc[type].push(current)
    return acc
  }, { dev: [], delivery: [], payment: [] })

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h2>
          <p className="text-gray-500 mt-2">Here is what needs your attention.</p>
        </div>
        <ResourceFilter resources={resources} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800">Overdue</h3>
          <ul className={`mt-4 space-y-4 ${overdue.length > 2 ? 'overflow-auto h-[60vh]' : ''}`}>
            {overdue.length === 0 ? <li className="text-sm text-red-600">No overdue tasks.</li> : null}
            <div className="grid grid-cols-1 text-[11px]">
              {(Object.entries(groupedOverdue) as [string, any[]][]).map(([type, items]) => {
                if (items.length === 0) return null
                return (
                  <div key={type} className="mb-8">
                    <h3 className="text-sm font-bold  mb-2 uppercase">{type} Schedules</h3>
                    <table className="w-full border-collapse border border-gray-400 bg-white">
                      <thead>
                        <TableColumn e={type} />
                      </thead>
                      <tbody>
                        {items.map((e, index) => (
                          <React.Fragment key={e.id}>
                            <TableRow e={e} index={index} s={'overdue'} />
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              })}
            </div>
          </ul>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-amber-800">This Week</h3>
          <ul className={`mt-4 space-y-4 ${thisWeek.length > 2 ? 'overflow-auto h-[60vh]' : ''}`}>
            {thisWeek.length === 0 ? <li className="text-sm text-amber-600">No tasks this week.</li> : null}
            <div className="grid grid-cols-1 text-[11px]">
              {(Object.entries(groupedWeek) as [string, any[]][]).map(([type, items]) => {
                if (items.length === 0) return null
                return (
                  <div key={type} className="mb-8">
                    <h3 className="text-sm font-bold  mb-2 uppercase">{type} Schedules</h3>
                    <table className="w-full border-collapse border border-gray-400 bg-white">
                      <thead>
                        <TableColumn e={type} />
                      </thead>
                      <tbody>
                        {items.map((e, index) => (
                          <React.Fragment key={e.id}>
                            <TableRow e={e} index={index} s={'week'} />
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              })}
            </div>
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800">Upcoming</h3>
          <ul className={`mt-4 space-y-4 ${upcoming.length > 2 ? 'overflow-auto h-[60vh]' : ''}`}>
            {upcoming.length === 0 ? <li className="text-sm text-blue-600">No upcoming tasks.</li> : null}
            <div className="grid grid-cols-1 text-[11px]">
              {(Object.entries(groupedUpcoming) as [string, any[]][]).map(([type, items]) => {
                if (items.length === 0) return null
                return (
                  <div key={type} className="mb-8">
                    <h3 className="text-sm font-bold  mb-2 uppercase">{type} Schedules</h3>
                    <table className="w-full border-collapse border border-gray-400 bg-white">
                      <thead>
                        <TableColumn e={type} />
                      </thead>
                      <tbody>
                        {items.map((e, index) => (
                          <React.Fragment key={e.id}>
                            <TableRow e={e} index={index} s={'upcoming'} />
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              })}
            </div>
          </ul>
        </div>
      </div>
    </div>
  )
}

function TableRow({ e, index, s }: { e: any; index: number; s: any }) {
  return (
    <tr key={e.id}>
      <td className="border border-gray-300 text-gray-700 px-2">{index + 1}.</td>
      <td className="border border-gray-300 text-gray-700 px-2">{e?.project?.name}</td>
      <td className="border border-gray-300 text-gray-700 px-2">{e?.project?.customer?.name}</td>
      <td className={`border border-gray-300 ${s == 'overdue' ? 'text-red-800' : s == 'week' ? 'text-amber-800' : 'text-blue-800'} px-2`}>
        {e.date ? new Date(e.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
      </td>
      {e.type != 'payment' && <td className="border border-gray-300 text-gray-700 px-2">{e?.resource?.name}</td>}
      {e.type == 'payment' && <td className="border border-gray-300 text-gray-700 px-2">{e.amount} ({e.recurrence})</td>}
    </tr>
  )
}

function TableColumn({ e }: { e: any }) {
  return (
    <tr>
      <th className="border border-gray-300 text-left px-2">S No</th>
      <th className="border border-gray-300 text-left px-2">Project</th>
      <th className="border border-gray-300 text-left px-2">Customer</th>
      <th className="border border-gray-300 text-left px-2">Date</th>
      {e != 'payment' && <th className="border border-gray-300 text-left px-2">Resource</th>}
      {e == 'payment' && <th className="border border-gray-300 text-left px-2">Amount</th>}
    </tr>
  )
}
