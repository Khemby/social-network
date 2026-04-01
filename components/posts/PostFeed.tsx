"use client"

import type { Post } from "@/lib/types"
import { PostCard } from "./PostCard"

type PostFeedProps = {
  posts: Post[]
  currentUserId?: string
}

export function PostFeed({ posts, currentUserId }: PostFeedProps) {
  if (posts.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">
          No posts yet. Be the first to share something!
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} currentUserId={currentUserId} />
      ))}
    </div>
  )
}
