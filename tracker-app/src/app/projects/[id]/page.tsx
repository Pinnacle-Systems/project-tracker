import { getProjectById, getResources } from '@/lib/actions'
import { ProjectDetailClient } from '@/components/ProjectDetailClient'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function ProjectDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ type?: string }> }) {
  const { id } = await params
  const {resources} = await getResources()
  const [project] = await Promise.all([
    getProjectById(id),
    getResources(), 
  ])
  const { type } = await searchParams;
  if (!project) notFound()

  const projectWithSerializedDates = {
    ...project,
    commit_date: project.commit_date ? project.commit_date.toISOString() : " ",
    go_live_date: project.go_live_date ? project.go_live_date.toISOString() : " ",
    amc_date: project.amc_date ? project.amc_date.toISOString() : " ",
    schedules: project.schedules.map((s) => ({
      ...s,
      date:  s.date ? s.date.toISOString() : " ",
      startDate: s.startDate ? s.startDate.toISOString() : " ",
      category: s.category || " ",
      resource: s.resource ? {
        id: s.resource.id,
        name: s.resource.name,
        role: s.resource.role
      } : null 
    }))
  }

  return (
    <ProjectDetailClient project={projectWithSerializedDates} resources={resources} projectId={id} defaultScheduleType={type} />
  )
}
