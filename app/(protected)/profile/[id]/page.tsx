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
    .select("*, profiles(*), likes(count)")
    .eq("user_id", params.id)
    .order("created_at", { ascending: false })

  let userLikedPostIds: Set<string> = new Set()
  if (user) {
    const { data: userLikes } = await supabase
      .from("likes")
      .select("post_id")
      .eq("user_id", user.id)

    if (userLikes) {
      userLikedPostIds = new Set(userLikes.map((l) => l.post_id))
    }
  }

  const postsWithLikes = ((posts as Post[]) || []).map((post) => ({
    ...post,
    user_has_liked: userLikedPostIds.has(post.id),
  }))

  const isOwnProfile = user?.id === params.id
  const initial = (profile.display_name || profile.username).charAt(0).toUpperCase()

  return (
    <div className="flex flex-col gap-6">
      <Card className="shadow-sm">
        <CardHeader className="flex-row items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
              {initial}
            </div>
            <div>
              <CardTitle className="text-2xl tracking-tight">
                {profile.display_name || profile.username}
              </CardTitle>
              {profile.display_name && (
                <p className="text-sm text-muted-foreground">
                  @{profile.username}
                </p>
              )}
            </div>
          </div>
          {isOwnProfile && (
            <Link href="/profile/edit">
              <Button variant="outline" size="sm" className="cursor-pointer">
                Edit Profile
              </Button>
            </Link>
          )}
        </CardHeader>
        <CardContent>
          <p className="leading-relaxed text-muted-foreground">
            {profile.bio || "No bio yet."}
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Joined {new Date(profile.created_at).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-bold tracking-tight">Posts</h2>
        <p className="text-sm text-muted-foreground">
          {postsWithLikes.length} {postsWithLikes.length === 1 ? "post" : "posts"}
        </p>
      </div>
      <PostFeed posts={postsWithLikes} currentUserId={user?.id} />
    </div>
  )
}
