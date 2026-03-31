import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

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
      >
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold tracking-tight text-blue-600">
              <Link href="/">TrackingApp</Link>
            </h1>
            <nav className="flex space-x-6">
              <Link href="/" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                Dashboard
              </Link>
              <Link href="/customers" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                Customers
              </Link>
              <Link href="/projects" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                Projects
              </Link>
              <Link href="/resources" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                Resources
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
