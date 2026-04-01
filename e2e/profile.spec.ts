import { test, expect } from "@playwright/test"

test.describe("Profile (authenticated)", () => {
  test("can navigate to own profile from navbar", async ({ page }) => {
    await page.goto("/feed")
    await page.locator("nav").getByRole("link", { name: "Profile" }).click()
    await expect(page).toHaveURL(/\/profile\//, { timeout: 10_000 })
    await expect(page.getByRole("heading", { name: "Posts" })).toBeVisible()
  })

  test("profile page shows user info and posts section", async ({ page }) => {
    await page.goto("/feed")
    await page.locator("nav").getByRole("link", { name: "Profile" }).click()
    await expect(page).toHaveURL(/\/profile\//, { timeout: 10_000 })

    // Should show "Edit Profile" button on own profile
    await expect(page.getByRole("link", { name: /edit profile/i })).toBeVisible()

    // Should show "Joined" date
    await expect(page.getByText(/joined/i)).toBeVisible()

    // Should show post count
    await expect(page.getByText(/\d+ posts?/)).toBeVisible()
  })

  test("can navigate to edit profile page", async ({ page }) => {
    await page.goto("/feed")
    await page.locator("nav").getByRole("link", { name: "Profile" }).click()
    await expect(page).toHaveURL(/\/profile\//, { timeout: 10_000 })
    await page.getByRole("link", { name: /edit profile/i }).click()
    await expect(page).toHaveURL(/\/profile\/edit/)
    await expect(page.getByText("Edit Profile")).toBeVisible()
  })

  test("edit profile page loads with form fields", async ({ page }) => {
    await page.goto("/profile/edit")
    // Wait for profile data to load
    await expect(page.locator("#displayName")).toBeVisible({ timeout: 10_000 })
    await expect(page.locator("#bio")).toBeVisible()
    await expect(page.getByRole("button", { name: /save/i })).toBeVisible()
    await expect(page.getByRole("button", { name: /cancel/i })).toBeVisible()
  })

  test("edit profile shows character count for bio", async ({ page }) => {
    await page.goto("/profile/edit")
    await expect(page.locator("#bio")).toBeVisible({ timeout: 10_000 })
    // Should show current bio length / 500
    await expect(page.getByText(/\/500/)).toBeVisible()
  })

  test("edit profile shows avatar upload area", async ({ page }) => {
    await page.goto("/profile/edit")
    await expect(page.locator("#displayName")).toBeVisible({ timeout: 10_000 })
    // Avatar upload area should be present
    await expect(page.getByText(/jpeg|png|webp|gif/i)).toBeVisible()
  })
})
