import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"
import { z } from "zod/v4"
import type { ApiResponse, Profile } from "@/lib/types"

const updateProfileSchema = z.object({
  display_name: z.string().max(100, "Display name too long").optional(),
  bio: z.string().max(500, "Bio too long").optional(),
})

export async function PUT(request: Request) {
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
  const parsed = updateProfileSchema.safeParse(body)

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
    .from("profiles")
    .update({
      ...parsed.data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json(
      { data: null, error: error.message } satisfies ApiResponse<null>,
      { status: 500 }
    )
  }

  return NextResponse.json(
    { data, error: null } satisfies ApiResponse<Profile>
  )
}
