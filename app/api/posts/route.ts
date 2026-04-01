import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"
import { z } from "zod/v4"
import type { ApiResponse, Post } from "@/lib/types"

const createPostSchema = z.object({
  content: z
    .string()
    .min(1, "Post cannot be empty")
    .max(500, "Post cannot exceed 500 characters"),
})

export async function GET() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("posts")
    .select("*, profiles(*)")
    .order("created_at", { ascending: false })
    .limit(50)

  if (error) {
    return NextResponse.json(
      { data: null, error: error.message } satisfies ApiResponse<null>,
      { status: 500 }
    )
  }

  return NextResponse.json(
    { data, error: null } satisfies ApiResponse<typeof data>
  )
}

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

  const body = await request.json()
  const parsed = createPostSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      {
        data: null,
        error: parsed.error.issues[0].message,
      } satisfies ApiResponse<null>,
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from("posts")
    .insert({ content: parsed.data.content, user_id: user.id })
    .select("*, profiles(*)")
    .single()

  if (error) {
    return NextResponse.json(
      { data: null, error: error.message } satisfies ApiResponse<null>,
      { status: 500 }
    )
  }

  return NextResponse.json(
    { data, error: null } satisfies ApiResponse<Post>,
    { status: 201 }
  )
}
