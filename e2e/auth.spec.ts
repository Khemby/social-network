import { test, expect } from "@playwright/test"

test.describe("Authentication", () => {
  test("login page loads and shows form", async ({ page }) => {
    await page.goto("/login")
    await expect(page.getByText("Welcome back")).toBeVisible()
    await expect(page.locator("#email")).toBeVisible()
    await expect(page.locator("#password")).toBeVisible()
    await expect(page.getByRole("button", { name: /log in/i })).toBeVisible()
  })

  test("signup page loads and shows form", async ({ page }) => {
    await page.goto("/signup")
    await expect(page.getByText("Create an account")).toBeVisible()
    await expect(page.locator("#username")).toBeVisible()
    await expect(page.locator("#email")).toBeVisible()
    await expect(page.locator("#password")).toBeVisible()
    await expect(page.locator("#confirmPassword")).toBeVisible()
    await expect(page.getByRole("button", { name: /sign up/i })).toBeVisible()
  })

  test("login page has link to signup", async ({ page }) => {
    await page.goto("/login")
    const signupLink = page.getByRole("link", { name: /sign up/i })
    await expect(signupLink).toBeVisible()
    await signupLink.click()
    await expect(page).toHaveURL(/\/signup/)
  })

  test("signup page has link to login", async ({ page }) => {
    await page.goto("/signup")
    const loginLink = page.getByRole("link", { name: /log in/i })
    await expect(loginLink).toBeVisible()
    await loginLink.click()
    await expect(page).toHaveURL(/\/login/)
  })

  test("signup form accepts input", async ({ page }) => {
    await page.goto("/signup")
    await page.waitForFunction(() => document.querySelector("#username") !== null)
    const usernameInput = page.locator("#username")
    await usernameInput.click()
    await usernameInput.fill("testuser")
    await expect(usernameInput).toHaveValue("testuser")
    const emailInput = page.locator("#email")
    await emailInput.click()
    await emailInput.fill("test@example.com")
    await expect(emailInput).toHaveValue("test@example.com")
  })

  test("protected routes redirect to login when not authenticated", async ({ page }) => {
    await page.goto("/feed")
    await expect(page).toHaveURL(/\/login/)
  })

  test("profile page redirects to login when not authenticated", async ({ page }) => {
    await page.goto("/profile/edit")
    await expect(page).toHaveURL(/\/login/)
  })
})
