import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const runtimeErrors = new WeakMap<Page, string[]>();
test.beforeEach(({ page }) => {
  runtimeErrors.set(page, []);
  page.on("pageerror", (error) => runtimeErrors.get(page)?.push(error.message));
});
test.afterEach(({ page }) => {
  expect(runtimeErrors.get(page)).toEqual([]);
});

async function visit(page: Page, seed?: Record<string, unknown>) {
  await page.addInitScript((values) => {
    localStorage.setItem("maybeverse:welcomed", "true");
    if (values && !sessionStorage.getItem("pink-mochi-test-seeded")) {
      for (const [key, value] of Object.entries(values))
        localStorage.setItem(`maybeverse:${key}`, JSON.stringify(value));
      sessionStorage.setItem("pink-mochi-test-seeded", "true");
    }
  }, seed);
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Mochi’s little room. Yours, too." }),
  ).toBeVisible();
}
const roomMochi = (page: Page) =>
  page.locator('.room-mochi svg[data-mascot="pink-bunny"]');
const profile = (page: Page) =>
  page.evaluate(() =>
    JSON.parse(localStorage.getItem("maybeverse:mochi-profile")!),
  );
async function openTab(page: Page, name: string) {
  await page.getByRole("tab", { name, exact: true }).click();
}
async function close(page: Page) {
  await page.getByRole("button", { name: "Tutup popup" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
}

test("official bunny appears in hero, room, games, mood popup and final page with unique SVG IDs", async ({
  page,
}) => {
  await visit(page);
  await expect(page.locator(".hero-mochi svg")).toHaveAttribute(
    "data-mascot",
    "pink-bunny",
  );
  await expect(page.locator(".hero-mochi .mochi__ear")).toHaveCount(2);
  await expect(page.locator(".hero-mochi .mochi__mouth")).toHaveText("ω");
  await expect(page.locator(".hero-mochi .mochi__heart-badge")).toBeVisible();
  const ids = await page
    .locator("svg defs [id]")
    .evaluateAll((elements) => elements.map((element) => element.id));
  expect(new Set(ids).size).toBe(ids.length);
  await page.getByRole("button", { name: "Lagi sedih", exact: true }).click();
  await expect(
    page.getByRole("dialog").locator('svg[data-mascot="pink-bunny"]'),
  ).toHaveAttribute("data-expression", "sad");
  await close(page);
  await page.getByRole("button", { name: "Let’s catch some love" }).click();
  await expect(
    page.getByRole("dialog").locator('svg[data-mascot="pink-bunny"]'),
  ).toBeVisible();
  await close(page);
  await page.getByRole("button", { name: "Just between us" }).click();
  await expect(
    page.locator('.final-hug [data-mascot="pink-bunny"]'),
  ).toHaveCount(2);
});

test("pet, feed, tickle, talk, dance, nap, wake and hug produce real reactions and save care", async ({
  page,
}) => {
  await visit(page);
  await page.getByRole("button", { name: "Elus Mochi", exact: true }).click();
  await expect(roomMochi(page)).toHaveAttribute("data-expression", "blush");
  await page.getByRole("button", { name: "Beri Stroberi" }).click();
  await expect(roomMochi(page)).toHaveAttribute("data-expression", "eating");
  await expect(page.locator(".floating-snack")).toHaveText("🍓");
  await expect(page.locator(".room-speech")).toContainText(
    "pink sekarang rasa",
  );
  await page.getByRole("button", { name: "Gelitik dikit" }).click();
  await expect(roomMochi(page)).toHaveAttribute("data-expression", "angry");
  await page.getByRole("button", { name: "Mochi, cerita dong" }).click();
  await expect(roomMochi(page)).toHaveAttribute("data-expression", "confused");
  const firstStory = await page.locator(".room-speech").innerText();
  await page.getByRole("button", { name: "Mochi, cerita dong" }).click();
  await expect(page.locator(".room-speech")).not.toHaveText(firstStory);
  await page.getByRole("button", { name: "Happy dance", exact: true }).click();
  await expect(roomMochi(page)).toHaveAttribute("data-expression", "dance");
  await page.getByRole("button", { name: "Tidur sebentar" }).click();
  await expect(roomMochi(page)).toHaveAttribute("data-expression", "sleeping");
  await expect(page.locator(".bedroom-shell")).toHaveClass(/room-night/);
  await expect(
    page.getByRole("button", { name: "Beri Cookie" }),
  ).toBeDisabled();
  await page
    .getByRole("button", { name: "Bangunkan Mochi", exact: true })
    .click();
  await expect(roomMochi(page)).toHaveAttribute("data-expression", "jump");
  await expect(page.getByRole("button", { name: "Beri Cookie" })).toBeEnabled();
  await page.getByRole("button", { name: "Peluk Mochi", exact: true }).click();
  await expect(roomMochi(page)).toHaveAttribute("data-expression", "hug");
  await expect.poll(async () => (await profile(page)).hugs).toBe(1);
  expect(await profile(page)).toMatchObject({
    pets: 1,
    feeds: 1,
    tickles: 1,
    talks: 2,
    dances: 1,
    naps: 1,
    hugs: 1,
  });
  await expect(
    page.getByRole("progressbar", { name: "Little love collected" }),
  ).toHaveAttribute("aria-valuenow", "37");
});

test("accessories unlock through care, can be equipped across the website and persist", async ({
  page,
}) => {
  await visit(page);
  await openTab(page, "Tiny closet");
  await expect(
    page.getByRole("button", { name: "Pakai Pink ribbon" }),
  ).toBeDisabled();
  await openTab(page, "A little care");
  for (let i = 0; i < 3; i++)
    await page.getByRole("button", { name: "Elus Mochi", exact: true }).click();
  for (let i = 0; i < 2; i++)
    await page.getByRole("button", { name: "Beri Cookie" }).click();
  await page.getByRole("button", { name: "Tidur sebentar" }).click();
  await page
    .getByRole("button", { name: "Bangunkan Mochi", exact: true })
    .click();
  await page.getByRole("button", { name: "Peluk Mochi", exact: true }).click();
  await openTab(page, "Tiny closet");
  for (const name of ["Pink ribbon", "Berry beret", "Sleepy cap", "Hug scarf"])
    await expect(
      page.getByRole("button", { name: `Pakai ${name}` }),
    ).toBeEnabled();
  await page.getByRole("button", { name: "Pakai Hug scarf" }).click();
  await expect(roomMochi(page)).toHaveAttribute("data-outfit", "scarf");
  await expect(page.locator(".hero-mochi svg")).toHaveAttribute(
    "data-outfit",
    "scarf",
  );
  await expect(page.locator(".hero-mochi .mochi__heart-badge")).toBeVisible();
  await page.reload();
  await expect(roomMochi(page)).toHaveAttribute("data-outfit", "scarf");
  await openTab(page, "Tiny closet");
  await expect(
    page.getByRole("button", { name: "Pakai Hug scarf" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Pakai Just Mochi" }).click();
  await expect(roomMochi(page)).toHaveAttribute("data-outfit", "none");
});

test("five caring moments reveal Radli’s hidden ending and another real hug", async ({
  page,
}) => {
  await visit(page);
  await openTab(page, "Our scrapbook");
  await expect(
    page.getByRole("button", { name: "Buka laci rahasia Radli" }),
  ).toBeDisabled();
  await openTab(page, "A little care");
  for (const name of [
    "Elus Mochi",
    "Beri Stroberi",
    "Tidur sebentar",
    "Bangunkan Mochi",
    "Peluk Mochi",
    "Happy dance",
  ])
    await page.getByRole("button", { name, exact: true }).click();
  await openTab(page, "Our scrapbook");
  await expect(page.locator(".care-stamps .stamped")).toHaveCount(5);
  await page.getByRole("button", { name: "Buka laci rahasia Radli" }).click();
  await expect(
    page.getByRole("heading", {
      name: "A place to come home, just for Maybe.",
    }),
  ).toBeVisible();
  await expect(page.getByRole("dialog")).toContainText(
    "Kursi di sebelah gua tetap punya lu.",
  );
  await page.getByRole("button", { name: "Simpan satu peluk lagi" }).click();
  await expect(page.locator(".ending-hug-pair")).toHaveClass(/together/);
  await expect(page.locator(".ending-response")).toContainText(
    "Peluk tersimpan.",
  );
  await close(page);
  const discoveries = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("maybeverse:discoveries")!),
  );
  expect(discoveries).toContain("pink-ending");
  await page.reload();
  await openTab(page, "Our scrapbook");
  await expect(
    page.getByRole("button", { name: "Buka laci rahasia Radli" }),
  ).toBeEnabled();
});

test("room window secret and lamp work without exposing old Easter eggs", async ({
  page,
}) => {
  await visit(page);
  await page.getByRole("button", { name: "Matikan lampu kamar" }).click();
  await expect(page.locator(".bedroom-shell")).toHaveClass(/room-night/);
  await page.reload();
  await expect(page.locator(".bedroom-shell")).toHaveClass(/room-night/);
  await page.getByRole("button", { name: "Nyalakan lampu kamar" }).click();
  await expect(page.locator(".bedroom-shell")).not.toHaveClass(/room-night/);
  for (let i = 0; i < 3; i++)
    await page
      .getByRole("button", { name: "Lihat bintang di jendela" })
      .click();
  await expect(page.getByRole("dialog")).toContainText(
    "Dari jendela kecil, buat hati kamu.",
  );
  await close(page);
  await openTab(page, "Our scrapbook");
  await expect(page.getByLabel("Ditemukan: Window whisper")).toBeVisible();
});

test("return welcome appears once per page visit and preserves existing mood, sound and discoveries", async ({
  page,
}) => {
  await visit(page, {
    mood: "tired",
    sound: true,
    discoveries: ["meteor", "secret-letter"],
    "found-mochis": [0, 1, 2, 3],
  });
  await expect(
    page.getByRole("button", { name: "Capekkk", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByRole("button", { name: "Matikan suara" }),
  ).toBeVisible();
  await openTab(page, "Tiny closet");
  await expect(
    page.getByRole("button", { name: "Pakai Little queen" }),
  ).toBeEnabled();
  const firstVisits = (await profile(page)).visits;
  await page.reload();
  await expect(page.locator(".room-hello")).toContainText("welcome back");
  await expect(page.locator(".room-speech")).toContainText("Maybe balik!");
  await expect
    .poll(async () => (await profile(page)).visits)
    .toBe(firstVisits + 1);
  await page.getByRole("button", { name: "Elus Mochi", exact: true }).click();
  expect((await profile(page)).visits).toBe(firstVisits + 1);
  const legacy = await page.evaluate(() =>
    ["mood", "sound", "discoveries", "found-mochis"].map((key) =>
      JSON.parse(localStorage.getItem(`maybeverse:${key}`)!),
    ),
  );
  expect(legacy).toEqual([
    "tired",
    true,
    ["meteor", "secret-letter"],
    [0, 1, 2, 3],
  ]);
});

test("games save best catch, award glasses and flower, and can pause safely", async ({
  page,
}) => {
  await page.clock.install();
  await visit(page);
  await page.getByRole("button", { name: "Let’s catch some love" }).click();
  await page.getByRole("button", { name: "Mulai tangkap hati" }).click();
  for (let i = 0; i < 3; i++) {
    await page.clock.runFor(500);
    await page
      .getByRole("button", { name: "Tangkap hati", exact: true })
      .last()
      .click();
  }
  await page.getByRole("button", { name: "Jeda game" }).click();
  const before = await page.locator(".game-score>span").last().textContent();
  await page.clock.fastForward(30000);
  await expect(page.locator(".game-score>span").last()).toHaveText(before!);
  await expect(page.getByRole("dialog")).toContainText("Take a tiny breath.");
  await page.getByRole("button", { name: "Lanjut tangkap hati" }).click();
  await page.clock.runFor(200);
  expect(
    parseInt((await page.locator(".game-score>span").last().textContent())!),
  ).toBeGreaterThan(20);
  await page.clock.fastForward(30000);
  await expect(page.getByRole("dialog")).toContainText("3 hati tertangkap");
  await close(page);
  await expect.poll(async () => (await profile(page)).bestCatch).toBe(3);
  await page.getByRole("button", { name: "Time to pop!" }).click();
  for (let i = 0; i < 12; i++)
    await page.locator(".bubble:not(.popped)").first().click();
  await close(page);
  await openTab(page, "Tiny closet");
  await expect(
    page.getByRole("button", { name: "Pakai Love glasses" }),
  ).toBeEnabled();
  await expect(
    page.getByRole("button", { name: "Pakai Daisy crown" }),
  ).toBeEnabled();
  await page.reload();
  expect((await profile(page)).bestCatch).toBe(3);
});

test("room tabs support arrow keys and focus follows the selected tab", async ({
  page,
}) => {
  await visit(page);
  await page.getByRole("tab", { name: "A little care" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Tiny closet" })).toBeFocused();
  await expect(page.getByRole("tab", { name: "Tiny closet" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await page.keyboard.press("End");
  await expect(page.getByRole("tab", { name: "Our scrapbook" })).toBeFocused();
  await page.keyboard.press("Home");
  await expect(page.getByRole("tab", { name: "A little care" })).toBeFocused();
});

for (const state of ["care", "closet", "scrapbook", "sleeping"]) {
  test(`new room accessibility: ${state}`, async ({ page }) => {
    await visit(page);
    if (state === "closet") await openTab(page, "Tiny closet");
    if (state === "scrapbook") await openTab(page, "Our scrapbook");
    if (state === "sleeping")
      await page.getByRole("button", { name: "Tidur sebentar" }).click();
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      result.violations.map((item) => ({
        id: item.id,
        nodes: item.nodes.map((node) => ({
          target: node.target,
          summary: node.failureSummary,
        })),
      })),
    ).toEqual([]);
  });
}

test("the bedroom and profile remain interactive offline", async ({
  page,
  context,
}) => {
  await visit(page);
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  await page.getByRole("button", { name: "Elus Mochi", exact: true }).click();
  await context.setOffline(true);
  await page.reload();
  await page.getByRole("button", { name: "Beri Stroberi" }).click();
  await expect(roomMochi(page)).toHaveAttribute("data-expression", "eating");
  expect(await profile(page)).toMatchObject({ pets: 1, feeds: 1 });
  await context.setOffline(false);
});

test("hidden ending is keyboard accessible and has readable contrast", async ({
  page,
}) => {
  await visit(page, {
    "mochi-profile": {
      pets: 1,
      feeds: 1,
      naps: 1,
      hugs: 1,
      dances: 1,
      visits: 1,
      accessory: "none",
      unlocked: ["none"],
    },
  });
  await openTab(page, "Our scrapbook");
  await page.getByRole("button", { name: "Buka laci rahasia Radli" }).click();
  await expect(page.getByRole("button", { name: "Tutup popup" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(
    page.getByRole("button", { name: "Pulang ke Mochi" }),
  ).toBeFocused();
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    result.violations.map((item) => ({
      id: item.id,
      nodes: item.nodes.map((node) => ({
        target: node.target,
        summary: node.failureSummary,
      })),
    })),
  ).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("corrupted companion storage falls back safely and care still works", async ({
  page,
}) => {
  await visit(page, {
    "mochi-profile": {
      pets: -1,
      love: "invalid",
      accessory: "not-an-outfit",
      unlocked: "bad",
      visits: null,
    },
  });
  await expect(roomMochi(page)).toHaveAttribute("data-outfit", "none");
  await page.getByRole("button", { name: "Elus Mochi", exact: true }).click();
  expect(await profile(page)).toMatchObject({
    pets: 1,
    love: 5,
    accessory: "none",
  });
});

for (const width of [320, 390, 768, 1440]) {
  test(`Pink Mochi visual and touch layout ${width}px`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: width < 680 ? 844 : 1000 });
    await visit(page);
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const hero = page.locator(".hero-mochi");
    const ears = page.locator(".hero-mochi .mochi__ear");
    const charBox = await hero.boundingBox();
    for (let i = 0; i < 2; i++) {
      const earBox = await ears.nth(i).boundingBox();
      expect(earBox!.x).toBeGreaterThanOrEqual(0);
      expect(earBox!.x + earBox!.width).toBeLessThanOrEqual(width);
      expect(earBox!.y).toBeGreaterThanOrEqual(charBox!.y);
    }
    const speechBox = await page.locator(".room-speech").boundingBox();
    const stageBox = await page.locator(".bedroom-stage").boundingBox();
    const roomEars = page.locator(".room-mochi .mochi__ear");
    for (let i = 0; i < 2; i++) {
      const earBox = await roomEars.nth(i).boundingBox();
      expect(earBox!.y).toBeGreaterThan(speechBox!.y + speechBox!.height);
      expect(earBox!.y).toBeGreaterThanOrEqual(stageBox!.y);
      expect(earBox!.y + earBox!.height).toBeLessThanOrEqual(
        stageBox!.y + stageBox!.height,
      );
    }
    await page.screenshot({
      path: testInfo.outputPath(`pink-home-${width}.png`),
      fullPage: true,
    });
    for (const tab of ["A little care", "Tiny closet", "Our scrapbook"]) {
      await openTab(page, tab);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      const clipped = await page
        .locator(
          ".care-action, .snack-tray button, .accessory-card, .room-panel-title h3, .radli-drawer h4",
        )
        .evaluateAll((elements) =>
          elements
            .filter(
              (element) =>
                element.getClientRects().length &&
                element.scrollWidth > element.clientWidth + 1,
            )
            .map((element) => element.textContent),
        );
      expect(clipped).toEqual([]);
      await page.locator(".bedroom-shell").screenshot({
        path: testInfo.outputPath(
          `pink-room-${tab.replaceAll(" ", "-")}-${width}.png`,
        ),
      });
    }
  });
}
