'use client'

import { useState } from 'react'
import { deleteProject } from '@/lib/actions'
import { CustomerFilter } from './CustomerFilter'
import { Pagination } from './Pagination'
import Link from 'next/dist/client/link'

type Schedule = { id: string; type: string; date: Date; status: string; moduleName: string | null; recurrence: string | null; category: string | null }

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
    onEditProject
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

    const filteredProjects = selectedCustomerId
        ? projects.filter(p => p.customerId === selectedCustomerId)
        : projects

    return (
        <div className="space-y-4">
            <div className="flex justify-between">
                <div className="flex items-center">
                    {/* <h3 className="text-lg font-medium text-gray-900 mr-5">Current Projects</h3> */}
                    <div className="flex items-center justify-between">
                        <CustomerFilter
                            customers={customers}
                            selectedCustomerId={selectedCustomerId}
                            onValueChange={setSelectedCustomerId}
                            from={'projectsList'}
                        />
                    </div>
                </div>
                <div className="flex text-sm items-center">
                    <Pagination totalPages={totalPages} currentPage={currentPage} totalCount={totalCount} />
                </div>
            </div>
            <div className="md:col-span-2">
                <div className="border border-gray-300 rounded-lg">
                    {filteredProjects.length === 0 ? (
                        <p className="p-8 text-center bg-white rounded-lg border border-gray-200 text-gray-500">No projects Found.</p>
                    ) : (
                        <div className="max-h-[64vh] overflow-y-auto">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50 whitespace-nowrap">
                                    <tr>
                                        <th className="sticky top-0 z-10 bg-gray-50 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">S No</th>
                                        <th className="sticky top-0 z-10 bg-gray-50 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Customer Name</th>
                                        <th className="sticky top-0 z-10 bg-gray-50 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Project Name</th>
                                        <th className="sticky top-0 z-10 bg-gray-50 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Billable Users</th>
                                        {/* <th className="sticky top-0 z-10 bg-gray-50 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Schedules</th> */}
                                        <th className="sticky top-0 z-10 bg-gray-50 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Dev</th>
                                        <th className="sticky top-0 z-10 bg-gray-50 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Delivery</th>
                                        <th className="sticky top-0 z-10 bg-gray-50 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Payment</th>
                                        <th className="sticky top-0 z-10 bg-gray-50 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                                        <th className="sticky top-0 z-10 bg-gray-50 relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {filteredProjects.map((s) => (
                                        <tr key={s.id}>
                                            <td className="whitespace-nowrap px-3 py-1 text-sm text-gray-500">{filteredProjects.indexOf(s) + 1}</td>
                                            <td className="whitespace-nowrap px-3 py-1 text-sm text-gray-500">{s.customer.name}</td>
                                            <td className="whitespace-nowrap px-3 py-1 text-sm text-gray-500">{s.name}</td>
                                            <td className="whitespace-nowrap px-3 py-1 text-sm text-gray-500">{s.numberOfUsersForBilling}</td>
                                            {/* <td className="whitespace-nowrap px-3 py-1 text-sm text-gray-500">{s.schedules?.length || 0}</td> */}
                                            {/* Dev Column */}
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

                                            {/* Delivery Column */}
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

                                            {/* Payment Column */}
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

                                            {/* Project Status Column (based on schedules) */}
                                            <td className="whitespace-nowrap px-3 py-1 text-sm text-gray-500">
                                                <Link
                                                    href={`/projects/${s.id}`}
                                                    className={`" ${s.amc_date ? 'text-green-500' : s.go_live_date ? 'text-blue-500' : s.commit_date ? 'text-orange-500' :'text-gray-500'} flex items-center transition-colors"`}
                                                    title={`${s.amc_date ? 'AMC Date Set' : s.go_live_date ? 'Go Live Date Set' : s.commit_date ? 'Commit Date Set' : 'No Dates Set'}`}
                                                >
                                                <div className="flex items-center gap-1">
                                                    <i className="material-icons !text-[16px]">downloading </i>
                                                    <span className="text-[12px]">{`${s.amc_date ? 'amc' : s.go_live_date ? 'live' : s.commit_date ? 'commit' : ''}`}</span>
                                                </div>
                                                </Link>
                                            </td>
                                            <td className="relative whitespace-nowrap py-1 pl-3 pr-4 text-sm font-medium sm:pr-6 grid justify-end">
                                                <div className="flex justify-end-safe items-center gap-3">
                                                    {/* <Link
                                                        href={`/projects/${s.id}`}
                                                        className="flex text-sm text-orange-400 hover:text-orange-800 font-medium px-3 py-1 rounded-md"
                                                        title="Manage Schedules"
                                                    >
                                                        <i className="material-icons !text-[16px]">schedule</i>
                                                    </Link> */}
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
