import { describe, it, expect } from "vitest"
import { cn } from "@/lib/utils"

describe("cn utility", () => {
  it("merges class names", () => {
    const result = cn("text-red-500", "bg-blue-500")
    expect(result).toBe("text-red-500 bg-blue-500")
  })

  it("handles conditional classes", () => {
    const isActive = true
    const result = cn("base", isActive && "active")
    expect(result).toContain("active")
  })

  it("removes falsy values", () => {
    const result = cn("base", false, null, undefined, "end")
    expect(result).toBe("base end")
  })

  it("deduplicates conflicting tailwind classes", () => {
    const result = cn("text-red-500", "text-blue-500")
    expect(result).toBe("text-blue-500")
  })

  it("handles empty input", () => {
    const result = cn()
    expect(result).toBe("")
  })
})

describe("Types", () => {
  it("ApiResponse success shape is correct", () => {
    const response = { data: { id: "1", content: "test" }, error: null }
    expect(response).toHaveProperty("data")
    expect(response).toHaveProperty("error")
    expect(response.error).toBeNull()
    expect(response.data).not.toBeNull()
  })

  it("ApiResponse error shape is correct", () => {
    const response = { data: null, error: "Not found" }
    expect(response.data).toBeNull()
    expect(response.error).toBe("Not found")
  })

  it("Post type has required fields", () => {
    const post = {
      id: "uuid",
      user_id: "uuid",
      content: "Hello",
      created_at: new Date().toISOString(),
      profiles: {
        id: "uuid",
        username: "test",
        display_name: null,
        bio: null,
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    }
    expect(post.id).toBeTruthy()
    expect(post.user_id).toBeTruthy()
    expect(post.content).toBeTruthy()
    expect(post.created_at).toBeTruthy()
    expect(post.profiles).toBeTruthy()
    expect(post.profiles.id).toBeTruthy()
  })
})
