'use client'
import { useFormStatus } from 'react-dom'

export function SubmitButton({ title, loadingTitle, forceLoading }: { title: string, loadingTitle?: string, forceLoading?: boolean }) {
  const { pending } = useFormStatus()
  const isLoading = pending || forceLoading

  return (
    <button
      type="submit"
      disabled={isLoading}
      className={`px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full sm:w-auto text-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isLoading ? (loadingTitle || 'Submitting...') : title}
    </button>
  )
}
