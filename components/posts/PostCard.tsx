"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { Post } from "@/lib/types"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

function timeAgo(dateString: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(dateString).getTime()) / 1000
  )
  if (seconds < 60) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

type PostCardProps = {
  post: Post
  currentUserId?: string
}

export function PostCard({ post, currentUserId }: PostCardProps) {
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()
  const isOwner = currentUserId === post.user_id

  async function handleDelete() {
    setDeleting(true)
    const res = await fetch(`/api/posts/${post.id}`, { method: "DELETE" })
    if (res.ok) {
      router.refresh()
    }
    setDeleting(false)
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Link
            href={`/profile/${post.user_id}`}
            className="font-medium hover:underline"
          >
            {post.profiles.display_name || post.profiles.username}
          </Link>
          <span className="text-sm text-muted-foreground">
            {timeAgo(post.created_at)}
          </span>
        </div>
        {isOwner && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={deleting}
            className="text-destructive hover:text-destructive"
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap">{post.content}</p>
      </CardContent>
    </Card>
  )
}
