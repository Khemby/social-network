import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"
import type { ApiResponse } from "@/lib/types"

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]

export async function POST(request: Request) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { data: null, error: "Unauthorized" } satisfies ApiResponse<null>,
      { status: 401 }
    )
  }

  const formData = await request.formData()
  const file = formData.get("avatar") as File | null

  if (!file) {
    return NextResponse.json(
      { data: null, error: "No file provided" } satisfies ApiResponse<null>,
      { status: 400 }
    )
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { data: null, error: "File must be JPEG, PNG, WebP, or GIF" } satisfies ApiResponse<null>,
      { status: 400 }
    )
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { data: null, error: "File must be under 2MB" } satisfies ApiResponse<null>,
      { status: 400 }
    )
  }

  const ext = file.name.split(".").pop() || "jpg"
  const filePath = `${user.id}/avatar.${ext}`

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, { upsert: true })

  if (uploadError) {
    return NextResponse.json(
      { data: null, error: uploadError.message } satisfies ApiResponse<null>,
      { status: 500 }
    )
  }

  const { data: { publicUrl } } = supabase.storage
    .from("avatars")
    .getPublicUrl(filePath)

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
    .eq("id", user.id)

  if (updateError) {
    return NextResponse.json(
      { data: null, error: updateError.message } satisfies ApiResponse<null>,
      { status: 500 }
    )
  }

  return NextResponse.json(
    { data: { avatar_url: publicUrl }, error: null } satisfies ApiResponse<{ avatar_url: string }>
  )
}
