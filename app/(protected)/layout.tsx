import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { LogoutButton } from "@/components/layout/LogoutButton"
import Link from "next/link"

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur-sm">
        <nav className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <Link
            href="/feed"
            className="text-lg font-bold tracking-tight transition-colors hover:text-primary"
          >
            Social Network
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/feed"
              className="cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              Feed
            </Link>
            <Link
              href={`/profile/${user.id}`}
              className="cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              Profile
            </Link>
            <LogoutButton />
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-8">{children}</main>
    </div>
  )
}
