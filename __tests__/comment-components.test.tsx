import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { CommentSection } from "@/components/posts/CommentSection"

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
  }),
}))

describe("CommentSection", () => {
  it("renders show comments button when not loaded", () => {
    render(<CommentSection postId="post-1" currentUserId="user-1" />)
    expect(screen.getByText("Show comments")).toBeDefined()
  })

  it("does not show comment form before expanding", () => {
    render(<CommentSection postId="post-1" currentUserId="user-1" />)
    expect(screen.queryByPlaceholderText("Write a comment...")).toBeNull()
  })

  it("renders show comments button when not logged in", () => {
    render(<CommentSection postId="post-1" />)
    expect(screen.getByText("Show comments")).toBeDefined()
  })

  it("does not render comment input when no currentUserId after load", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: [], error: null }),
    })

    render(<CommentSection postId="post-1" />)
    screen.getByText("Show comments").click()

    await vi.waitFor(() => {
      expect(screen.getByText("No comments yet.")).toBeDefined()
    })

    expect(screen.queryByPlaceholderText("Write a comment...")).toBeNull()
  })

  it("shows comment form after expanding when logged in", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: [], error: null }),
    })

    render(<CommentSection postId="post-1" currentUserId="user-1" />)
    screen.getByText("Show comments").click()

    await vi.waitFor(() => {
      expect(screen.getByPlaceholderText("Write a comment...")).toBeDefined()
    })
  })
})
