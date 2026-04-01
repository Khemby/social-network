import { describe, it, expect } from "vitest"
import { z } from "zod/v4"

const createPostSchema = z.object({
  content: z
    .string()
    .min(1, "Post cannot be empty")
    .max(500, "Post cannot exceed 500 characters"),
})

const updateProfileSchema = z.object({
  display_name: z.string().max(100, "Display name too long").optional(),
  bio: z.string().max(500, "Bio too long").optional(),
})

describe("Post validation", () => {
  it("accepts valid post content", () => {
    const result = createPostSchema.safeParse({ content: "Hello world!" })
    expect(result.success).toBe(true)
  })

  it("rejects empty content", () => {
    const result = createPostSchema.safeParse({ content: "" })
    expect(result.success).toBe(false)
  })

  it("rejects content over 500 characters", () => {
    const result = createPostSchema.safeParse({ content: "a".repeat(501) })
    expect(result.success).toBe(false)
  })

  it("accepts exactly 500 characters", () => {
    const result = createPostSchema.safeParse({ content: "a".repeat(500) })
    expect(result.success).toBe(true)
  })

  it("rejects missing content field", () => {
    const result = createPostSchema.safeParse({})
    expect(result.success).toBe(false)
  })

  it("rejects non-string content", () => {
    const result = createPostSchema.safeParse({ content: 123 })
    expect(result.success).toBe(false)
  })
})

describe("Profile validation", () => {
  it("accepts valid profile update", () => {
    const result = updateProfileSchema.safeParse({
      display_name: "Jane Doe",
      bio: "Hello!",
    })
    expect(result.success).toBe(true)
  })

  it("accepts partial update (display_name only)", () => {
    const result = updateProfileSchema.safeParse({ display_name: "Jane" })
    expect(result.success).toBe(true)
  })

  it("accepts partial update (bio only)", () => {
    const result = updateProfileSchema.safeParse({ bio: "A short bio" })
    expect(result.success).toBe(true)
  })

  it("accepts empty object", () => {
    const result = updateProfileSchema.safeParse({})
    expect(result.success).toBe(true)
  })

  it("rejects display_name over 100 characters", () => {
    const result = updateProfileSchema.safeParse({
      display_name: "a".repeat(101),
    })
    expect(result.success).toBe(false)
  })

  it("rejects bio over 500 characters", () => {
    const result = updateProfileSchema.safeParse({ bio: "a".repeat(501) })
    expect(result.success).toBe(false)
  })
})

describe("ApiResponse envelope", () => {
  it("success response has data and null error", () => {
    const response = { data: { id: "123" }, error: null }
    expect(response.data).toBeTruthy()
    expect(response.error).toBeNull()
  })

  it("error response has null data and error message", () => {
    const response = { data: null, error: "Something went wrong" }
    expect(response.data).toBeNull()
    expect(response.error).toBeTruthy()
  })
})
