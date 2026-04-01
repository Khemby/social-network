import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { signOut } from "@/app/(auth)/auth-actions"
import { Button } from "@/components/ui/button"
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
    <div className="min-h-screen">
      <header className="border-b">
        <nav className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link href="/feed" className="text-lg font-bold">
            Social Network
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href={`/profile/${user.id}`}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Profile
            </Link>
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <form action={signOut}>
              <Button variant="outline" size="sm">
                Log out
              </Button>
            </form>
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-6">{children}</main>
    </div>
  )
}
