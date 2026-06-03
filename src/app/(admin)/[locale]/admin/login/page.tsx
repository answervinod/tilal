'use client';

import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side: Architectural Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-50">
        <Image
          src="/images/hero.jpeg"
          alt="Tilal Architecture"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/10 mix-blend-multiply"></div>
      </div>

      {/* Right side: Login Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24">
        <div className="w-full max-w-sm mx-auto space-y-10">
          
          {/* Logo / Icon */}
          <div className="flex justify-center mb-8">
            <svg className="w-12 h-12 text-slate-800" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Sign in</h1>
            <p className="text-sm text-slate-500">Access the Tilal administrative dashboard.</p>
          </div>

          {error === 'AccessDenied' && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium text-center shadow-sm">
              Access denied. You do not have permission to view this dashboard.
            </div>
          )}

          <button
            onClick={() => signIn('google', { callbackUrl: '/en/admin' })}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border border-slate-200 rounded-xl bg-white text-slate-700 font-semibold hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.05)] active:scale-[0.98]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </button>

          <div className="text-center pt-8">
            <p className="text-xs text-slate-400">
              Only authorized administrators may access this area.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
