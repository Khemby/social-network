import { createClient } from "@/lib/supabase-server"
import { PostForm } from "@/components/posts/PostForm"
import { PostFeed } from "@/components/posts/PostFeed"
import type { Post } from "@/lib/types"

export default async function FeedPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: posts } = await supabase
    .from("posts")
    .select("*, profiles(*), likes(count), comments(count)")
    .order("created_at", { ascending: false })
    .limit(50)

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

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Feed</h1>
        <p className="text-sm text-muted-foreground">
          See what everyone is sharing
        </p>
      </div>
      <PostForm />
      <PostFeed posts={postsWithLikes} currentUserId={user?.id} />
    </div>
  )
}
