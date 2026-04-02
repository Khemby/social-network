import { describe, it, expect } from "vitest"
import { z } from "zod/v4"

const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(300, "Comment cannot exceed 300 characters"),
})

describe("Comment validation", () => {
  it("accepts valid comment content", () => {
    const result = createCommentSchema.safeParse({ content: "Nice post!" })
    expect(result.success).toBe(true)
  })

  it("rejects empty content", () => {
    const result = createCommentSchema.safeParse({ content: "" })
    expect(result.success).toBe(false)
  })

  it("rejects content over 300 characters", () => {
    const result = createCommentSchema.safeParse({ content: "a".repeat(301) })
    expect(result.success).toBe(false)
  })

  it("accepts exactly 300 characters", () => {
    const result = createCommentSchema.safeParse({ content: "a".repeat(300) })
    expect(result.success).toBe(true)
  })

  it("rejects missing content field", () => {
    const result = createCommentSchema.safeParse({})
    expect(result.success).toBe(false)
  })

  it("rejects non-string content", () => {
    const result = createCommentSchema.safeParse({ content: 42 })
    expect(result.success).toBe(false)
  })
})
