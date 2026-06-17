export default function CustomerPlaceholder({ title }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold text-text-dark">{title}</h1>
      <p className="mt-2 text-text-muted">Coming soon.</p>
    </div>
  )
}
