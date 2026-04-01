import { createClient } from "@/lib/supabase-server"
import { PostForm } from "@/components/posts/PostForm"
import { PostFeed } from "@/components/posts/PostFeed"
import type { Post } from "@/lib/types"

export default async function FeedPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: posts } = await supabase
    .from("posts")
    .select("*, profiles(*)")
    .order("created_at", { ascending: false })
    .limit(50)

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Feed</h1>
      <PostForm />
      <PostFeed
        posts={(posts as Post[]) || []}
        currentUserId={user?.id}
      />
    </div>
  )
}
