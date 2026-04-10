'use client'

import { ReactNode, useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { getStoredSession, isAuthenticated, signOut } from '@/lib/auth-client'
import { NavLink } from '@/components/NavLink'
import CalendarToggle from '@/components/CalendarToggle'

const PUBLIC_PATHS = ['/login']

export default function AuthGate({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const session = getStoredSession()
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const auth = isAuthenticated()
      setAuthenticated(auth)
      setReady(true)
      if (!auth && !PUBLIC_PATHS.includes(pathname)) {
        router.replace('/login')
      } else if (auth && pathname === '/login') {
        router.replace('/')
      }
    }
    checkAuth()
  }, [pathname, router])

  useEffect(() => {
    const timer = setInterval(() => {
      if (session?.expiresAt) {
        const remaining = Math.round((new Date(session.expiresAt).getTime() - Date.now()) / 1000)
        if (remaining <= 1) {
          clearInterval(timer)
          signOut()
          window.location.href = '/login'
        }
        else {
          setTimeLeft(remaining)
        }
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleSignOut = () => {
    signOut()
    router.replace('/login')
  }

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-slate-700">
        Checking session...
      </div>
    )
  }

  const showNavigation = authenticated && pathname !== '/login'

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      {timeLeft !== null && timeLeft <= 10 && timeLeft > 0 && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-bounce">
          <div className="bg-red-600 text-white px-6 py-2 rounded-full shadow-2xl font-bold border-2 border-white">
            ⚠️ Session expiring in {timeLeft}s
          </div>
        </div>
      )}
      {showNavigation ? (
        <header className="bg-white border-b border-gray-200">
          <div className="mx-auto px-4 sm:px-6 lg:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <Link href="/" className="text-xl font-bold tracking-tight text-blue-600">
              TrackingApp
            </Link>
            <div className="flex items-center gap-4">
              <nav className="flex flex-wrap items-center gap-5">
                <NavLink href="/">Dashboard</NavLink>
                <NavLink href="/customers">Customers</NavLink>
                <NavLink href="/projects">Projects</NavLink>
                <NavLink href="/resources">Resources</NavLink>
              </nav>
              <CalendarToggle />
              {
                session &&
                <div className="relative flex cursor-pointer">
                  <i className="material-icons text-[cadetblue] !text-[28px]" onClick={() => setIsOpen(!isOpen)}>account_circle</i>
                  {isOpen && (
                    <div className="absolute mt-2 text-[12px] w-max right-[0] top-[30px] bg-white border border-gray-300 rounded shadow-lg z-10">
                      <ul className="py-2 text-gray-600">
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">{session.name}  ({session.role})</li>
                        <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600" onClick={handleSignOut}>Logout 
                          <i className="material-icons !text-[14px] ml-2">power_settings_new
                        </i></li>
                      </ul>
                    </div>
                  )}
                </div>
              }
            </div>
          </div>
        </header>
      ) : null}
      <main className={`${pathname == '/login' ? '':"flex-1 w-full mx-auto px-4 sm:px-6 lg:px-6 py-6"}`}>
        {children}
      </main>
    </div>
  )
}