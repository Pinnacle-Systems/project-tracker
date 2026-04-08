'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useCallback, useRef, startTransition } from 'react'
import { format } from 'date-fns'
import { AddScheduleForm } from './AddScheduleForm'
import { DeleteButton } from './DeleteButton'
import { EditScheduleForm } from './EditScheduleForm'
import { completeScheduleAction, deleteScheduleAction, updateProject } from '@/lib/actions'

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
  category: string | null
}

type Project = {
  id: string
  name: string
  customer: { id: string; name: string }
  numberOfUsersForBilling: number
  schedules: Schedule[]
  commit_date: string
  go_live_date: string
  amc_date: string
}

type Resource = { id: string; name: string; role: string | null }

const formatDate = (dateString?: string | null) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';
  return format(date, 'yyyy-MM-dd');
}
export function ProjectDetailClient({ project, resources, projectId, defaultScheduleType }: { project: Project; resources: Resource[]; projectId: string; defaultScheduleType?: string }) {
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null)
  const [isUpdated, setIsUpdated] = useState(false)
  const [updatedField, setUpdatedField] = useState<string | null>(null);
  const router = useRouter()

  const formatDateAction = useRef<HTMLFormElement>(null);
  const handleChange = (field: string) => {
    setUpdatedField(field);
    if (formatDateAction.current) {
      const formData = new FormData(formatDateAction.current);
      startTransition(async () => {
        await updateProject(filteredProject.id, formData, filteredProject.name, filteredProject.customer.id, filteredProject.numberOfUsersForBilling);
        setIsUpdated(true);
        setTimeout(() => {
          setIsUpdated(false);
        }, 2000);
      });
    }
  };

  const handleSuccess = useCallback(() => {
    setEditingSchedule(null)
    router.refresh()
  }, [router])

  const filteredProject = defaultScheduleType ? {
    ...project,
    schedules: project.schedules.filter(s => s.type === defaultScheduleType)
  } : project;

  console.log(filteredProject);

  return (
    <>
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
            <form ref={formatDateAction} className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label htmlFor="commit_date" className="block text-sm font-medium text-gray-700">Commit Date</label>
                  <input
                    type="date"
                    name="commit_date"
                    id="commit_date"
                    defaultValue={(filteredProject?.commit_date ? formatDate(filteredProject.commit_date) : '')}
                    onChange={(e) => handleChange('Commit')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  />
                </div>
                <div>
                  <label htmlFor="go_live_date" className="block text-sm font-medium text-gray-700">Go Live Date</label>
                  <input
                    type="date"
                    name="go_live_date"
                    id="go_live_date"
                    defaultValue={(filteredProject?.go_live_date ? formatDate(filteredProject.go_live_date) : '')}
                    disabled={filteredProject?.commit_date ? false : true}
                    onChange={(e) => handleChange('Go Live')}
                    className={` ${filteredProject?.commit_date ? '' : 'bg-gray-100 cursor-not-allowed'} mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border`}
                  />
                </div>
                <div>
                  <label htmlFor="amc_date" className="block text-sm font-medium text-gray-700">AMC Date</label>
                  <input
                    type="date"
                    name="amc_date"
                    id="amc_date"
                    defaultValue={(filteredProject?.amc_date ? formatDate(filteredProject.amc_date) : '')}
                    onChange={(e) => handleChange('AMC')}
                    disabled={filteredProject?.go_live_date ? false : true}
                    className={` ${filteredProject?.go_live_date ? '' : 'bg-gray-100 cursor-not-allowed'} mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border`}
                  />
                </div>

              </div>
            </form>
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
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
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
                        <td className="whitespace-nowrap px-3 text-sm text-gray-500">{s.category !== ' ' ? s.category : '---'}</td>
                        <td className="whitespace-nowrap px-3 text-sm text-gray-500">{s.moduleName ? s.moduleName : '---'}</td>
                        <td className="whitespace-nowrap px-3 text-sm text-gray-500">
                          {s.resource ? (
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-900">{s.resource.name}</span>
                              {/* {s.resource.role && <span className="text-xs text-gray-500">{s.resource.role}</span>} */}
                            </div>
                          ) : (
                            <span className="text-gray-400 italic">Unassigned</span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 text-sm text-gray-500">{s.startDate !== ' ' ? formatDate(s.startDate) : '---'}</td>
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
                              s.status !== 'completed' ? (
                                <EditScheduleForm schedule={s} onEdit={setEditingSchedule} />
                              ) : <i className="material-icons mr-4 !text-[16px] text-gray-300">edit</i>
                            }
                            {
                              s.status !== 'completed' ? (
                                <form action={deleteScheduleAction} className="mr-2 mt-1">
                                  <input type="hidden" name="scheduleId" value={s.id} />
                                  <DeleteButton />
                                </form>
                              ) : <i className="material-icons mr-2 !text-[16px] text-gray-300">delete</i>
                            }
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
      {isUpdated && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] min-w-[300px] flex items-center justify-between bg-[#edfded] border border-green-400 text-green-700 px-4 py-2 rounded shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300"
          role="alert">
          <div className="flex items-center gap-2">
            <i className="material-icons !text-[20px]">check_circle</i>
            <span className="text-sm">{updatedField} Date updated successfully.</span>
          </div>
          <i className="cursor-pointer material-icons ml-4 !text-[18px] opacity-70 hover:opacity-100 p-1 hover:bg-green-100 rounded-full transition-all"
            onClick={() => setIsUpdated(false)}>close</i>
        </div>
      )}
    </>
  )
}
