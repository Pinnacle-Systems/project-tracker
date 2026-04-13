import MyCalendar from '@/components/Calendar';
import { getCategorizedSchedules, getCustomers, getProjects, getResourcesWithStats } from '@/lib/actions';
export const dynamic = 'force-dynamic';

export default async function CalendarPage() {
  
  const {projects} = await getProjects();  
  const customers = await getCustomers();
  const resources = await getResourcesWithStats()
  const schedules = await getCategorizedSchedules();
  const { overdue, thisWeek, upcoming } = schedules;

  return (
    <div className="min-h-[60vh] bg-gray-100">
      <div className="mx-auto w-full rounded-lg bg-white shadow-sm">
        <MyCalendar projects={projects} customers={customers} resources={resources} overdue={overdue} thisWeek={thisWeek} upcoming={upcoming}/>
      </div>
    </div>
  );
}