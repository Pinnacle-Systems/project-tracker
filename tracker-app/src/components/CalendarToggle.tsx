"use client";

import { useRouter } from 'next/navigation';

export default function CalendarToggle() {
  const router = useRouter();
  const handleClick = () => {
     router.push('/calendar');
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="cursor-pointer"
    >
      <img src="/calendar.svg" alt="Calendar" className="w-7 h-7" />
    </button>
  );
}