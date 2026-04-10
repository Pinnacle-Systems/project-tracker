import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login | Project Tracker',
  description: 'Sign in to your Project Tracker dashboard.',
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100vh] flex justify-center bg-slate-100 py-16">
      <div className="mx-auto flex min-h-full w-full max-w-3xl items-center justify-center px-4">
        {children}
      </div>
    </div>
  )
}
