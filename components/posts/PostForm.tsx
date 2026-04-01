"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

const MAX_CHARS = 500

export function PostForm() {
  const [content, setContent] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: content.trim() }),
    })

    const json = await res.json()

    if (!res.ok) {
      setError(json.error || "Failed to create post")
      setLoading(false)
      return
    }

    setContent("")
    setLoading(false)
    router.refresh()
  }

  return (
    <Card>
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={MAX_CHARS}
            rows={3}
            required
          />
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {content.length}/{MAX_CHARS}
            </span>
            <Button
              type="submit"
              disabled={loading || content.trim().length === 0}
            >
              {loading ? "Posting..." : "Post"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
