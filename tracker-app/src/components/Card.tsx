export function Card({ children, title, subtitle }: { children: React.ReactNode, title: string, subtitle?: string }) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
        {subtitle && <p className="mt-1 max-w-2xl text-sm text-gray-500">{subtitle}</p>}
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  )
}