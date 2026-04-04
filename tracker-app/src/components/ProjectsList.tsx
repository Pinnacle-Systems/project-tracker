'use client'

import { useState } from 'react'
import { CustomerFilter } from './CustomerFilter'
import { EditProjectForm } from './EditProjectForm'
import { Pagination } from './Pagination'

type Schedule = { id: string; type: string; date: Date; status: string }

type Project = {
    id: string
    name: string
    numberOfUsersForBilling: number
    customerId: string
    customer: { id: string; name: string }
    schedules: Schedule[]
}
type Customer = { id: string; name: string }

export function ProjectsList({
    projects,
    customers,
    totalPages,
    currentPage,
    totalCount
}: {
    projects: Project[]
    customers: Customer[]
    totalPages: number
    currentPage: number
    totalCount: number
}) {
    const [selectedCustomerId, setSelectedCustomerId] = useState('')

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
                            onCustomerChange={setSelectedCustomerId}
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
                                        <th className="sticky top-0 z-10 bg-gray-50 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Schedules</th>
                                        <th className="sticky top-0 z-10 bg-gray-50 relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {filteredProjects.map((s) => (
                                        <tr key={s.id}>
                                            <td className="whitespace-nowrap px-3 text-sm text-gray-500">{filteredProjects.indexOf(s) + 1}</td>
                                            <td className="whitespace-nowrap px-3 text-sm text-gray-500">{s.customer.name}</td>
                                            <td className="whitespace-nowrap px-3 text-sm text-gray-500">{s.name}</td>
                                            <td className="whitespace-nowrap px-3 text-sm text-gray-500">{s.numberOfUsersForBilling}</td>
                                            <td className="whitespace-nowrap px-3 text-sm text-gray-500">{s.schedules?.length || 0}</td>
                                            <td className="relative whitespace-nowrap  pl-3 pr-4 text-sm font-medium sm:pr-6 grid justify-end">
                                                <EditProjectForm project={s} />
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
