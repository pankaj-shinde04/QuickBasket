import { FcGoogle } from 'react-icons/fc'
import { FaApple } from 'react-icons/fa'

export default function SocialLogin() {
  return (
    <div>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-4 text-text-muted">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-xl border border-neutral-border bg-white py-3 text-sm font-semibold text-text-dark transition-colors hover:bg-neutral"
        >
          <FcGoogle className="h-5 w-5" />
          Google
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-xl border border-neutral-border bg-white py-3 text-sm font-semibold text-text-dark transition-colors hover:bg-neutral"
        >
          <FaApple className="h-5 w-5" />
          Apple
        </button>
      </div>
    </div>
  )
}
