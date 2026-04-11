'use client'

import { useState } from 'react'
import { SubmitButton } from '@/components/SubmitButton'
import { setSession } from '@/lib/auth-client'
import { login } from '@/lib/actions'

export default function LoginPage() {
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [visible, setIsVisible] = useState(false)
    const resetError = () => setError('')

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
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">Login</h1>
                <p className="mt-2 text-sm text-slate-500">Enter your username and password to continue.
                </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
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

                {error ? <p className="text-sm text-red-600">{error}</p> : null}

                <div className="grid justify-center">
                    <SubmitButton title="Login" loadingTitle="Signing in..." />
                </div>
            </form>
        </div>
    )
}