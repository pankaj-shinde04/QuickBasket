import { FaReact } from 'react-icons/fa'
import { SiTailwindcss, SiReactrouter } from 'react-icons/si'

const stack = [
  { icon: FaReact, name: 'React', color: 'text-sky-500' },
  { icon: SiTailwindcss, name: 'Tailwind CSS', color: 'text-cyan-500' },
  { icon: SiReactrouter, name: 'React Router', color: 'text-red-500' },
]

export default function About() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">About QuickBasket</h1>
        <p className="mt-4 text-gray-600">
          This is the starter client app for QuickBasket. It includes routing,
          utility-first styling, and a rich icon library ready for you to build on.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-center text-lg font-semibold text-gray-900">
          Tech Stack
        </h2>
        <ul className="flex flex-wrap justify-center gap-8">
          {stack.map(({ icon: Icon, name, color }) => (
            <li key={name} className="flex flex-col items-center gap-2">
              <Icon className={`h-12 w-12 ${color}`} />
              <span className="text-sm font-medium text-gray-700">{name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
