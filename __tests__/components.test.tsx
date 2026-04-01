import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { PostFeed } from "@/components/posts/PostFeed"
import type { Post } from "@/lib/types"

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
  }),
}))

const mockProfile = {
  id: "user-1",
  username: "testuser@example.com",
  display_name: "Test User",
  bio: "A test bio",
  avatar_url: null,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
}

const mockPosts: Post[] = [
  {
    id: "post-1",
    user_id: "user-1",
    content: "Hello world!",
    created_at: new Date().toISOString(),
    profiles: mockProfile,
    likes: [{ count: 3 }],
    user_has_liked: true,
  },
  {
    id: "post-2",
    user_id: "user-2",
    content: "Another post here",
    created_at: new Date(Date.now() - 3600000).toISOString(),
    profiles: {
      ...mockProfile,
      id: "user-2",
      username: "other@example.com",
      display_name: "Other User",
    },
    likes: [{ count: 0 }],
    user_has_liked: false,
  },
]

describe("PostFeed", () => {
  it("renders empty state when no posts", () => {
    render(<PostFeed posts={[]} />)
    expect(
      screen.getByText("No posts yet. Be the first to share something!")
    ).toBeDefined()
  })

  it("renders posts when provided", () => {
    render(<PostFeed posts={mockPosts} currentUserId="user-1" />)
    expect(screen.getByText("Hello world!")).toBeDefined()
    expect(screen.getByText("Another post here")).toBeDefined()
  })

  it("shows author display names", () => {
    render(<PostFeed posts={mockPosts} currentUserId="user-1" />)
    expect(screen.getByText("Test User")).toBeDefined()
    expect(screen.getByText("Other User")).toBeDefined()
  })

  it("shows delete button only for own posts", () => {
    render(<PostFeed posts={mockPosts} currentUserId="user-1" />)
    const deleteButtons = screen.getAllByText("Delete")
    expect(deleteButtons).toHaveLength(1)
  })

  it("shows no delete buttons when not logged in", () => {
    render(<PostFeed posts={mockPosts} />)
    expect(screen.queryByText("Delete")).toBeNull()
  })
})
