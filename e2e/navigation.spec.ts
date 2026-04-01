import { test, expect } from "@playwright/test"

test.describe("Navigation", () => {
  test("root redirects to login or feed", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveURL(/\/(login|feed)/)
  })

  test("auth layout renders correctly", async ({ page }) => {
    await page.goto("/login")
    await expect(page.locator("body")).toBeVisible()
    await expect(page.getByRole("heading")).toBeVisible()
  })

  test("login and signup pages are accessible", async ({ page }) => {
    await page.goto("/login")
    await expect(page).toHaveURL(/\/login/)

    await page.goto("/signup")
    await expect(page).toHaveURL(/\/signup/)
  })
})
