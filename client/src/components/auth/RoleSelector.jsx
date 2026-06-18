import {
  HiOutlineShoppingBag,
  HiOutlineBuildingStorefront,
  HiOutlineShieldCheck,
} from 'react-icons/hi2'
import { ROLE_CONFIG } from '../../constants/roles'

const iconMap = {
  'shopping-bag': HiOutlineShoppingBag,
  store: HiOutlineBuildingStorefront,
  shield: HiOutlineShieldCheck,
}

export default function RoleSelector({ value, onChange, roles = ROLE_CONFIG }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
        I am a...
      </p>
      <div
        className={`grid gap-2 rounded-xl bg-neutral p-1.5 sm:gap-3 ${
          roles.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
        }`}
      >
        {roles.map((role) => {
          const Icon = iconMap[role.icon]
          const isActive = value === role.value

          return (
            <button
              key={role.value}
              type="button"
              onClick={() => onChange(role.value)}
              className={`flex flex-col items-center gap-1.5 rounded-lg px-2 py-3 text-xs font-semibold transition-all sm:flex-row sm:gap-2 sm:px-3 sm:text-sm ${
                isActive
                  ? 'bg-white text-primary shadow-sm ring-1 ring-neutral-border'
                  : 'text-text-muted hover:text-text-dark'
              }`}
            >
              <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-primary' : ''}`} />
              <span className="text-center leading-tight">{role.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
