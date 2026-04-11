'use client'

import { useEffect, useRef, useState } from 'react'
import { deleteProject } from '@/lib/actions'
import { CustomerFilter } from './CustomerFilter'
import { Pagination } from './Pagination'
import Link from 'next/dist/client/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { getStoredSession } from '@/lib/auth-client'

type Schedule = {
  id: string; type: string; date: Date; status: string; moduleName: string | null;
  recurrence: string | null; category: string | null; completedAt: string | null; resourceId: string
}

type Project = {
  id: string
  name: string
  numberOfUsersForBilling: number
  customerId: string
  customer: { id: string; name: string }
  schedules: Schedule[]
  commit_date: Date | null
  go_live_date: Date | null
  amc_date: Date | null
}

type Customer = { id: string; name: string }

export function ProjectsList({
  projects,
  customers,
  totalPages,
  currentPage,
  totalCount,
  onEditProject,
}: {
  projects: Project[]
  customers: Customer[]
  totalPages: number
  currentPage: number
  totalCount: number
  onEditProject?: (project: Project) => void
}) {
  const [selectedCustomerId, setSelectedCustomerId] = useState('')

  const handleDelete = (projectId: string, projectName: string) => {
    if (window.confirm(`Delete "${projectName}"? This will also permanently delete all its schedules.`)) {
      deleteProject(projectId)
    }
  }

  const searchParams = useSearchParams();
  const cId = searchParams.get('cid')
  const router = useRouter()
  const pathname = usePathname()
  const [isManualLimit, setIsManualLimit] = useState(false);
  const hasAppliedOverride = useRef(false);
  const userInfo = getStoredSession();
  const role = userInfo ? userInfo.role : '';
  const uId = userInfo ? userInfo.id : '';

  useEffect(() => {
    if (cId && !hasAppliedOverride.current && !isManualLimit && searchParams.get('limit') !== 'all') {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', '1');
      params.set('limit', 'all');
      hasAppliedOverride.current = true;
      router.push(`${pathname}?${params.toString()}`);
    }
  }, [cId, isManualLimit, pathname, router, searchParams])

  const filterAll = (() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1');
    params.set('limit', 'all');
    router.push(`${pathname}?${params.toString()}`);
  })

  const filteredProjects = (selectedCustomerId && selectedCustomerId != 'all') ? projects.filter(p => p.customerId === selectedCustomerId) :
    (cId && selectedCustomerId != 'all') ? projects.filter(p => p.customerId === cId) : projects

  const userProjects = filteredProjects.filter((project) =>
    project.schedules.some((s) => s.resourceId === uId)
  );

  const filteredCustomer = customers.filter((c) =>
    (role == 'Admin' ? projects : userProjects).some((p) => p.customerId == c.id)
  )

  return (
    <div className="space-y-4">
      {
        (role === 'Admin' ? filteredProjects : userProjects).length > 0 &&
        <div className="flex justify-between">
          <div className="flex items-center">
            <div className="flex items-center justify-between">
              <CustomerFilter
                customers={filteredCustomer}
                selectedCustomerId={selectedCustomerId == 'all' ? ' ' : selectedCustomerId ? selectedCustomerId : cId ? cId : ' '}
                onValueChange={(value) => {
                  setSelectedCustomerId(value);
                  filterAll()
                }}
              />
            </div>
          </div>
          <div className="flex text-sm items-center">
            <Pagination totalPages={totalPages} currentPage={currentPage} totalCount={totalCount} filterCount={userProjects ? userProjects.length : 0} onLimitChange={() => setIsManualLimit(true)} />
          </div>
        </div>
      }
      <div className="md:col-span-2">
        <div className="">
          {(role === 'Admin' ? filteredProjects : userProjects).length === 0 ? (
            <p className="p-8 text-center bg-white rounded-lg border border-gray-200 text-gray-500 mt-[50px] ">No projects Found.</p>
          ) : (
            <div className="max-h-[75vh] overflow-y-auto border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50 whitespace-nowrap">
                  <tr>
                    <th className="sticky top-0 z-10 bg-gray-50 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">S No</th>
                    <th className="sticky top-0 z-10 bg-gray-50 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Customer Name</th>
                    <th className="sticky top-0 z-10 bg-gray-50 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Project Name</th>
                    <th className="sticky top-0 z-10 bg-gray-50 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Billable Users</th>
                    {
                      (role == 'Developer' || role == 'Admin') &&
                      <th className="sticky top-0 z-10 bg-gray-50 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Dev</th>
                    }
                    {
                      (role == 'Tester' || role == 'Admin') &&
                      <th className="sticky top-0 z-10 bg-gray-50 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Delivery</th>
                    }
                    {
                      (role == 'Admin') &&
                      <th className="sticky top-0 z-10 bg-gray-50 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Payment</th>
                    }
                    <th className="sticky top-0 z-10 bg-gray-50 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                    {
                      role == 'Admin' &&
                      <th className="sticky top-0 z-10 bg-gray-50 relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>
                    }
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {(role === 'Admin' ? filteredProjects : userProjects).map((s) => (
                    <tr key={s.id}>
                      <td className="whitespace-nowrap px-3 py-1 text-sm text-gray-500">{(role === 'Admin' ? filteredProjects : userProjects).indexOf(s) + 1}</td>
                      <td className="whitespace-nowrap px-3 py-1 text-sm text-gray-500">{s.customer.name}</td>
                      <td className="whitespace-nowrap px-3 py-1 text-sm text-gray-500">{s.name}</td>
                      <td className="whitespace-nowrap px-3 py-1 text-sm text-gray-500">{s.numberOfUsersForBilling}</td>
                      {/* Dev Column */}
                      {
                        (role == 'Developer' || role == 'Admin') &&
                        <td className="px-3 py-1 text-sm whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {s.schedules?.filter(sch => sch.type === 'dev').length > 0 ? (
                              <Link
                                href={`/projects/${s.id}?type=dev`}
                                className="text-blue-500 hover:text-blue-700 flex items-center transition-colors"
                              >
                                <i className="material-icons !text-[16px]">schedule_send</i>
                              </Link>
                            ) : (
                              <Link
                                href={`/projects/${s.id}?type=dev`}
                                className="text-red-500 hover:text-red-700 flex items-center transition-colors"
                                title="Not Scheduled"
                              >
                                <i className="material-icons !text-[16px]">schedule</i>
                              </Link>
                            )}
                          </div>
                        </td>
                      }

                      {/* Delivery Column */}
                      {
                        (role == 'Tester' || role == 'Admin') &&
                        <td className="px-3 py-1 text-sm whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {s.schedules?.filter(sch => sch.type === 'delivery').length > 0 ? (
                              <Link
                                href={`/projects/${s.id}?type=delivery`}
                                className="text-blue-500 hover:text-blue-700 flex items-center transition-colors"

                              >
                                <i className="material-icons !text-[16px]">schedule_send</i>
                              </Link>
                            ) : (
                              <Link
                                href={`/projects/${s.id}?type=delivery`}
                                className="text-red-500 hover:text-red-700 flex items-center transition-colors"
                                title="Not Scheduled"
                              >
                                <i className="material-icons !text-[16px]">schedule</i>
                              </Link>
                            )}
                          </div>
                        </td>
                      }

                      {/* Payment Column */}
                      {
                        (role == 'Admin') &&
                        <td className="px-3 py-1 text-sm whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {s.schedules?.filter(sch => sch.type === 'payment').length > 0 ? (
                              <Link
                                href={`/projects/${s.id}?type=payment`}
                                className="text-blue-500 hover:text-blue-700 flex items-center transition-colors"

                              >
                                <i className="material-icons !text-[16px]">schedule_send</i>
                              </Link>
                            ) : (
                              <Link
                                href={`/projects/${s.id}?type=payment`}
                                className="text-red-500 hover:text-red-700 flex items-center transition-colors"
                                title="Not Scheduled"
                              >
                                <i className="material-icons !text-[16px]">schedule</i>
                              </Link>
                            )}
                          </div>
                        </td>
                      }

                      {/* Project Status Column (based on schedules) */}
                      <td className="whitespace-nowrap px-3 py-1 text-sm text-gray-500">
                        <Link
                          href={role == 'Admin' ? `/projects/${s.id}?type=status` : '#'}
                          className={`${s.amc_date ? 'text-green-500' : s.go_live_date ? 'text-blue-500' : s.commit_date ? 'text-orange-500' : 'text-gray-500'} flex items-center transition-colors`}
                          title={`${s.amc_date ? 'AMC Date Set' : s.go_live_date ? 'Go Live Date Set' : s.commit_date ? 'Commit Date Set' : 'No Dates Set'}`}
                        >
                          <div className="flex items-center gap-1">
                            <i className="material-icons !text-[16px]">downloading </i>
                            <span className="text-[12px]">{`${s.amc_date ? 'amc' : s.go_live_date ? 'live' : s.commit_date ? 'commit' : ''}`}</span>
                          </div>
                        </Link>
                      </td>

                      {
                        (role == 'Admin') &&
                        <td className="relative whitespace-nowrap py-1 pl-3 pr-4 text-sm font-medium sm:pr-6 grid justify-end">
                          <div className="flex justify-end-safe items-center gap-3">
                            <button
                              onClick={() => onEditProject?.(s)}
                              className="flex text-sm cursor-pointer mr-2 font-medium text-blue-600 hover:text-blue-900"
                              title="Edit Project"
                            >
                              <i className="material-icons !text-[16px]">edit</i>
                            </button>
                            <button
                              onClick={() => handleDelete(s.id, s.name)}
                              className="flex text-sm cursor-pointer font-medium text-red-600 hover:text-red-900"
                              title="Delete Project"
                            >
                              <i className="material-icons !text-[16px]">delete</i>
                            </button>
                          </div>
                        </td>
                      }
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