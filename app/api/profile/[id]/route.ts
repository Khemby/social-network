import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"
import type { ApiResponse, Profile, Post } from "@/lib/types"

type ProfileWithPosts = {
  profile: Profile
  posts: Post[]
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", params.id)
    .single()

  if (profileError || !profile) {
    return NextResponse.json(
      { data: null, error: "Profile not found" } satisfies ApiResponse<null>,
      { status: 404 }
    )
  }

  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select("*, profiles(*)")
    .eq("user_id", params.id)
    .order("created_at", { ascending: false })

  if (postsError) {
    return NextResponse.json(
      { data: null, error: postsError.message } satisfies ApiResponse<null>,
      { status: 500 }
    )
  }

  return NextResponse.json(
    {
      data: { profile, posts: posts as Post[] },
      error: null,
    } satisfies ApiResponse<ProfileWithPosts>
  )
}
