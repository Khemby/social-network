import { test as setup, expect } from "@playwright/test"
import path from "path"

const authFile = path.join(__dirname, "..", "playwright", ".auth", "user.json")

setup("authenticate", async ({ page }) => {
  const email = process.env.E2E_TEST_EMAIL
  const password = process.env.E2E_TEST_PASSWORD

  if (!email || !password) {
    throw new Error(
      "E2E_TEST_EMAIL and E2E_TEST_PASSWORD must be set in .env.test.local"
    )
  }

  await page.goto("/login")
  await expect(page.getByText("Welcome back")).toBeVisible()

  await page.locator("#email").click()
  await page.locator("#email").fill(email)
  await page.locator("#password").click()
  await page.locator("#password").fill(password)
  await page.getByRole("button", { name: /log in/i }).click()

  // Wait for redirect to feed after successful login
  await expect(page).toHaveURL(/\/feed/, { timeout: 15_000 })
  await expect(page.getByRole("heading", { name: "Feed" })).toBeVisible()

  // Save signed-in state
  await page.context().storageState({ path: authFile })
})
