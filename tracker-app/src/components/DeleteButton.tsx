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
      className="text-red-600 hover:text-red-900 ml-4 font-medium text-xs disabled:opacity-50"
      title="Delete schedule"
    >
      {pending ? 'Deleting...' : 'Delete'}
    </button>
  )
}
