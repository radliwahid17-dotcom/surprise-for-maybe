import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { moods, notes, surprises, sunshine } from "../src/data";

const errors = new WeakMap<Page, string[]>();
test.beforeEach(({ page }) => {
  errors.set(page, []);
  page.on("pageerror", (error) => errors.get(page)?.push(error.message));
});
test.afterEach(({ page }) => {
  expect(errors.get(page)).toEqual([]);
});

async function visit(page: Page) {
  await page.addInitScript(() =>
    localStorage.setItem("maybeverse:welcomed", "true"),
  );
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "A little happiness, just for Maybe." }),
  ).toBeVisible();
}
async function dismiss(page: Page) {
  await page.getByRole("button", { name: "Tutup popup" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
}

for (const [choice, answer] of [
  ["Radli yaaa? 😭", "YAAA BENERRR!!"],
  ["Siapa tuh? 🤨", "MASA GATAU SIHHH"],
]) {
  test(`welcome: ${choice}, only on first visit`, async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: choice }).click();
    await expect(page.getByRole("dialog")).toContainText(answer);
    await page.getByRole("button", { name: "Masuk ke duniaku" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await page.reload();
    await page.waitForTimeout(800);
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });
}

test("all six moods work, last mood survives reload", async ({ page }) => {
  await visit(page);
  for (const mood of moods) {
    await page.getByRole("button", { name: mood.label, exact: true }).click();
    await expect(page.getByRole("dialog")).toContainText(mood.title);
    await expect(page.getByRole("dialog")).toContainText(mood.text);
    await dismiss(page);
    await expect(
      page.getByRole("button", { name: mood.label, exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
  }
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Pokoknya aneh" }),
  ).toHaveAttribute("aria-pressed", "true");
});

test("all seven envelopes open and keyboard focus stays in dialog", async ({
  page,
}) => {
  await visit(page);
  for (const note of notes) {
    const card = page
      .locator(".letter-card")
      .filter({
        has: page.getByRole("heading", { name: note.label, exact: true }),
      });
    await card.click();
    await expect(page.getByRole("dialog")).toContainText(note.title);
    await expect(page.getByRole("dialog")).toContainText(
      note.text.slice(0, 30),
    );
    await expect(page.locator("#page")).toHaveJSProperty("inert", true);
    await expect(
      page.getByRole("button", { name: "Tutup popup" }),
    ).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(
      page.getByRole("button", { name: "Lipat dan simpan" }),
    ).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(
      page.getByRole("button", { name: "Tutup popup" }),
    ).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(card).toBeFocused();
  }
});

test("emergency button has 32 unique surprises and varies consecutive clicks", async ({
  page,
}) => {
  expect(surprises.length).toBeGreaterThanOrEqual(30);
  expect(new Set(surprises.map((item) => item.title)).size).toBe(
    surprises.length,
  );
  await visit(page);
  let previous = "";
  for (let i = 0; i < 6; i++) {
    await page.getByRole("button", { name: /PENCET KALO DUNIA/ }).click();
    const text = await page
      .getByRole("dialog")
      .getByRole("heading")
      .innerText();
    expect(text).not.toBe(previous);
    previous = text;
    await dismiss(page);
  }
});

test("60 unique daily notes, stable on refresh, change at local midnight", async ({
  page,
}) => {
  expect(sunshine.length).toBeGreaterThanOrEqual(60);
  expect(new Set(sunshine).size).toBe(sunshine.length);
  await page.clock.install({ time: new Date("2026-10-14T16:59:45Z") });
  await visit(page);
  await expect(page.locator(".date-chip")).toHaveText("14 Oktober");
  const initial = await page.locator(".daily-message").innerText();
  await page.reload();
  await expect(page.locator(".daily-message")).toHaveText(initial);
  await page.clock.fastForward(60000);
  await page.clock.runFor(600);
  await expect(page.locator(".date-chip")).toHaveText("15 Oktober");
  await expect(page.locator(".daily-message")).not.toHaveText(initial);
  const newDay = await page.locator(".daily-message").innerText();
  await page.getByRole("button", { name: "Give me another one!" }).click();
  await page.clock.runFor(600);
  await expect(page.locator(".daily-message")).not.toHaveText(newDay);
});

test("Catch the Love: touch, 30-second finish and replay", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.clock.install();
  await visit(page);
  await page.getByRole("button", { name: "Let’s catch some love" }).click();
  await page.getByRole("button", { name: "Mulai tangkap hati" }).click();
  const heart = await page
    .getByRole("button", { name: "Tangkap hati", exact: true })
    .first()
    .boundingBox();
  expect(heart).not.toBeNull();
  await page.touchscreen.tap(
    heart!.x + heart!.width / 2,
    heart!.y + heart!.height / 2,
  );
  await expect(page.locator(".game-score")).toContainText("1 hati");
  await page.clock.fastForward(30000);
  await expect(page.getByRole("dialog")).toContainText(
    "You just collected 999 hugs from Radli!",
  );
  await expect(page.getByRole("dialog")).toContainText("1 hati tertangkap");
  await page.getByRole("button", { name: "Main lagi" }).click();
  await expect(page.locator(".game-score")).toContainText("0 hati");
  await expect(page.locator(".game-score")).toContainText("30s tersisa");
  await page.getByRole("button", { name: "Tutup popup" }).click();
  await page.clock.runFor(600);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.clock.fastForward(30000);
});

test("bubble game completes and resets", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await visit(page);
  await page.getByRole("button", { name: "Time to pop!" }).click();
  for (let index = 0; index < 12; index++)
    await page.locator(".bubble:not(.popped)").first().click();
  await expect(page.getByRole("dialog")).toContainText("GOOD JOB MAY!");
  await expect(page.locator(".game-score")).toContainText("12 / 12");
  await page.getByRole("button", { name: "Pop lagi?" }).click();
  await expect(page.locator(".bubble:not(.popped)")).toHaveCount(12);
  await expect(page.locator(".game-score")).toContainText("0 / 12");
});

test("Find Mochi: all four locations, completion and persistence", async ({
  page,
}) => {
  await visit(page);
  await page.getByRole("button", { name: "Where are you, Mochi?" }).click();
  await expect(page.getByRole("dialog")).toContainText("Ada 4 Mochi");
  await dismiss(page);
  for (let index = 1; index <= 4; index++) {
    await page
      .getByRole("button", { name: `Mochi tersembunyi ${index}`, exact: true })
      .click();
    await expect(page.getByRole("dialog")).toContainText(`${index} dari 4`);
    await dismiss(page);
  }
  await expect(page.locator(".hunt-progress")).toContainText("Misi selesai!");
  await page.reload();
  for (let index = 1; index <= 4; index++)
    await expect(
      page.getByRole("button", {
        name: `Mochi ${index} sudah ditemukan`,
        exact: true,
      }),
    ).toBeDisabled();
  await page.getByRole("button", { name: "Lihat petualanganmu" }).click();
  await expect(page.getByRole("dialog")).toContainText(
    "Semua 4 Mochi sudah ditemukan!",
  );
});

test("five secret interactions, discoveries persisted, final letter and hug", async ({
  page,
}) => {
  await visit(page);
  for (let index = 0; index < 5; index++)
    await page.getByRole("button", { name: "Sapa Mochi" }).click();
  await expect(page.getByRole("dialog")).toContainText("IT’S A BIRD!");
  await dismiss(page);
  for (let index = 0; index < 10; index++)
    await page.getByRole("button", { name: "Kirim hati untuk Radli" }).click();
  await expect(page.getByRole("dialog")).toContainText(
    "OKE OKE I LOVE YOU TOO",
  );
  await dismiss(page);
  await page.getByRole("button", { name: "Bintang istimewa" }).click();
  await expect(page.getByRole("dialog")).toContainText(
    "Satu bintang, satu harapan.",
  );
  await dismiss(page);
  await page.getByRole("button", { name: "JANGAN DIPENCET" }).click();
  await expect(page.getByRole("dialog")).toContainText("KETAHUAN");
  await dismiss(page);
  await page.getByLabel("Psst… punya kode rahasia?").fill("salah");
  await page.getByRole("button", { name: "Buka kode rahasia" }).click();
  await expect(page.locator("#secret-hint")).toContainText("coba nama");
  await page.getByLabel("Psst… punya kode rahasia?").fill(" radli ");
  await page.getByRole("button", { name: "Buka kode rahasia" }).click();
  await expect(page.getByRole("dialog")).toContainText("Just between us, May.");
  const discoveries = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("maybeverse:discoveries")!),
  );
  expect(discoveries).toEqual(
    expect.arrayContaining([
      "super-mochi",
      "ten-hearts",
      "meteor",
      "forbidden-button",
      "secret-letter",
    ]),
  );
  await page.getByRole("button", { name: "Masih ada satu surat lagi" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "One Last Thing, May…" }),
  ).toBeVisible();
  await expect(page.locator(".final-letter")).toContainText(
    "And I'm proud of you.",
  );
  await page.getByRole("button", { name: "Send a virtual hug" }).click();
  await expect(page.locator(".hug-response")).toContainText("Peluk diterima.");
  await expect(page.locator(".final-hug")).toHaveClass(/hugging/);
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
  await expect(
    page.getByRole("button", { name: "Sapa Mochi" }).getByRole("img"),
  ).toHaveAttribute("aria-label", "Super Pink Mochi, kelinci pahlawan kecil");
});

