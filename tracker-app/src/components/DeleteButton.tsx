'use client'

import { useFormStatus } from 'react-dom'

export function DeleteButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!window.confirm('Are you sure you want to delete this schedule? This cannot be undone.')) {
          e.preventDefault()
        }
      }}
      className="cursor-pointer text-red-600 hover:text-red-900 font-medium text-xs disabled:opacity-50"
      title="Delete schedule"
    >
      {pending ? 'Deleting...' : <i className="material-icons !text-[16px]">delete</i>}
    </button>
  )
}
