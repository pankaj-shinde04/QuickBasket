import { createContext, useCallback, useContext, useReducer } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineInformationCircle,
  HiOutlineExclamationTriangle,
  HiOutlineXMark,
} from 'react-icons/hi2'

// ─── Types ────────────────────────────────────────────────────────────────────
// type: 'success' | 'error' | 'info' | 'warning'

const ToastContext = createContext(null)

// ─── Reducer ──────────────────────────────────────────────────────────────────
function toastReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return [...state, action.toast]
    case 'REMOVE':
      return state.filter((t) => t.id !== action.id)
    default:
      return state
  }
}

// ─── Config ───────────────────────────────────────────────────────────────────
const CONFIG = {
  success: {
    icon: HiOutlineCheckCircle,
    bar: 'bg-emerald-500',
    icon_class: 'text-emerald-500',
    bg: 'bg-white',
  },
  error: {
    icon: HiOutlineXCircle,
    bar: 'bg-red-500',
    icon_class: 'text-red-500',
    bg: 'bg-white',
  },
  warning: {
    icon: HiOutlineExclamationTriangle,
    bar: 'bg-amber-500',
    icon_class: 'text-amber-500',
    bg: 'bg-white',
  },
  info: {
    icon: HiOutlineInformationCircle,
    bar: 'bg-blue-500',
    icon_class: 'text-blue-500',
    bg: 'bg-white',
  },
}

// ─── Single Toast Item ────────────────────────────────────────────────────────
function ToastItem({ toast, onDismiss }) {
  const cfg = CONFIG[toast.type] || CONFIG.info
  const Icon = cfg.icon

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      className={`relative flex w-full max-w-sm items-start gap-3 overflow-hidden rounded-xl shadow-lg border border-neutral-border ${cfg.bg} px-4 py-3.5`}
    >
      {/* Left colour bar */}
      <span className={`absolute left-0 top-0 h-full w-1 ${cfg.bar} rounded-l-xl`} />

      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${cfg.icon_class}`} />

      <div className="min-w-0 flex-1">
        {toast.title && (
          <p className="text-sm font-semibold text-text-dark">{toast.title}</p>
        )}
        {toast.message && (
          <p className={`text-sm ${toast.title ? 'mt-0.5 text-text-muted' : 'font-medium text-text-dark'}`}>
            {toast.message}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="ml-1 shrink-0 rounded-md p-0.5 text-text-muted hover:bg-neutral hover:text-text-dark"
        aria-label="Dismiss"
      >
        <HiOutlineXMark className="h-4 w-4" />
      </button>
    </motion.div>
  )
}

// ─── Portal Layer ─────────────────────────────────────────────────────────────
function ToastLayer({ toasts, onDismiss }) {
  return createPortal(
    <div
      className="fixed bottom-5 right-5 z-[9999] flex flex-col items-end gap-2.5"
      aria-live="polite"
      aria-atomic="false"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>,
    document.body,
  )
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function ToastProvider({ children }) {
  const [toasts, dispatch] = useReducer(toastReducer, [])

  const dismiss = useCallback((id) => {
    dispatch({ type: 'REMOVE', id })
  }, [])

  const toast = useCallback(
    ({ type = 'info', title, message, duration = 4000 }) => {
      const id = `${Date.now()}-${Math.random()}`
      dispatch({ type: 'ADD', toast: { id, type, title, message } })
      if (duration > 0) {
        setTimeout(() => dispatch({ type: 'REMOVE', id }), duration)
      }
    },
    [],
  )

  // Convenience shortcuts
  const success = useCallback((message, title) => toast({ type: 'success', message, title }), [toast])
  const error   = useCallback((message, title) => toast({ type: 'error',   message, title, duration: 5000 }), [toast])
  const warning = useCallback((message, title) => toast({ type: 'warning', message, title }), [toast])
  const info    = useCallback((message, title) => toast({ type: 'info',    message, title }), [toast])

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info, dismiss }}>
      {children}
      <ToastLayer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
