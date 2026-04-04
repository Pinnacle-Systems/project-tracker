import MyCalendar from '@/components/Calendar';
import { getProjects } from '@/lib/actions';
export const dynamic = 'force-dynamic';

export default async function CalendarPage() {
  const {projects} = await getProjects();  
  return (
    <div className="min-h-[90vh] bg-gray-100 p-4">
      <div className="mx-auto w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <MyCalendar projects={projects} />
      </div>
    </div>
  );
}
