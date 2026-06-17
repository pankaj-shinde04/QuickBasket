import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaCcAmex,
} from 'react-icons/fa'
import Logo from './Logo'
import { footerLinks } from '../data/mockData'

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="page-container py-10 sm:py-12 lg:py-14">
        <div className="grid gap-8 sm:grid-cols-2 sm:gap-8 lg:grid-cols-5 lg:gap-10">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo light />
            <p className="mt-4 text-sm leading-relaxed text-white/80 sm:text-base">
              123 Market Street, Fresh City, FC 10001
            </p>
            <p className="mt-2 text-sm text-white/80 sm:text-base">+1 (800) 123-4567</p>
            <p className="text-sm text-white/80 sm:text-base">hello@quickbasket.com</p>
            <div className="mt-4 flex gap-3">
              {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-sm transition-colors hover:bg-white/25 sm:h-10 sm:w-10"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider sm:text-sm">
                {title}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-white/75 transition-colors hover:text-white"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/15">
        <div className="page-container flex flex-col items-center justify-between gap-4 py-5 sm:flex-row">
          <p className="text-center text-xs text-white/70 sm:text-left sm:text-sm">
            &copy; {new Date().getFullYear()} QuickBasket. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-2xl text-white/80 sm:text-3xl">
            <FaCcVisa />
            <FaCcMastercard />
            <FaCcPaypal />
            <FaCcAmex />
          </div>
        </div>
      </div>
    </footer>
  )
}
