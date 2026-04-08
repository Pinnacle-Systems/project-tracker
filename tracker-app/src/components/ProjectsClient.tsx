'use client'

import { useState, useCallback } from 'react'
import { EditProjectForm } from './EditProjectForm'
import { ProjectsList } from './ProjectsList'

type Customer = { id: string; name: string }

type Project = {
    id: string
    name: string
    numberOfUsersForBilling: number
    customerId: string
    customer: { id: string; name: string }
    schedules: any[]
    commit_date: Date | null
    go_live_date: Date | null
    amc_date: Date | null
}

export function ProjectsClient({
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
    const [editingProject, setEditingProject] = useState<Project | null>(null)

    const handleEditProject = useCallback((project: Project) => {
        setEditingProject(project)
    }, [])

    const handleCancelEdit = useCallback(() => {
        setEditingProject(null)
    }, [])

    const handleSuccess = useCallback(() => {
        setEditingProject(null)
        window.location.reload()
    }, [])

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-[1.3fr_2fr_1fr] gap-8">
                <div className="md:col-span-1">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Projects</h2>
                        <p className="text-gray-500 mt-2 mb-2">Manage projects and their associated schedules.</p>
                    </div>
                    <EditProjectForm
                        customers={customers}
                        editingProject={editingProject}
                        onCancelEdit={handleCancelEdit}
                        onSuccess={handleSuccess}
                    />
                </div>

                <div className="md:col-span-2 space-y-4 mt-[20px]">
                    <ProjectsList
                        projects={projects}
                        customers={customers}
                        totalPages={totalPages}
                        currentPage={currentPage}
                        totalCount={totalCount}
                        onEditProject={handleEditProject}
                    />
                </div>
            </div>
        </div>
    )
}
