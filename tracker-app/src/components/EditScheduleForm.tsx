'use client'

type Schedule = {
  id: string
  type: string
  name: string | null
  moduleName: string | null
  date: string
  startDate: string | null
  recurrence: string
  amount: number | null
  resourceId: string | null
  status: string
  resource: { id: string; name: string; role: string | null } | null
  category: string | null
}

export function EditScheduleForm({ schedule, onEdit }: { schedule: Schedule; onEdit: (schedule: Schedule) => void }) {
  return (
    <button
      type="button"
      onClick={() => onEdit(schedule)}
      className="text-sm mt-1 mr-4 cursor-pointer font-medium text-blue-600 hover:text-blue-900"
    >
      <i className="material-icons !text-[16px]">edit</i>
    </button>
  )
}