import { defineConfig } from "@playwright/test";
import { existsSync } from "node:fs";

const executablePath =
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ||
  (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined);

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  timeout: 120000,
  reporter: [["list"]],
  use: {
    baseURL: "http://127.0.0.1:4173",
    viewport: { width: 1440, height: 1000 },
    timezoneId: "Asia/Jakarta",
    reducedMotion: "reduce",
    hasTouch: true,
    launchOptions: { executablePath, args: ["--no-sandbox"] },
    trace: process.env.PLAYWRIGHT_TRACE === "1" ? "retain-on-failure" : "off",
    screenshot: "only-on-failure",
  },
  webServer: [
    {
      command: "npm run preview -- --port 4173 --strictPort",
      url: "http://127.0.0.1:4173",
      reuseExistingServer: !process.env.CI,
    },
    {
      command:
        "npm run preview -- --base=/surprise-for-maybe/ --outDir dist-pages --port 4183 --strictPort",
      url: "http://127.0.0.1:4183/surprise-for-maybe/",
      reuseExistingServer: !process.env.CI,
    },
  ],
});
