import { getProjectById, getResources } from '@/lib/actions'
import { ProjectDetailClient } from '@/components/ProjectDetailClient'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function ProjectDetailPage({ params,searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ type?: string }> }) {
  const { id } = await params
  const [project, resources] = await Promise.all([
    getProjectById(id),
    getResources(),
  ])
  const { type } = await searchParams; 
  if (!project) notFound()

  const projectWithSerializedDates = {
    ...project,
    schedules: project.schedules.map((s) => ({
      ...s,
      date: s.date.toISOString(),
      startDate: s.startDate ? s.startDate.toISOString() : null,
    }))
  }

  return (
    <ProjectDetailClient project={projectWithSerializedDates} resources={resources} projectId={id} defaultScheduleType={type} />
  )
}