test("sound is opt-in, toggles and persists", async ({ page }) => {
  await visit(page);
  await expect(
    page.getByRole("button", { name: "Aktifkan suara" }),
  ).toHaveAttribute("aria-pressed", "false");
  await page.getByRole("button", { name: "Aktifkan suara" }).click();
  await expect(
    page.getByRole("button", { name: "Matikan suara" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Matikan suara" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Matikan suara" }).click();
  await expect(
    page.getByRole("button", { name: "Aktifkan suara" }),
  ).toHaveAttribute("aria-pressed", "false");
});

for (const width of [320, 390, 768, 1440]) {
  test(`layout: ${width}px, no overflow or clipped content`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: width <= 390 ? 844 : 1000 });
    await visit(page);
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    const outOfBounds = await page
      .locator(
        "h1, h2, h3, .mood-card, .letter-card, .game-card, .primary-button, .emergency-button",
      )
      .evaluateAll((elements) =>
        elements
          .filter((element) => {
            const box = element.getBoundingClientRect();
            return (
              box.width > 0 &&
              (box.left < -1 ||
                box.right > innerWidth + 1 ||
                element.scrollWidth > element.clientWidth + 1)
            );
          })
          .map((element) => element.textContent),
      );
    expect(outOfBounds).toEqual([]);
    await page.screenshot({
      path: testInfo.outputPath(`maybeverse-${width}.png`),
      fullPage: true,
    });
    await page.getByRole("button", { name: "Just between us" }).click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await expect(
      page.getByRole("heading", { name: "One Last Thing, May…" }),
    ).toBeVisible();
  });
}

