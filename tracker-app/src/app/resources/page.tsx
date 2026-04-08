import { getResources, createResource } from '@/lib/actions'
import { ResourceForm } from '@/components/ResourceForm'

export const dynamic = 'force-dynamic'

export default async function ResourcesPage({ searchParams }: { searchParams?: Promise<{ page?: string; limit?: string }> }) {
  const params: any = await searchParams;
  const currentPage = Number(params.page) || 1;
  const limit = params.limit === 'all' ? 'all' : Number(params.limit) || 25;
  const [{ resources, totalPages, totalCount }] = await Promise.all([
    getResources(currentPage, limit),
  ])
  return (
    <ResourceForm resources={resources} totalPages={totalPages} currentPage={currentPage} totalCount={totalCount} />
  )
}
