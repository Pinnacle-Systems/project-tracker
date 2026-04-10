type SessionData = {
  id: string
  expiresAt: string 
  role: string
  name: string
}

const SESSION_KEY = 'project-tracker-session'

export function getStoredSession(): SessionData | null {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(SESSION_KEY)
  if (!raw) return null
  try {
    const session = JSON.parse(raw) as SessionData
    if (!session?.id || !session?.expiresAt) {
      window.localStorage.removeItem(SESSION_KEY)
      return null
    }
    const expiresAt = new Date(session.expiresAt)
    const now = new Date()
    if (expiresAt <= now) {
      window.localStorage.removeItem(SESSION_KEY)
      return null
    }
    return session
  } catch {
    window.localStorage.removeItem(SESSION_KEY)
    return null
  }
}

export function setSession(id: string, name: string, role: string) {
  if (typeof window === 'undefined') return;
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
  const sessionData = { id, name, expiresAt, role };
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  const session = localStorage.getItem('project-tracker-session');
  if (!session) return false;
  const { expiresAt } = JSON.parse(session);
  return new Date() < new Date(expiresAt);
}

export function signOut(): void {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(SESSION_KEY)
}

// function safeParse(value: string | null) {
//   if (!value) return []
//   try {
//     return JSON.parse(value)
//   } catch {
//     return []
//   }
// }

// export function getStoredUsers(): AuthUser[] {
//   if (typeof window === 'undefined') return []
//   return safeParse(window.localStorage.getItem(USERS_KEY)) as AuthUser[]
// }

// export function hasAccount(): boolean {
//   return getStoredUsers().length > 0
// }

// export function findUser(email: string): AuthUser | undefined {
//   return getStoredUsers().find(
//     (user) => user.email.toLowerCase() === email.toLowerCase()
//   )
// }

// export function getSessionEmail(): string | null {
//   const session = getStoredSession()
//   return session?.id ?? null
// }

// export function createUser(email: string, password: string): { success: boolean; error?: string } {
//   if (typeof window === 'undefined') {
//     return { success: false, error: 'Client-side only' }
//   }

//   const normalizedEmail = email.trim().toLowerCase()
//   if (!normalizedEmail || !password.trim()) {
//     return { success: false, error: 'Email and password are required.' }
//   }

//   if (findUser(normalizedEmail)) {
//     return { success: false, error: 'An account with this email already exists.' }
//   }

//   const users = getStoredUsers()
//   users.push({ email: normalizedEmail, password })
//   window.localStorage.setItem(USERS_KEY, JSON.stringify(users))
//   // setSession(normalizedEmail)
//   return { success: true }
// }

// export function authenticateUser(name: string, password: string): { success: boolean; error?: string } {
//   if (typeof window === 'undefined') {
//     return { success: false, error: 'Client-side only' }
//   }

//   const normalizedEmail = name.trim().toLowerCase()
//   const user = findUser(normalizedEmail)
//   if (!user) {
//     return { success: false, error: 'No account found with that email.' }
//   }

//   if (user.password !== password) {
//     return { success: false, error: 'Incorrect password.' }
//   }

//   // setSession(normalizedEmail)
//   return { success: true }
// }

// const SESSION_KEY = 'project-tracker-session';

// export function setSession(name: string) {
//   if (typeof window === 'undefined') return;

//   // Calculate 24 hours from now
//   const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  
//   const sessionData = {
//     name,
//     expiresAt
//   };

//   window.localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
// }

// export function getStoredSession(): { name: string; expiresAt: string } | null {
//   if (typeof window === 'undefined') return null;

//   const raw = window.localStorage.getItem(SESSION_KEY);
//   if (!raw) return null;

//   try {
//     const session = JSON.parse(raw);
//     const now = new Date();
//     const expiry = new Date(session.expiresAt);

//     // 3. Check if the session has expired
//     if (expiry <= now) {
//       window.localStorage.removeItem(SESSION_KEY);
//       return null;
//     }

//     return session;
//   } catch {
//     return null;
//   }
// }