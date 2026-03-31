'use client'
import { useFormStatus } from 'react-dom'

export function SubmitButton({ title, loadingTitle }: { title: string, loadingTitle?: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className={`px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full sm:w-auto text-center ${pending ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {pending ? (loadingTitle || 'Submitting...') : title}
    </button>
  )
}
