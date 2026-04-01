"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

type AvatarUploadProps = {
  currentAvatarUrl: string | null
  displayName: string
}

export function AvatarUpload({ currentAvatarUrl, displayName }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const initial = displayName.charAt(0).toUpperCase()

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setPreviewUrl(URL.createObjectURL(file))
    setUploading(true)

    const formData = new FormData()
    formData.append("avatar", file)

    const res = await fetch("/api/profile/avatar", {
      method: "POST",
      body: formData,
    })

    const json = await res.json()

    if (!res.ok) {
      setError(json.error || "Upload failed")
      setPreviewUrl(currentAvatarUrl)
      setUploading(false)
      return
    }

    setPreviewUrl(json.data.avatar_url)
    setUploading(false)
    router.refresh()
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="group relative cursor-pointer overflow-hidden rounded-full"
        disabled={uploading}
      >
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt={`${displayName}'s avatar`}
            width={80}
            height={80}
            className="h-20 w-20 rounded-full object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
            {initial}
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <span className="text-xs font-medium text-white">
            {uploading ? "..." : "Edit"}
          </span>
        </div>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      <p className="text-xs text-muted-foreground">
        JPEG, PNG, WebP, or GIF. Max 2MB.
      </p>
    </div>
  )
}
