'use client'

import { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CustomerFilter } from './CustomerFilter';

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

export default function MyCalendar({ projects, customers, resources }: { projects: any[]; customers: any[]; resources: any[] }) {
  const [selectedCategory, setSelectedCategory] = useState('customer');
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const filteredProjects = projects.filter((project) => {
    if (!selectedCustomerId) return true;
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
      if (!selectedCustomerId) return true;
      if (selectedCategory === 'type') return s.type === selectedCustomerId;
      if (selectedCategory === 'status') return s.status === selectedCustomerId;
      if (selectedCategory === 'resources') return s.resourceId === selectedCustomerId;
      return true;
    });
    return relevantSchedules.map((schedule: any) => ({
      title: `${p.name} (${schedule.type})`,
      customer: p.customer.name,
      project: `${p.name} - ${schedule.type} - ${schedule.status}`,
      type: schedule.type,
      status: schedule.status,
      start: schedule.startDate ? new Date(schedule.startDate) : schedule.date ? new Date(schedule.date) : null,
      end: new Date(schedule.date),
    }));
  });

  return (
    <div style={{ height: '80vh', padding: '20px' }}>
      <div className="mb-4 flex items-center justify-end gap-4">
        <select className="cursor-pointer rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border bg-white"
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setSelectedCustomerId('');
          }} >
          <option value="customer">Customers</option>
          {/* <option value="project">Projects</option> */}
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
      <Calendar
        localizer={localizer}
        events={myEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        defaultView="month"
        components={{
          event: EventComponent,
        }}
      />
    </div>
  );
}