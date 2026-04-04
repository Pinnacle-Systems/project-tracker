'use client'

import { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';

import 'react-big-calendar/lib/css/react-big-calendar.css';

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

export default function MyCalendar({ projects }: { projects: any[] }) {
  const [events, setEvents] = useState(projects);
  const myEvents = events.flatMap((project) => (
    project.schedules.map((schedule: any) => {
      return {
        customer: `${project.customer.name}`,
        project: `${project.name} - ${schedule.type} - ${schedule.status}`,
        start: schedule.startDate ? new Date(schedule.startDate) : new Date(schedule.date),
        end: new Date(schedule.date),
      };
    })
  ));

  return (
    <div style={{ height: '80vh', padding: '20px' }}>
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
