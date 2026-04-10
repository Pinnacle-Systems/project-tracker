'use client'

import { useState } from 'react'
// import { useRouter } from 'next/navigation'
import { SubmitButton } from '@/components/SubmitButton'
import { setSession } from '@/lib/auth-client'
import { login } from '@/lib/actions'

type AuthTab = 'register' | 'login'

export default function LoginPage() {
    // const router = useRouter()
    const [tab, setTab] = useState<AuthTab>('login')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    // const [accountExists, setAccountExists] = useState(false)
    const [visible, setIsVisible] = useState(false)
    const [cvisible, setIscVisible] = useState(false)
    const resetError = () => setError('')

    const handleRegister = (event: React.FormEvent<HTMLFormElement>) => {
        // event.preventDefault()
        // resetError()
        // if (!name.trim() || !password.trim() || !confirmPassword.trim()) {
        //     setError('Please fill required fields.')
        //     return
        // }
        // if (password !== confirmPassword) {
        //     setError('Passwords do not match.')
        //     return
        // }
        // const result = createUser(name, password)
        // if (!result.success) {
        //     setError(result.error || 'Unable to create account.')
        //     return
        // }
        // router.push('/')
    }

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        resetError();
        if (!name.trim() || !password.trim()) {
            setError('Please enter your credentials.');
            return;
        }
        const result = await login(name, password);
        if (result.success && result.user) {
            setSession(result.user.id, result.user.name, result.user.role ?? '');
            window.location.href = '/';
        } else {
            setError(result.error || 'Login failed.');
        }
    };

    return (
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-lg shadow-slate-200/60">
            <div className="mb-8 text-center">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Project Tracker</p>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
                    {tab === 'register' ? 'Create your account' : 'Login'}
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                    {tab === 'register'
                        ? 'Create a new account to access your projects.'
                        : 'Enter your email and password to continue.'}
                </p>
            </div>

            {/* {accountExists && tab === 'register' ? (
                <div className="mb-6 rounded-2xl bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
                    An account already exists. Use the Login tab to continue.
                </div>
            ) : null} */}

            <form onSubmit={tab === 'register' ? handleRegister : handleLogin} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700">User Name <span className="text-red-500">*</span></label>
                    <input
                        id="name"
                        type="name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        className="mt-2 block w-full rounded-sm border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
                        placeholder="John Doe"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <input
                            id="password"
                            type={visible == false ? "password" : "text"}
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            className="mt-2 block w-full rounded-sm border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
                            placeholder="Enter your password"
                        />
                        <div className="absolute top-[15px] right-[0]">
                            <i className="material-icons mr-2 !text-[16px] text-blue-700 cursor-pointer" onClick={() => setIsVisible(visible == false ? true : false)}>
                                {visible == false ? 'visibility_off' : 'visibility'}</i>
                        </div>
                    </div>
                </div>

                {tab === 'register' ? (
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">Confirm Password <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <input
                                id="confirmPassword"
                                type={cvisible == false ? "password" : "text"}
                                value={confirmPassword}
                                onChange={(event) => setConfirmPassword(event.target.value)}
                                className="mt-2 block w-full rounded-sm border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
                                placeholder="Re-enter password"
                            />
                            <div className="absolute top-[15px] right-[0]">
                                <i className="material-icons mr-2 !text-[16px] text-blue-700 cursor-pointer" onClick={() => setIscVisible(cvisible == false ? true : false)}>
                                    {cvisible == false ? 'visibility_off' : 'visibility'}</i>
                            </div>
                        </div>
                    </div>
                ) : null}

                {error ? <p className="text-sm text-red-600">{error}</p> : null}

                <div className="grid justify-center">
                    <SubmitButton title={tab === 'register' ? 'Create account' : 'Login'} loadingTitle={tab === 'register' ? 'Creating...' : 'Signing in...'} />
                    <div className="text-gray-400 text-center mx-2 my-2">--------------- or ---------------</div>
                    {tab === 'register' ? (
                        <p className="text-sm text-center text-slate-500">Already have an account? Click <></>
                            <button
                                type="button"
                                onClick={() => setTab('login')}
                                className="text-blue-500 hover:text-blue-800 cursor-pointer"
                            >
                                Login
                            </button>
                        </p>
                    ) : (
                        <p className="text-sm text-slate-500">New here? Click <></>
                            <button
                                type="button"
                                onClick={() => setTab('register')}
                                className="text-blue-500 hover:text-blue-800 cursor-pointer"
                            >
                                Create Account
                            </button>
                        </p>
                    )}
                </div>
            </form>
        </div>
    )
}