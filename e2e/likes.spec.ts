import { test, expect } from "@playwright/test"

test.describe("Likes (authenticated)", () => {
  test("posts show like button", async ({ page }) => {
    await page.goto("/feed")

    // Create a post to ensure there's one to like
    const postContent = `Likeable post ${Date.now()}`
    const textarea = page.getByPlaceholder("What's on your mind?")
    await textarea.click()
    await textarea.fill(postContent)
    await page.getByRole("button", { name: "Post" }).click()

    // Wait for posting to complete
    await expect(textarea).toHaveValue("", { timeout: 15_000 })

    // The post card should have a like button (heart character)
    const postCard = page.locator("[data-slot=card]").filter({ hasText: postContent })
    await expect(postCard.locator("button").filter({ hasText: /[♡♥]/ })).toBeVisible()
  })

  test("can toggle like on a post", async ({ page }) => {
    await page.goto("/feed")

    const postContent = `Toggle like ${Date.now()}`
    const textarea = page.getByPlaceholder("What's on your mind?")
    await textarea.click()
    await textarea.fill(postContent)
    await page.getByRole("button", { name: "Post" }).click()
    await expect(textarea).toHaveValue("", { timeout: 15_000 })

    const postCard = page.locator("[data-slot=card]").filter({ hasText: postContent })
    const likeButton = postCard.locator("button").filter({ hasText: /[♡♥]/ })

    // Like the post
    await likeButton.click()
    await expect(postCard.locator("button").filter({ hasText: "♥" })).toBeVisible({ timeout: 5_000 })

    // Unlike the post
    await postCard.locator("button").filter({ hasText: "♥" }).click()
    await expect(postCard.locator("button").filter({ hasText: "♡" })).toBeVisible({ timeout: 5_000 })
  })
})
