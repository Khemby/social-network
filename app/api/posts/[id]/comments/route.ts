import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"
import { z } from "zod/v4"
import type { ApiResponse, Comment } from "@/lib/types"

const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(300, "Comment cannot exceed 300 characters"),
})

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("comments")
    .select("*, profiles(*)")
    .eq("post_id", params.id)
    .order("created_at", { ascending: true })
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

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
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
  const parsed = createCommentSchema.safeParse(body)

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
    .from("comments")
    .insert({ content: parsed.data.content, user_id: user.id, post_id: params.id })
    .select("*, profiles(*)")
    .single()

  if (error) {
    return NextResponse.json(
      { data: null, error: error.message } satisfies ApiResponse<null>,
      { status: 500 }
    )
  }

  return NextResponse.json(
    { data, error: null } satisfies ApiResponse<Comment>,
    { status: 201 }
  )
}
