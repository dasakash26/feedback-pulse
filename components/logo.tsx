import Link from "next/link"
export function Logo() {
  return (
    <Link href="/dashboard" className="flex items-center  gap-2 px-4 pt-4 pb-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-sm">
        FP
      </div>
      <span className="text-lg font-semibold tracking-tight">Feedback Pulse</span>
    </Link>
  )
}
