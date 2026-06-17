import { Link } from 'react-router-dom'
import { FaFacebookF, FaTwitter, FaInstagram, FaGlobe } from 'react-icons/fa'

export default function CustomerFooter({ variant = 'simple' }) {
  if (variant === 'extended') {
    return (
      <footer className="mt-10 bg-primary text-white">
        <div className="px-5 py-12 sm:px-8 lg:px-10">
          <div className="text-center">
            <p className="text-2xl font-extrabold italic">QuickBasket</p>
          </div>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="mb-3 text-sm font-bold">Company</p>
              <ul className="space-y-2 text-sm text-white/80">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Sustainability</a></li>
              </ul>
            </div>
            <div>
              <p className="mb-3 text-sm font-bold">Support</p>
              <ul className="space-y-2 text-sm text-white/80">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Returns</a></li>
              </ul>
            </div>
            <div>
              <p className="mb-3 text-sm font-bold">Legal</p>
              <ul className="space-y-2 text-sm text-white/80">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <p className="mb-3 text-sm font-bold">Subscribe to our newsletter</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 rounded-lg border-0 bg-primary-dark px-3 py-2 text-sm text-white placeholder:text-white/50 outline-none"
                />
                <button
                  type="button"
                  className="rounded-lg bg-secondary px-4 py-2 text-sm font-bold text-text-dark hover:bg-secondary-dark"
                >
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/20 px-5 py-4 text-center text-xs text-white/70">
          &copy; {new Date().getFullYear()} QuickBasket. All rights reserved.
        </div>
      </footer>
    )
  }

  return (
    <footer className="mt-10 bg-primary text-white">
      <div className="px-5 py-10 text-center sm:px-8">
        <p className="text-xl font-extrabold italic">QuickBasket</p>
        <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-white/80">
          <Link to="/dashboard/customer" className="hover:text-white">About Us</Link>
          <a href="#" className="hover:text-white">Contact</a>
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms of Service</a>
          <a href="#" className="hover:text-white">Help Center</a>
        </div>
        <div className="mt-4 flex justify-center gap-4 text-white/80">
          <FaFacebookF />
          <FaTwitter />
          <FaInstagram />
          <FaGlobe />
        </div>
        <p className="mt-4 text-xs text-white/70">
          &copy; {new Date().getFullYear()} QuickBasket Grocery. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
