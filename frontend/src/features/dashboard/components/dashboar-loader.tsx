import { Skeleton } from "../../../components/ui/skeleton"

// Full-page loading placeholder, e.g. while the session is being validated.
export function DashboardLoader() {
  return (
    <div
      className="flex min-h-svh flex-col gap-6 p-6"
      role="status"
      aria-busy="true"
      aria-label="Loading"
    >
      {/* Header row */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="size-10 rounded-full" />
      </div>

      {/* Title + subtitle */}
      <div className="grid gap-2">
        <Skeleton className="h-7 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      {/* Card grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="grid gap-3 rounded-xl border p-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>

      <span className="sr-only">Loading...</span>
    </div>
  )
}