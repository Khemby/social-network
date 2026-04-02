"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import type { Post } from "@/lib/types"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CommentSection } from "./CommentSection"

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
  const [liked, setLiked] = useState(post.user_has_liked ?? false)
  const [likeCount, setLikeCount] = useState(post.likes?.[0]?.count ?? 0)
  const [liking, setLiking] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const router = useRouter()
  const isOwner = currentUserId === post.user_id
  const initial = (post.profiles.display_name || post.profiles.username).charAt(0).toUpperCase()

  async function handleDelete() {
    setDeleting(true)
    const res = await fetch(`/api/posts/${post.id}`, { method: "DELETE" })
    if (res.ok) {
      router.refresh()
    }
    setDeleting(false)
  }

  async function handleLike() {
    if (!currentUserId || liking) return
    setLiking(true)

    const prevLiked = liked
    const prevCount = likeCount
    setLiked(!liked)
    setLikeCount(liked ? likeCount - 1 : likeCount + 1)

    const res = await fetch(`/api/posts/${post.id}/like`, { method: "POST" })

    if (!res.ok) {
      setLiked(prevLiked)
      setLikeCount(prevCount)
    }

    setLiking(false)
  }

  return (
    <Card className="shadow-sm transition-shadow duration-200 hover:shadow-md">
      <CardHeader className="flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Link href={`/profile/${post.user_id}`} className="cursor-pointer">
            {post.profiles.avatar_url ? (
              <Image
                src={post.profiles.avatar_url}
                alt={`${post.profiles.display_name || post.profiles.username}'s avatar`}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {initial}
              </div>
            )}
          </Link>
          <div className="flex flex-col">
            <Link
              href={`/profile/${post.user_id}`}
              className="cursor-pointer text-sm font-semibold transition-colors hover:text-primary"
            >
              {post.profiles.display_name || post.profiles.username}
            </Link>
            <span className="text-xs text-muted-foreground">
              {timeAgo(post.created_at)}
            </span>
          </div>
        </div>
        {isOwner && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={deleting}
            className="cursor-pointer text-xs text-muted-foreground transition-colors hover:text-destructive"
          >
            {deleting ? "..." : "Delete"}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap leading-relaxed">{post.content}</p>
        <div className="mt-3 flex items-center gap-1">
          <button
            onClick={handleLike}
            disabled={!currentUserId || liking}
            className={`cursor-pointer rounded-full px-3 py-1 text-sm transition-all duration-200 ${
              liked
                ? "bg-red-50 text-red-500 hover:bg-red-100"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            } disabled:cursor-default disabled:opacity-50`}
          >
            {liked ? "♥" : "♡"}
            {likeCount > 0 && <span className="ml-1">{likeCount}</span>}
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="cursor-pointer rounded-full px-3 py-1 text-sm text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground"
          >
            💬{post.comments?.[0]?.count ? ` ${post.comments[0].count}` : ""}
          </button>
        </div>
        {showComments && (
          <CommentSection postId={post.id} currentUserId={currentUserId} />
        )}
      </CardContent>
    </Card>
  )
}
