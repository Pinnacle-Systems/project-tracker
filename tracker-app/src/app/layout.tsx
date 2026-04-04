import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { NavLink } from '@/components/NavLink'
import CalendarToggle from '@/components/CalendarToggle'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Project Tracker Dashboard',
  description: 'Manage customers, projects, and schedules automatically',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50 text-gray-900 flex flex-col`}
       suppressHydrationWarning>
        <header className="bg-white border-b border-gray-200">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold tracking-tight text-blue-600">
              <Link href="/">TrackingApp</Link>
            </h1>
            <nav className="flex items-center space-x-6">
              <NavLink href="/">Dashboard</NavLink>
              <NavLink href="/customers">Customers</NavLink>
              <NavLink href="/projects">Projects</NavLink>
              <NavLink href="/resources">Resources</NavLink>
              <CalendarToggle />
            </nav>
          </div>
        </header>

        <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
