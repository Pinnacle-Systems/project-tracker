'use client'

import { createResource, updateResource } from "@/lib/actions";
import { Card } from "./Card";
import { SubmitButton } from "./SubmitButton";
import { EditResourceForm } from "./EditResourceForm";
import { useState } from "react";
import { getStoredSession } from "@/lib/auth-client";

export function ResourceForm({ resources, totalPages, currentPage, totalCount }: { resources: { id: string; name: string; role: string | null; password: string | null }[]; totalPages: number; currentPage: number; totalCount: number }) {

    const [editingResource, setEditingResource] = useState<{ id: string; name: string; role: string | null; password: string | null } | null>(null)

    const handleEditResource = (resource: { id: string; name: string; role: string | null; password: string | null }) => {
        setEditingResource(resource)
    }

    const [error, setError] = useState('')

    const handleSubmit = async (formData: FormData, form: HTMLFormElement) => {
        if (editingResource) {
            await updateResource(editingResource.id, formData)
            setEditingResource(null)
        } else {
            const result = await createResource(formData)
            setError(result ? result.error : '')
            if (!result) {
                form.reset()
            }
        }
    }

    const handleCancelEdit = () => {
        setEditingResource(null)
    }
    
    const userInfo = getStoredSession();
    const userId = userInfo?.id;
    const role = userInfo?.role;
    const filterResource = resources.filter((r) => r.id == userId)

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Resources</h2>
                        <p className="text-gray-500 mt-2 mb-2">Manage the people that can be assigned to schedules.</p>
                    </div>
                    <Card title={editingResource ? "Edit Resource" : "Add New Resource"}>
                        <form
                            key={editingResource?.id || 'create'}
                            onSubmit={async (e) => {
                                e.preventDefault()
                                const form = e.target as HTMLFormElement
                                const formData = new FormData(form)
                                await handleSubmit(formData, form)
                            }}
                            className="space-y-4"
                        >
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                    placeholder="John Doe"
                                    defaultValue={editingResource?.name || ""}
                                />
                            </div>
                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                                <select
                                    name="role"
                                    id="role"
                                    disabled={role != 'Admin'}
                                    className="cursor-pointer mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border bg-white"
                                    defaultValue={editingResource?.role || ""}
                                >
                                    <option value="">Select a role</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Developer">Developer</option>
                                    <option value="Tester">Tester</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                <input
                                    type="text"
                                    name="password"
                                    id="password"
                                    defaultValue={editingResource?.password || ""}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                />
                            </div>
                            <div className="text-red-600 text-[12px]">{error}</div>
                            <div className="flex gap-2">
                                <SubmitButton title={editingResource ? "Update Resource" : "Create Resource"} loadingTitle={editingResource ? "Updating..." : "Creating..."} role={editingResource ? ' ' : role} from={'resource'} />
                                {editingResource && (
                                    <button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </Card>
                </div>
                <div className="md:col-span-2 space-y-4 overflow-auto h-[75vh] mt-[20px]">
                    {(role != 'Admin' ? filterResource : resources).length === 0 ? (
                        <div className="p-8 text-center bg-white rounded-lg border border-gray-200 text-gray-500 mt-[50px]">
                            No resources found. Create one to get started!
                        </div>
                    ) : null}
                    <EditResourceForm resources={(role != 'Admin' ? filterResource : resources)} onEditResource={handleEditResource} totalPages={totalPages} currentPage={currentPage} totalCount={totalCount} />
                </div>
            </div>
        </div>
    )
}