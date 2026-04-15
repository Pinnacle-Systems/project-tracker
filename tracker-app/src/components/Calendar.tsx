'use client'

import { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CustomerFilter } from './CustomerFilter';
import { getStoredSession } from '@/lib/auth-client';
import { Gantt, Task, ViewMode } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const EventComponent = ({ event }: { event: any }) => (
  <div className="text-xs">
    <div className="font-semibold">{event.customer}</div>
    <div className="font-semibold">{event.project}</div>
    {/* <div className="text-white-600">{event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
    <div className="text-white-600">{event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div> */}
  </div>
);

export default function MyCalendar({ projects, customers, resources, overdue, thisWeek, upcoming }:
  { projects: any[]; customers: any[]; resources: any[]; overdue: any[]; thisWeek: any[]; upcoming: any[] }) {

  const [selectedCategory, setSelectedCategory] = useState('customer');
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const userInfo = getStoredSession();
  const uId = userInfo ? userInfo.id : '';
  const role = userInfo ? userInfo.role : '';  

  const filteredProjects = projects.filter((project) => {
    if (!selectedCustomerId || selectedCustomerId == 'all') return true;
    switch (selectedCategory) {
      case 'customer':
        return project.customerId === selectedCustomerId;
      case 'type':
        return project.schedules.some((s: any) => s.type === selectedCustomerId);
      case 'status':
        return project.schedules.some((s: any) => s.status === selectedCustomerId);
      case 'resources':
        return project.schedules.some((s: any) => s.resourceId === selectedCustomerId);
      default:
        return true;
    }
  });

  const myEvents = filteredProjects.flatMap((p) => {
    const relevantSchedules = p.schedules.filter((s: any) => {
      if (!selectedCustomerId || selectedCustomerId == 'all') return true;
      if (selectedCategory === 'type') return s.type === selectedCustomerId;
      if (selectedCategory === 'status') return s.status === selectedCustomerId;
      if (selectedCategory === 'resources') return s.resourceId === selectedCustomerId;
      return true;
    });
    const userProjects = relevantSchedules.filter((sch: any) => sch.resourceId === uId);
    return (role != 'Admin' ? userProjects : relevantSchedules).map((schedule: any) => ({
      id: `${schedule.id}`,
      title: `${p.name} (${schedule.type})`,
      customer: p.customer.name,
      project: `${p.name} - ${schedule.type} - ${schedule.status}`,
      type: schedule.type,
      status: schedule.status,
      start: schedule.startDate ? new Date(schedule.startDate) : schedule.date ? new Date(schedule.date) : null,
      end: new Date(schedule.date),
    }));
  });

  const eventPropGetter = (event: any) => {
    const isOverdue = overdue.some((s: any) => s.id === event.id);
    const isThisWeek = thisWeek.some((s: any) => s.id === event.id);
    const isUpcoming = upcoming.some((s: any) => s.id === event.id);
    if (isOverdue) {
      return {
        style: {
          backgroundColor: '#fdd1d1bd',
          border: '1px solid #c30a0a',
          color: '#c30a0a',
        }
      };
    }
    if (isThisWeek) {
      return {
        style: {
          backgroundColor: '#fdd998bd',
          border: '1px solid #a16405',
          color: '#a16405',
        }
      };
    }
    if (isUpcoming) {
      return {
        style: {
          backgroundColor: '#bed2fdeb',
          border: '1px solid #153aa7',
          color: '#153aa7',
        }
      };
    }
    return {
      style: {
        backgroundColor: '#daffda',
        border: '1px solid #016b01',
        color: '#016b01'
      }
    }
  };

  const [view, setView] = useState<ViewMode>(ViewMode.Day);
  // const [searchQuery, setSearchQuery] = useState(' ')
  const ganttTasks: Task[] = filteredProjects.flatMap((p) => {
    const relevantSchedules = p.schedules.filter((s: any) => {
      if (!selectedCustomerId || selectedCustomerId === 'all') return true;
      if (selectedCategory === 'type') return s.type === selectedCustomerId;
      if (selectedCategory === 'status') return s.status === selectedCustomerId;
      if (selectedCategory === 'resources') return s.resourceId === selectedCustomerId;
      return true;
    });
    const userProjects = relevantSchedules.filter((sch: any) => sch.resourceId === uId);
    return (role != 'Admin' ? userProjects : relevantSchedules).map((schedule: any) => {
      const isOverdue = overdue.some((s: any) => s.id === schedule.id);
      const isThisWeek = thisWeek.some((s: any) => s.id === schedule.id);
      const isUpcoming = upcoming.some((s: any) => s.id === schedule.id);
      let barColor = '#daffda';
      let progressColor = '#016b01';
      if (isOverdue) {
        barColor = '#fdd1d1';
        progressColor = '#c30a0a';
      } else if (isThisWeek) {
        barColor = '#fdd998';
        progressColor = '#a16405';
      } else if (isUpcoming) {
        barColor = '#bed2fd';
        progressColor = '#153aa7';
      }
      const startDate = new Date(schedule.startDate || schedule.date);
      let endDate = new Date(schedule.date);
      if (startDate.getTime() === endDate.getTime()) {
        endDate.setHours(23, 59, 59, 999);
      }
      return {
        id: String(schedule.id),
        name: `${p.name} - ${schedule.type}`,
        start: startDate,
        end: endDate,
        progress: schedule.status === 'completed' ? 100 : 10,
        type: schedule.type,
        projectName: p.name,
        customerName: p.customer.name,
        status: schedule.status,
        moduleName: schedule.moduleName,
        styles: {
          backgroundColor: barColor,
          backgroundSelectedColor: barColor,
          progressColor: progressColor,
          progressSelectedColor: progressColor,
        },
      };
    });
  });

  // const displayedTasks = ganttTasks.filter((task: any) => {
  //   const cleanQuery = searchQuery.trim();
  //   if (!cleanQuery) return true;
  //   const query = cleanQuery.toLowerCase();
  //   return (
  //     (task.projectName || '').toLowerCase().includes(query) ||
  //     (task.customerName || '').toLowerCase().includes(query) ||
  //     (task.moduleName || '').toLowerCase().includes(query) ||
  //     (task.status || '').toLowerCase().includes(query) ||
  //     (task.type || '').toLowerCase().includes(query)
  //   );
  // });

  const CustomHeader: React.FC<any> = ({ headerHeight, fontFamily, fontSize }) => (
    <div
      className="flex items-center border-b border-gray-300 font-bold bg-gray-100 text-gray-700 sticky top-0 z-10"
      style={{ height: headerHeight, fontFamily, fontSize, width: '350px' }}>
      <div className="w-[150px] px-2 border-r border-gray-300">Customer</div>
      <div className="w-[200px] px-2">Module</div>
    </div>
  );

  const CustomTable: React.FC<any> = ({ tasks, rowHeight, fontFamily, fontSize }) => (
    <div style={{ fontFamily, fontSize, width: '350px' }}>
      {tasks.map((task: any) => (
        <div
          key={task.id}
          className="flex items-center border-b border-gray-300 hover:bg-blue-50 transition-colors"
          style={{ height: rowHeight }}>
          <div className="w-[150px] px-2 truncate border-r border-gray-300">{task.customerName}</div>
          <div className="w-[200px] px-2 truncate">{task.moduleName}</div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ height: '90vh', padding: '25px' }}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex justify-between">
          {/* <div className="relative max-w-sm mr-6">
            <input
              type="text"
              className="w-full pl-4 pr-10 text-[12px] py-2 border border-gray-300 rounded-md hover:border-blue-500 focus-visible:outline-blue-500"
              value={searchQuery}
              placeholder="Search ..."
              onChange={(e) => setSearchQuery(e.target.value)} />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">✕</button>
            )}
          </div> */}
          <h1 className="text-2xl font-bold">Calendar</h1>
          <div className="flex ml-4">
            {(['Day', 'Week', 'Month'] as const).map((v) => (
              <button
                key={v}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${view === ViewMode[v]
                  ? 'bg-gray-100 shadow-sm font-bold text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
                onClick={() => setView(ViewMode[v])}>
                {v}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-end gap-4">
          <select className="cursor-pointer rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border bg-white"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedCustomerId('');
            }} >
            <option value="customer">Customers</option>
            <option value="type">Type</option>
            <option value="status">Status</option>
            <option value="resources">Resources</option>
          </select>
          <CustomerFilter
            customers={customers} projects={projects} resources={resources} category={selectedCategory}
            selectedCustomerId={selectedCustomerId}
            onValueChange={setSelectedCustomerId}
          />
        </div>
      </div>
      {/* <Calendar
        eventPropGetter={eventPropGetter}
        localizer={localizer}
        events={myEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%', position: 'relative', zIndex:0}}
        defaultView="month"
        components={{
          event: EventComponent,
        }}
      /> */}
      <div className="w-full overflow-x-auto border border-gray-300 rounded-lg bg-white overflow-x-auto">
        {ganttTasks.length > 0 ? (
          <div >
            <Gantt
              tasks={ganttTasks}
              viewMode={view}
              listCellWidth="800px"
              columnWidth={view === ViewMode.Month ? 200 : 70}
              TaskListHeader={CustomHeader}
              TaskListTable={CustomTable}
              ganttHeight={520}
              barCornerRadius={4}
              headerHeight={50}
            />
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            No tasks found for the selected filters.
          </div>
        )}
      </div>
    </div>
  );
}