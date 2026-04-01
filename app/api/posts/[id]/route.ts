import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"
import type { ApiResponse } from "@/lib/types"

export async function DELETE(
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

  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", params.id)
    .eq("user_id", user.id)

  if (error) {
    return NextResponse.json(
      { data: null, error: error.message } satisfies ApiResponse<null>,
      { status: 500 }
    )
  }

  return NextResponse.json(
    { data: null, error: null } satisfies ApiResponse<null>
  )
}
