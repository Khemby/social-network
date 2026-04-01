import { defineConfig, devices } from "@playwright/test"
import path from "path"
import dotenv from "dotenv"

// Load test-specific env vars
dotenv.config({ path: path.resolve(__dirname, ".env.test.local") })

const authFile = path.join(__dirname, "playwright", ".auth", "user.json")
const testPort = 3100

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: `http://localhost:${testPort}`,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    // Auth setup — runs first, saves login cookies
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/,
    },
    // Unauthenticated tests — no login needed
    {
      name: "unauthenticated",
      use: { ...devices["Desktop Chrome"] },
      testMatch: /auth\.spec\.ts|navigation\.spec\.ts/,
    },
    // Authenticated tests — depend on setup, reuse saved cookies
    {
      name: "authenticated",
      use: {
        ...devices["Desktop Chrome"],
        storageState: authFile,
      },
      dependencies: ["setup"],
      testMatch: /feed\.spec\.ts|profile\.spec\.ts|likes\.spec\.ts/,
    },
  ],
  webServer: {
    command: `npx next dev -p ${testPort}`,
    url: `http://localhost:${testPort}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
