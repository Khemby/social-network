export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Social Network</h1>
        <p className="mt-1 text-muted-foreground">
          Share updates. See what others are posting.
        </p>
      </div>
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
