import { getCategorizedSchedules, getResourcesWithStats } from '@/lib/actions'
import { ResourceFilter } from '@/components/ResourceFilter'
import React from 'react'

export const dynamic = 'force-dynamic'

export async function DashboardContent({ resourceId }: { resourceId: any }) {

  const [schedules, resources] = await Promise.all([
    getCategorizedSchedules(resourceId ? resourceId : ''),
    getResourcesWithStats(),
  ])

  const { overdue, thisWeek, upcoming } = schedules

  const groupedOverdue = overdue.reduce((acc: any, current: any) => {
    const type = current.type;
    const customerName = current.project?.customer?.name || "Unknown Customer";
    if (!acc[type]) {
      acc[type] = [];
    }
    let customerGroup = acc[type].find((group: any) => group.customer === customerName);
    if (!customerGroup) {
      customerGroup = {
        customer: customerName,
        items: []
      };
      acc[type].push(customerGroup);
    }
    customerGroup.items.push(current);
    return acc
  }, { dev: [], delivery: [], payment: [] });

  const groupedWeek = thisWeek.reduce((acc: any, current: any) => {
    const type = current.type;
    const customerName = current.project?.customer?.name || "Unknown Customer";
    if (!acc[type]) {
      acc[type] = [];
    }
    let customerGroup = acc[type].find((group: any) => group.customer === customerName);
    if (!customerGroup) {
      customerGroup = {
        customer: customerName,
        items: []
      };
      acc[type].push(customerGroup);
    }
    customerGroup.items.push(current);
    return acc
  }, { dev: [], delivery: [], payment: [] });

  const groupedUpcoming = upcoming.reduce((acc: any, current: any) => {
    const type = current.type;
    const customerName = current.project?.customer?.name || "Unknown Customer";
    if (!acc[type]) {
      acc[type] = [];
    }
    let customerGroup = acc[type].find((group: any) => group.customer === customerName);
    if (!customerGroup) {
      customerGroup = {
        customer: customerName,
        items: []
      };
      acc[type].push(customerGroup);
    }
    customerGroup.items.push(current);
    return acc
  }, { dev: [], delivery: [], payment: [] });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h2>
          <p className="text-gray-500 mt-2">Here is what needs your attention.</p>
        </div>
        <ResourceFilter resources={resources} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div className="bg-red-50 border border-red-200 rounded-lg p-2">
          <h3 className="text-lg font-semibold text-red-800">Overdue</h3>
          <ul className={`mt-4 space-y-4 ${overdue.length > 5 ? 'overflow-auto h-[67vh]' : ''}`}>
            {overdue.length === 0 ? <li className="text-sm text-red-600">No overdue tasks.</li> : null}
            <div className="grid grid-cols-1 text-[11px]">
              {(Object.entries(groupedOverdue) as [string, any[]][]).map(([type, customerGroups]) => {
                if (customerGroups.length === 0) return null;
                return (
                  <div key={type} className="mb-6">
                    <h2 className="text-sm font-bold  mb-2 uppercase">{type} Schedules</h2>
                    {customerGroups.map((group) => (
                      <div key={group.customer} className="mb-2">
                        <h3 className="text-sm font-bold mb-2 text-blue-700">{group.customer}</h3>
                        <table className="w-full border-collapse border border-gray-400 bg-white">
                          <thead>
                            <TableColumn e={type} />
                          </thead>
                          <tbody>
                            {group.items.map((e: any, index: number) => (
                              <React.Fragment key={e.id}>
                                <TableRow e={e} index={index} s={'overdue'} />
                              </React.Fragment>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </ul>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-2">
          <h3 className="text-lg font-semibold text-amber-800">This Week</h3>
          <ul className={`mt-4 space-y-4 ${thisWeek.length > 5 ? 'overflow-auto h-[67vh]' : ''}`}>
            {thisWeek.length === 0 ? <li className="text-sm text-amber-600">No tasks this week.</li> : null}
            <div className="grid grid-cols-1 text-[11px]">
              {/* {(Object.entries(groupedWeek) as [string, any[]][]).map(([type, items]) => {
                if (items.length === 0) return null
                return (
                  <div key={type} className="mb-8">
                    <h3 className="text-sm font-bold  mb-2 uppercase">{type} Schedules</h3>
                    <h3 className="text-sm font-bold  mb-2 uppercase">{type}</h3>
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
              })} */}
              {(Object.entries(groupedWeek) as [string, any[]][]).map(([type, customerGroups]) => {
                if (customerGroups.length === 0) return null;
                return (
                  <div key={type} className="mb-6">
                    <h2 className="text-sm font-bold  mb-2 uppercase">{type} Schedules</h2>
                    {customerGroups.map((group) => (
                      <div key={group.customer} className="mb-2">
                        <h3 className="text-sm font-bold mb-2 text-blue-700">{group.customer}</h3>
                        <table className="w-full border-collapse border border-gray-400 bg-white">
                          <thead>
                            <TableColumn e={type} />
                          </thead>
                          <tbody>
                            {group.items.map((e: any, index: number) => (
                              <React.Fragment key={e.id}>
                                <TableRow e={e} index={index} s={'week'} />
                              </React.Fragment>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
          <h3 className="text-lg font-semibold text-blue-800">Upcoming</h3>
          <ul className={`mt-4 space-y-4 ${upcoming.length > 5 ? 'overflow-auto h-[67vh]' : ''}`}>
            {upcoming.length === 0 ? <li className="text-sm text-blue-600">No upcoming tasks.</li> : null}
            <div className="grid grid-cols-1 text-[11px]">
              {(Object.entries(groupedUpcoming) as [string, any[]][]).map(([type, customerGroups]) => {
                if (customerGroups.length === 0) return null;
                return (
                  <div key={type} className="mb-6">
                    <h2 className="text-sm font-bold  mb-2 uppercase">{type} Schedules</h2>
                    {customerGroups.map((group) => (
                      <div key={group.customer} className="mb-2">
                        <h3 className="text-sm font-bold mb-2 text-blue-700">{group.customer}</h3>
                        <table className="w-full border-collapse border border-gray-400 bg-white">
                          <thead>
                            <TableColumn e={type} />
                          </thead>
                          <tbody>
                            {group.items.map((e: any, index: number) => (
                              <React.Fragment key={e.id}>
                                <TableRow e={e} index={index} s={'upcoming'} />
                              </React.Fragment>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                );
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
      {e.type == 'dev' && <td className="border border-gray-300 text-gray-700 px-2">
        {e.startDate ? new Date(e.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
      </td>}
      {
        e.type == 'delivery' && <td className="border border-gray-300 text-gray-700 px-2">{e?.moduleName}</td>
      }
      {e.type == 'payment' && <td className="border border-gray-300 text-gray-700 px-2">{e?.category}</td>}
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
      {e == 'dev' && <th className="border border-gray-300 text-left px-2">Start Date</th>}
      {e == 'delivery' && <th className="border border-gray-300 text-left px-2">Module Name</th>}
      {e == 'payment' && <th className="border border-gray-300 text-left px-2">Category</th>}
      <th className="border border-gray-300 text-left px-2">Date</th>
      {e != 'payment' && <th className="border border-gray-300 text-left px-2">Resource</th>}
      {e == 'payment' && <th className="border border-gray-300 text-left px-2">Amount</th>}
    </tr>
  )
}