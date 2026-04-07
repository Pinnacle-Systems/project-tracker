'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useCallback } from 'react'
import { format } from 'date-fns'
import { AddScheduleForm } from './AddScheduleForm'
import { DeleteButton } from './DeleteButton'
import { EditScheduleForm } from './EditScheduleForm'
import { completeScheduleAction, deleteScheduleAction } from '@/lib/actions'

type Schedule = {
  id: string
  type: string
  name: string | null
  moduleName: string | null
  date: string
  startDate: string | null
  recurrence: string
  amount: number | null
  resourceId: string | null
  status: string
  resource: { id: string; name: string; role: string | null } | null
}

type Project = {
  id: string
  name: string
  customer: { id: string; name: string }
  numberOfUsersForBilling: number
  schedules: Schedule[]
}

type Resource = { id: string; name: string; role: string | null }

const formatDate = (dateString: string) => format(new Date(dateString), 'd/M/yyyy')

export function ProjectDetailClient({ project, resources, projectId, defaultScheduleType }: { project: Project; resources: Resource[]; projectId: string; defaultScheduleType?: string }) {
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null)
  const router = useRouter()

  
  const handleSuccess = useCallback(() => {
    setEditingSchedule(null)
    router.refresh()
  }, [router])

  const filteredProject = defaultScheduleType  ? {
    ...project,
    schedules: project.schedules.filter(s => s.type === defaultScheduleType)
  } : project;
  console.log(filteredProject);
  

  return (
    <div className="space-y-8 overflow-auto h-[80vh]">
      <div className="mb-2">
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
          <Link href="/projects" className="hover:text-blue-600">Projects</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{project.name}</span>
        </div>
        <div className="flex">
          <h2 className="text-2xl mr-2 font-bold tracking-tight text-gray-900">{project.name}</h2>
          <p className="text-gray-500 mt-2">{project.customer.name} • {project.numberOfUsersForBilling} Users</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 border border-blue-200 rounded-lg overflow-hidden shadow-sm bg-blue-50/50">
          <div className="px-4 py-5 border-b border-blue-100 bg-blue-50">
            <h3 className="text-lg font-medium text-blue-900">{editingSchedule ? 'Update Schedule' : 'Add New Schedule'}</h3>
          </div>
          <div className="p-6 bg-white">
            <AddScheduleForm
              projectId={projectId}
              resources={resources}
              editingSchedule={editingSchedule}
              onCancelEdit={() => setEditingSchedule(null)}
              onSuccess={handleSuccess}
              scheduleType={defaultScheduleType}

            />
          </div>
        </div>
        <div className="md:col-span-2">
          <h1 className="text-xl mb-2 text-gray-600">Current Schedules</h1>
          {filteredProject.schedules.length === 0 ? (
            <p className="border border-gray-300 rounded-lg text-sm text-gray-500 text-center py-4">No schedules have been added yet.</p>
          ) : (
            <div className="overflow-auto border border-gray-300 rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50 whitespace-nowrap">
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">S No</th>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Type & Info</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Module</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Assigned To</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Start Date</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Deadline/Date</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredProject.schedules.map((s, index) => (
                    <tr key={s.id}>
                      <td className="pl-4 pr-3 text-sm font-medium text-gray-900">{index + 1}</td>
                      <td className="pl-4 pr-3 text-sm font-medium text-gray-900">
                        <span className="uppercase tracking-widest text-xs font-bold block">{s.type}</span>
                        {s.name && <span className="block mt-1 font-medium text-gray-700">{s.name}</span>}
                        {s.recurrence !== 'none' || s.amount ? (
                          <span className="block text-xs text-gray-500 mt-1">
                            {s.amount ? `₹${s.amount}` : ''} {s.recurrence !== 'none' ? `(${s.recurrence})` : ''}
                          </span>
                        ) : null}
                      </td>
                      <td className="whitespace-nowrap px-3 text-sm text-gray-500">{s.moduleName ? s.moduleName : '---'}</td>
                      <td className="whitespace-nowrap px-3 text-sm text-gray-500">
                        {s.resource ? (
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">{s.resource.name}</span>
                            {s.resource.role && <span className="text-xs text-gray-500">{s.resource.role}</span>}
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 text-sm text-gray-500">{s.startDate ? formatDate(s.startDate) : '---'}</td>
                      <td className="whitespace-nowrap px-3 text-sm text-gray-500">{formatDate(s.date)}</td>
                      <td className="whitespace-nowrap px-3 text-sm text-gray-500">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${s.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{s.status}</span>
                      </td>
                      <td>
                        <span className="flex items-center justify-end mr-6">
                          <form action={completeScheduleAction} className="mr-4">
                            <input type="hidden" name="scheduleId" value={s.id} />
                            <input type="hidden" name="status" value={s.status} />
                            <button type="submit" className="cursor-pointer text-blue-600 hover:text-blue-900">
                              <i className={`material-icons mr-2 !text-[16px] mt-2 ${s.status === 'completed' ? 'text-green-600 hover:text-green-900' : 'text-blue-600 hover:text-blue-900'}`}>
                                {s.status === 'completed' ? 'check_box' : 'check_box_outline_blank'}
                              </i>
                            </button>
                          </form>
                          {
                            s.status !== 'completed'  ? (
                              <EditScheduleForm schedule={s} onEdit={setEditingSchedule} />
                            ) : <i className="material-icons mr-4 !text-[16px] text-gray-300">edit</i>
                          }
                          <form action={deleteScheduleAction} className="mr-2 mt-1">
                            <input type="hidden" name="scheduleId" value={s.id} />
                            <DeleteButton />
                          </form>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