test("works when storage is unavailable", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new DOMException("Storage blocked");
      },
    });
  });
  await page.goto("/");
  await expect(page.getByRole("dialog")).toBeVisible();
  await dismiss(page);
  await page.getByRole("button", { name: "Lagi sedih", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("Sending virtual hugs");
});

test("PWA assets, offline reload and offline interactions", async ({
  page,
  context,
}) => {
  await visit(page);
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  for (const path of [
    "/manifest.webmanifest",
    "/icons/icon-192.png",
    "/icons/icon-512.png",
  ]) {
    const response = await page.request.get(path);
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
  await dismiss(page);
  await page.getByRole("button", { name: "Just between us" }).click();
  await expect(
    page.getByRole("heading", { name: "One Last Thing, May…" }),
  ).toBeVisible();
  await context.setOffline(false);
});

for (const state of ["home", "letter", "night", "bubble", "message"]) {
  test(`accessibility: ${state}`, async ({ page }) => {
    await visit(page);
    if (state === "letter") await page.locator(".letter-card").first().click();
    if (state === "night")
      await page.getByRole("button", { name: "Just between us" }).click();
    if (state === "bubble")
      await page.getByRole("button", { name: "Time to pop!" }).click();
    if (state === "message")
      await page
        .getByRole("button", { name: "Lagi sedih", exact: true })
        .click();
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      result.violations.map((violation) => ({
        id: violation.id,
        nodes: violation.nodes.map((node) => ({
          target: node.target,
          summary: node.failureSummary,
        })),
      })),
    ).toEqual([]);
  });
}

test("normal animation: moving hearts respond to touch and modal closes", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 390, height: 844 });
  await visit(page);
  await page.getByRole("button", { name: "Let’s catch some love" }).click();
  await page.getByRole("button", { name: "Mulai tangkap hati" }).click();
  await page.waitForTimeout(750);
  const first = await page
    .getByRole("button", { name: "Tangkap hati", exact: true })
    .first()
    .boundingBox();
  await page.waitForTimeout(200);
  const later = await page
    .getByRole("button", { name: "Tangkap hati", exact: true })
    .first()
    .boundingBox();
  expect(later!.y).toBeGreaterThan(first!.y);
  await page.touchscreen.tap(
    later!.x + later!.width / 2,
    later!.y + later!.height / 2 + 3,
  );
  await expect(page.locator(".game-score")).toContainText("1 hati");
  await dismiss(page);
  await page
    .getByRole("button", { name: "Give me another one!" })
    .scrollIntoViewIfNeeded();
  const message = await page.locator(".daily-message").innerText();
  await page.getByRole("button", { name: "Give me another one!" }).click();
  await expect(page.locator(".daily-message")).not.toHaveText(message);
});

test("audio API unavailable: sound control and surprises still work", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "AudioContext", { value: undefined });
    Object.defineProperty(window, "webkitAudioContext", { value: undefined });
  });
  await visit(page);
  await page.getByRole("button", { name: "Aktifkan suara" }).click();
  await page.getByRole("button", { name: /PENCET KALO DUNIA/ }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
});
