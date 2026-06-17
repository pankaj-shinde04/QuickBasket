import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { HiOutlineShieldCheck, HiOutlineLifebuoy } from 'react-icons/hi2'
import { ROLES } from '../constants/roles'
import RoleSelector from '../components/auth/RoleSelector'
import LoginForm from '../components/auth/LoginForm'
import SignUpForm from '../components/auth/SignUpForm'
import DemoAccounts from '../components/auth/DemoAccounts'

const TABS = {
  login: 'login',
  signup: 'signup',
}

export default function Auth() {
  const [searchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') === 'signup' ? TABS.signup : TABS.login
  const [activeTab, setActiveTab] = useState(initialTab)
  const [role, setRole] = useState(ROLES.CUSTOMER)

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-10">
      {/* Blurred background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-green-100/80 via-yellow-50/60 to-primary-light/70" />
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-tertiary/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-20 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-extrabold italic text-primary sm:text-4xl">
              QuickBasket
            </h1>
          </Link>
          <p className="mt-2 text-sm text-text-muted sm:text-base">
            Your neighborhood grocery, elevated.
          </p>
        </div>

        {/* Auth card */}
        <div className="rounded-2xl bg-white p-6 shadow-xl sm:p-8">
          {/* Tabs */}
          <div className="mb-6 flex border-b border-neutral-border">
            {[
              { key: TABS.login, label: 'Log In' },
              { key: TABS.signup, label: 'Sign Up' },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 pb-3 text-center text-sm font-semibold transition-colors sm:text-base ${
                  activeTab === tab.key
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-text-muted hover:text-text-dark'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Role selector */}
          <div className="mb-6">
            <RoleSelector value={role} onChange={setRole} />
          </div>

          {/* Forms */}
          {activeTab === TABS.login ? (
            <LoginForm role={role} />
          ) : (
            <SignUpForm role={role} />
          )}

          <DemoAccounts onSelectRole={setRole} />
        </div>

        {/* Footer badges */}
        <div className="mt-8 flex items-center justify-center gap-8 text-xs font-semibold uppercase tracking-wider text-text-muted">
          <span className="flex items-center gap-2">
            <HiOutlineShieldCheck className="h-4 w-4" />
            Secure Login
          </span>
          <span className="flex items-center gap-2">
            <HiOutlineLifebuoy className="h-4 w-4" />
            24/7 Support
          </span>
        </div>
      </div>
    </div>
  )
}
