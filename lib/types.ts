export type Profile = {
  id: string
  username: string
  display_name: string | null
  bio: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export type Post = {
  id: string
  user_id: string
  content: string
  created_at: string
  profiles: Profile
}

export type Like = {
  id: string
  user_id: string
  post_id: string
  created_at: string
}

export type ApiResponse<T> = {
  data: T | null
  error: string | null
}
