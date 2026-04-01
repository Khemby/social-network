import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"
import type { ApiResponse } from "@/lib/types"

export async function POST(
  _request: Request,
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

  const { data: existingLike } = await supabase
    .from("likes")
    .select("id")
    .eq("user_id", user.id)
    .eq("post_id", params.id)
    .single()

  if (existingLike) {
    const { error } = await supabase
      .from("likes")
      .delete()
      .eq("id", existingLike.id)

    if (error) {
      return NextResponse.json(
        { data: null, error: error.message } satisfies ApiResponse<null>,
        { status: 500 }
      )
    }

    return NextResponse.json(
      { data: { liked: false }, error: null } satisfies ApiResponse<{ liked: boolean }>
    )
  }

  const { error } = await supabase
    .from("likes")
    .insert({ user_id: user.id, post_id: params.id })

  if (error) {
    return NextResponse.json(
      { data: null, error: error.message } satisfies ApiResponse<null>,
      { status: 500 }
    )
  }

  return NextResponse.json(
    { data: { liked: true }, error: null } satisfies ApiResponse<{ liked: boolean }>,
    { status: 201 }
  )
}
