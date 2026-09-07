interface UnauthorizedProps {
  message?: string
}

export default function Unauthorized({
  message = 'Please log in to access this page.',
}: UnauthorizedProps) {
  return (
    <main className="w-full h-screen flex flex-col items-center justify-center gap-1">
      <h1 className="text-xl font-semibold md:text-3xl">401 - Unauthorized Access</h1>
      <p>{message}</p>
    </main>
  )
}
