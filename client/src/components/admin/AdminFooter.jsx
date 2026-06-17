export default function AdminFooter() {
  return (
    <footer className="mt-auto border-t border-primary bg-primary px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg font-extrabold italic">QuickBasket</p>
          <p className="mt-1 text-xs text-white/70">
            &copy; {new Date().getFullYear()} QuickBasket Grocery Platform. All rights reserved.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-white/80">
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms of Service</a>
          <a href="#" className="hover:text-white">Help Center</a>
          <a href="#" className="hover:text-white">Contact Support</a>
        </div>
      </div>
    </footer>
  )
}
