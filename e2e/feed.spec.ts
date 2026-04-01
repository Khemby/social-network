import { test, expect } from "@playwright/test"

test.describe("Feed (authenticated)", () => {
  test("feed page loads with navbar and post form", async ({ page }) => {
    await page.goto("/feed")
    await expect(page.getByRole("heading", { name: "Feed" })).toBeVisible()
    await expect(page.getByText("See what everyone is sharing")).toBeVisible()
    await expect(page.getByPlaceholder("What's on your mind?")).toBeVisible()
    await expect(page.getByRole("button", { name: "Post" })).toBeVisible()
  })

  test("navbar has feed, profile, and logout links", async ({ page }) => {
    await page.goto("/feed")
    await expect(page.getByRole("link", { name: "Social Network" })).toBeVisible()
    await expect(page.locator("nav").getByRole("link", { name: "Feed" })).toBeVisible()
    await expect(page.locator("nav").getByRole("link", { name: "Profile" })).toBeVisible()
    await expect(page.getByRole("button", { name: /log out/i })).toBeVisible()
  })

  test("can create a post", async ({ page }) => {
    await page.goto("/feed")

    const postContent = `E2E test post ${Date.now()}`
    const textarea = page.getByPlaceholder("What's on your mind?")
    await textarea.click()
    await textarea.fill(postContent)

    await page.getByRole("button", { name: "Post" }).click()

    // Wait for posting to complete — textarea clears when done
    await expect(textarea).toHaveValue("", { timeout: 15_000 })

    // Post should now appear in the feed (below the form)
    await expect(page.getByText(postContent)).toBeVisible()
  })

  test("can delete own post", async ({ page }) => {
    await page.goto("/feed")

    const postContent = `Delete me ${Date.now()}`
    const textarea = page.getByPlaceholder("What's on your mind?")
    await textarea.click()
    await textarea.fill(postContent)
    await page.getByRole("button", { name: "Post" }).click()
    await expect(textarea).toHaveValue("", { timeout: 15_000 })
    await expect(page.getByText(postContent)).toBeVisible()

    // Find the delete button on the post we just created
    const postCard = page.locator("[data-slot=card]").filter({ hasText: postContent })
    const deleteButton = postCard.getByRole("button", { name: /delete/i })
    await deleteButton.click()

    // Post should disappear
    await expect(page.getByText(postContent)).not.toBeVisible({ timeout: 10_000 })
  })

  test("post form shows character count", async ({ page }) => {
    await page.goto("/feed")
    await expect(page.getByText("0/500")).toBeVisible()

    const textarea = page.getByPlaceholder("What's on your mind?")
    await textarea.click()
    await textarea.fill("Hello")
    await expect(page.getByText("5/500")).toBeVisible()
  })

  test("post button is disabled when textarea is empty", async ({ page }) => {
    await page.goto("/feed")
    const postButton = page.getByRole("button", { name: "Post" })
    await expect(postButton).toBeDisabled()
  })
})
