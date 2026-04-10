import { DashboardContent } from '@/components/DashboardContent'

export default async function HomePage({searchParams} : {searchParams: Promise<{ resourceId?: string }>}) {
  const resolvedParams = await searchParams;
  const resourceId = resolvedParams.resourceId || '';
  return <DashboardContent resourceId={resourceId} />
}