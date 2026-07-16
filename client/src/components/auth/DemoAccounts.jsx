import { DUMMY_USERS } from '../../data/dummyUsers'
import { getRoleLabel } from '../../constants/roles'

/**
 * DemoAccounts — shows clickable demo account rows.
 * Clicking a row fills the email into the login form so the user
 * types their own password (never stored client-side).
 */
export default function DemoAccounts({ onSelectEmail }) {
  return (
    <div className="mt-6 rounded-xl border border-dashed border-primary/40 bg-primary-light/50 p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-primary">
        Demo Accounts
      </p>
      <p className="mt-1 text-xs text-text-muted">
        Click a role to fill the email, then enter your password.
      </p>

      <div className="mt-3 space-y-2">
        {DUMMY_USERS.map((account) => (
          <button
            key={account.email}
            type="button"
            onClick={() => onSelectEmail?.(account.email)}
            className="flex w-full items-center justify-between rounded-lg border border-neutral-border bg-white px-3 py-2.5 text-left text-sm transition-colors hover:border-primary hover:bg-white"
          >
            <div>
              <span className="font-semibold text-text-dark">
                {getRoleLabel(account.role)}
              </span>
              <span className="mt-0.5 block text-xs text-text-muted">{account.email}</span>
            </div>
            <span className="shrink-0 text-xs font-semibold text-primary">
              Use →
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
