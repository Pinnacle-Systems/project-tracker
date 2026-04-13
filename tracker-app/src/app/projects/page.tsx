import { getProjects, getCustomers } from '@/lib/actions'
import { ProjectsClient } from '@/components/ProjectsClient'

export const dynamic = 'force-dynamic'

export default async function ProjectsPage({ searchParams }: { searchParams?: Promise<{ page?: string; limit?: string }> }) {

  const params: any = await searchParams;
  const currentPage = Number(params.page) || 1;
  const limit = params.limit === 'all' ? 'all' : Number(params.limit) || 20;
  const search = params.search || '';

  const [{ projects, totalPages, totalCount }, customers] = await Promise.all([
    getProjects(currentPage, limit, search),
    getCustomers()
  ])  

  return (
    <ProjectsClient 
      projects={projects} 
      customers={customers} 
      totalPages={totalPages} 
      currentPage={currentPage} 
      totalCount={totalCount} 
    />
  )
}