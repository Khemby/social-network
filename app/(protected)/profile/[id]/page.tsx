import { createClient } from "@/lib/supabase-server"
import { notFound } from "next/navigation"
import Link from "next/link"
import type { Post } from "@/lib/types"
import { PostFeed } from "@/components/posts/PostFeed"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default async function ProfilePage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", params.id)
    .single()

  if (!profile) {
    notFound()
  }

  const { data: posts } = await supabase
    .from("posts")
    .select("*, profiles(*)")
    .eq("user_id", params.id)
    .order("created_at", { ascending: false })

  const isOwnProfile = user?.id === params.id

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="flex-row items-start justify-between">
          <div>
            <CardTitle className="text-2xl">
              {profile.display_name || profile.username}
            </CardTitle>
            {profile.display_name && (
              <p className="text-sm text-muted-foreground">
                @{profile.username}
              </p>
            )}
          </div>
          {isOwnProfile && (
            <Link href="/profile/edit">
              <Button variant="outline" size="sm">
                Edit Profile
              </Button>
            </Link>
          )}
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {profile.bio || "No bio yet."}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Joined {new Date(profile.created_at).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>

      <h2 className="text-xl font-bold">Posts</h2>
      <PostFeed
        posts={(posts as Post[]) || []}
        currentUserId={user?.id}
      />
    </div>
  )
}
