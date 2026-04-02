"use client"

import { useState } from "react"
import Link from "next/link"
import type { Comment } from "@/lib/types"
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

type CommentSectionProps = {
  postId: string
  currentUserId?: string
}

export function CommentSection({ postId, currentUserId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [content, setContent] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetchComments() {
    setLoading(true)
    setError(null)
    const res = await fetch(`/api/posts/${postId}/comments`)
    const json = await res.json()
    if (json.error) {
      setError(json.error)
    } else {
      setComments(json.data ?? [])
    }
    setLoading(false)
    setLoaded(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim() || submitting) return
    setSubmitting(true)
    setError(null)

    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: content.trim() }),
    })
    const json = await res.json()

    if (json.error) {
      setError(json.error)
    } else {
      setContent("")
      await fetchComments()
    }
    setSubmitting(false)
  }

  async function handleDelete(commentId: string) {
    const res = await fetch(`/api/comments/${commentId}`, { method: "DELETE" })
    if (res.ok) {
      setComments((prev) => prev.filter((c) => c.id !== commentId))
    }
  }

  if (!loaded) {
    return (
      <button
        onClick={fetchComments}
        disabled={loading}
        className="cursor-pointer text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        {loading ? "Loading..." : "Show comments"}
      </button>
    )
  }

  return (
    <div className="mt-2 space-y-3 border-t pt-3">
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {comments.length === 0 && (
        <p className="text-sm text-muted-foreground">No comments yet.</p>
      )}

      {comments.map((comment) => (
        <div key={comment.id} className="flex items-start gap-2 text-sm">
          <div className="flex-1">
            <span className="font-medium">
              <Link
                href={`/profile/${comment.user_id}`}
                className="transition-colors hover:text-primary"
              >
                {comment.profiles.display_name || comment.profiles.username}
              </Link>
            </span>
            <span className="ml-2 text-muted-foreground">
              {timeAgo(comment.created_at)}
            </span>
            <p className="mt-0.5 whitespace-pre-wrap">{comment.content}</p>
          </div>
          {currentUserId === comment.user_id && (
            <button
              onClick={() => handleDelete(comment.id)}
              className="cursor-pointer text-xs text-muted-foreground transition-colors hover:text-destructive"
            >
              Delete
            </button>
          )}
        </div>
      ))}

      {currentUserId && (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a comment..."
            maxLength={300}
            className="flex-1 rounded-md border bg-background px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-primary"
          />
          <Button
            type="submit"
            size="sm"
            disabled={submitting || !content.trim()}
            className="cursor-pointer"
          >
            {submitting ? "..." : "Post"}
          </Button>
        </form>
      )}
    </div>
  )
}
