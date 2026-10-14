import { test, expect } from "@playwright/test";

const website = "http://127.0.0.1:4183/surprise-for-maybe/";

test("GitHub Pages: assets, mood, letter and final page work under the project path", async ({
  page,
}) => {
  const errors: string[] = [];
  const failedRequests: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400) failedRequests.push(response.url());
  });
  await page.addInitScript(() =>
    localStorage.setItem("maybeverse:welcomed", "true"),
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(website);
  await expect(
    page.getByRole("heading", { name: "A little happiness, just for Maybe." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Stres kuliah", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText(
    "Satu tugas dulu, satu langkah dulu.",
  );
  await page.keyboard.press("Escape");
  await page.locator(".letter-card").first().click();
  await expect(page.getByRole("dialog")).toContainText(
    "You can rest here, May.",
  );
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Just between us" }).click();
  await expect(
    page.getByRole("heading", { name: "One Last Thing, May…" }),
  ).toBeVisible();
  expect(page.url()).toBe(website + "#one-last-thing");
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "One Last Thing, May…" }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Back to your little universe" })
    .click();
  await expect(
    page.getByRole("heading", { name: "A little happiness, just for Maybe." }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
  expect(failedRequests).toEqual([]);
});

test("GitHub Pages: service-worker scope and offline reload stay under the project path", async ({
  page,
  context,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("maybeverse:welcomed", "true"),
  );
  await page.goto(website);
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  const scope = await page.evaluate(
    async () => (await navigator.serviceWorker.getRegistration())?.scope,
  );
  expect(scope).toBe(website);
  const manifestResponse = await page.request.get(
    website + "manifest.webmanifest",
  );
  expect(manifestResponse.ok()).toBe(true);
  const manifest = await manifestResponse.json();
  expect(new URL(manifest.start_url, manifestResponse.url()).href).toBe(
    website,
  );
  expect(new URL(manifest.scope, manifestResponse.url()).href).toBe(website);
  for (const icon of manifest.icons) {
    const response = await page.request.get(
      new URL(icon.src, manifestResponse.url()).href,
    );
    expect(response.ok()).toBe(true);
  }
  await context.setOffline(true);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "A little happiness, just for Maybe." }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Happy banget!", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText(
    "ALARM! MAYBE IS HAPPY!!",
  );
  await context.setOffline(false);
});
