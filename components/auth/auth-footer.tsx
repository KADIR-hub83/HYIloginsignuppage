// Next Imports
import Link from 'next/link'

export function AuthFooter() {
  return (
    <div className="w-full text-center space-y-2 text-sm text-muted-foreground mt-6">
      <div className="flex items-center justify-center space-x-4 px-4">
        <Link href="/terms" className="hover:underline truncate">
          Terms of Service
        </Link>
        <span className="flex-shrink-0">•</span>
        <Link href="/privacy" className="hover:underline truncate">
          Privacy Policy
        </Link>
      </div>
      <div className="break-words px-4">© {new Date().getFullYear()} HYI.AI Private Limited.</div>
    </div>
  )
}
