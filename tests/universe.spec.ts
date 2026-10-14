import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const errors = new WeakMap<Page, string[]>();
test.beforeEach(({ page }) => {
  errors.set(page, []);
  page.on("pageerror", (e) => errors.get(page)?.push(e.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.get(page)?.push(message.text());
  });
});
test.afterEach(({ page }) => expect(errors.get(page)).toEqual([]));
async function visit(page: Page, seed: Record<string, unknown> = {}) {
  await page.addInitScript((values) => {
    localStorage.setItem("maybeverse:welcomed", "true");
    if (!sessionStorage.getItem("world-test-seeded")) {
      localStorage.setItem(
        "maybeverse:universe-v2",
        JSON.stringify({ autoPopups: false, ...values }),
      );
      sessionStorage.setItem("world-test-seeded", "true");
    }
  }, seed);
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "A whole little world. Just for you." }),
  ).toBeVisible();
}
const state = (page: Page) =>
  page.evaluate(() =>
    JSON.parse(localStorage.getItem("maybeverse:universe-v2")!),
  );
async function open(page: Page, name: string) {
  await page
    .locator(".world-destination")
    .filter({ has: page.getByRole("heading", { name, exact: true }) })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(1);
}
async function close(page: Page) {
  await page.getByRole("button", { name: "Tutup popup" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
}
async function collect(page: Page, name: string) {
  await page
    .getByRole("button", { name: "Ambil bintang: " + name, exact: true })
    .click();
  await expect(
    page.getByRole("button", {
      name: "Bintang terkumpul: " + name,
      exact: true,
    }),
  ).toBeDisabled();
}
async function happyGame(page: Page) {
  await page.getByRole("button", { name: "Mulai Make Mochi Happy" }).click();
  const names: Record<string, string> = {
    strawberry: "Stroberi",
    cookie: "Cookie",
    milk: "Susu hangat",
    mochi: "Mochi manis",
    pet: "Elus kepala",
    hug: "Peluk kecil",
    dance: "Ajak dance",
    sleep: "Istirahat",
  };
  for (let i = 0; i < 5; i++) {
    const craving = await page
      .locator(".mochi-wish")
      .getAttribute("data-craving");
    await page
      .getByRole("button", { name: names[craving!], exact: true })
      .click();
    await expect(page.locator(".happy-feedback")).toContainText("YESS!");
    await page
      .getByRole("button", {
        name: i === 4 ? "Lihat hasil kecil kita" : "Keinginan berikutnya",
      })
      .click();
  }
  await expect(page.locator(".happy-result")).toContainText("5/5 happy hearts");
}

test("first portal has usable NOPE choices, grants access, retains Radli welcome, and only appears once", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("dialog")).toContainText("WAIT WAIT WAIT");
  const nope = page.getByRole("button", {
    name: "NOPE, WRONG PERSON 🤨",
    exact: true,
  });
  for (let i = 0; i < 4; i++) await nope.click();
  await expect(page.locator(".portal-reply")).toContainText("CUMA MAYBE");
  await expect(nope).toHaveClass(/nope-shift-2/);
  await expect(page.locator(".portal-illustration svg")).toHaveAttribute(
    "data-expression",
    "cry",
  );
  await page
    .getByRole("button", { name: "YESSS THAT’S MEEE 💗", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText("ACCESS GRANTED!");
  await expect(page.locator(".portal-illustration svg")).toHaveAttribute(
    "data-mascot",
    "pink-bunny",
  );
  await page
    .getByRole("button", { name: "Radli yaaa? 😭", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText("YAAA BENERRR");
  await page.getByRole("button", { name: /Masuk ke duniaku/ }).click();
  await page.reload();
  await page.waitForTimeout(800);
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("pet reactions vary, kiss, spin, hide and celebrate are real bunny states, and ten pats unlock a dance", async ({
  page,
}) => {
  await visit(page);
  const bunny = page.locator(".room-mochi svg");
  for (const expression of ["blush", "jump", "kiss"]) {
    await page.getByRole("button", { name: "Elus Mochi", exact: true }).click();
    await expect(bunny).toHaveAttribute("data-expression", expression);
  }
  for (const [label, expression] of [
    ["Kirim kiss", "kiss"],
    ["Kelinci putar", "spin"],
    ["Malu dikit", "hide"],
    ["Rayakan hal kecil", "celebrate"],
  ]) {
    await page.getByRole("button", { name: label, exact: true }).click();
    await expect(bunny).toHaveAttribute("data-expression", expression);
    await expect(bunny).toHaveAttribute("data-mascot", "pink-bunny");
  }
  for (let i = 0; i < 7; i++)
    await page.getByRole("button", { name: "Elus Mochi", exact: true }).click();
  await expect(bunny).toHaveAttribute("data-expression", "dance");
  expect((await state(page)).eggs).toContain("secret-dance");
});

test("idle Mochi sleeps after 90 seconds and touching the bunny wakes her", async ({
  page,
}) => {
  await page.clock.install();
  await visit(page);
  await page.clock.runFor(90001);
  await expect(page.locator(".room-mochi svg")).toHaveAttribute(
    "data-expression",
    "sleeping",
  );
  await page.locator(".room-mochi").click();
  await expect(page.locator(".room-mochi svg")).toHaveAttribute(
    "data-expression",
    "jump",
  );
  await page.clock.runFor(4300);
  await expect(page.locator(".room-mochi svg")).toHaveAttribute(
    "data-expression",
    "happy",
  );
});

test("fortune cookie gives 60 distinct working messages before repeating and keeps its star", async ({
  page,
}) => {
  await visit(page);
  await open(page, "Mochi’s fortune cookie");
  const messages: string[] = [];
  await page
    .getByRole("button", { name: "Pecahkan fortune cookie", exact: true })
    .click();
  for (let i = 0; i < 60; i++) {
    if (i)
      await page
        .getByRole("button", { name: "Buka fortune cookie lain", exact: true })
        .click();
    messages.push(await page.locator(".fortune-paper p").innerText());
  }
  expect(new Set(messages).size).toBe(60);
  expect((await state(page)).stats.fortune).toBe(60);
  expect((await state(page)).eggs).toContain("cookie-crumble");
  await collect(page, "The little hope");
  await close(page);
  await page.reload();
  expect((await state(page)).fragments).toContain("fortune");
});

test("three hug sizes have different dialogue and animation states; mega hug is a secret", async ({
  page,
}) => {
  await visit(page);
  await open(page, "The hug machine");
  const replies: string[] = [];
  for (const [name, kind] of [
    ["Tiny hug", "tiny"],
    ["Big hug", "big"],
    ["SUPER MEGA ULTRA HUG", "mega"],
  ]) {
    await page.getByRole("button", { name, exact: true }).click();
    await expect(page.locator(".hug-machine-scene")).toHaveClass(
      new RegExp("hug-" + kind),
    );
    replies.push(await page.locator(".hug-dialogue").innerText());
  }
  expect(new Set(replies).size).toBe(3);
  expect((await state(page)).stats.hugs).toBe(3);
  expect((await state(page)).eggs).toContain("mega-hug");
  await collect(page, "The little warmth");
});

test("garden plants, grows, renames, reveals the cat and sleeping bunny, and preserves progress", async ({
  page,
}) => {
  await visit(page);
  await open(page, "Maybe’s little garden");
  await page.getByLabel("Nama kecilnya").fill("Little Hope");
  await page.getByRole("button", { name: "Tanam bunga", exact: true }).click();
  for (let i = 1; i <= 3; i++) {
    await page
      .getByRole("button", { name: "Siram Little Hope", exact: true })
      .click();
    await expect(
      page.getByRole("progressbar", { name: "Pertumbuhan Little Hope" }),
    ).toHaveAttribute("value", String(i));
  }
  await page.getByLabel("Ganti nama tanaman").fill("Radli");
  await page.getByRole("button", { name: "Simpan nama", exact: true }).click();
  await expect(page.locator(".garden-selected h3")).toHaveText("Radli");
  for (let i = 0; i < 3; i++)
    await page
      .getByRole("button", { name: "Sentuh kelopaknya", exact: true })
      .click();
  await expect(page.locator(".garden-cat .cat")).toBeVisible();
  await page
    .getByRole("button", { name: "Kelinci kecil di bawah bangku", exact: true })
    .click();
  await expect(page.locator(".garden-hidden-bunny")).toHaveClass(/found/);
  await collect(page, "The little growth");
  await close(page);
  await page.reload();
  await open(page, "Maybe’s little garden");
  await expect(page.locator(".garden-selected h3")).toHaveText("Radli");
  await expect(
    page.getByRole("progressbar", { name: "Pertumbuhan Radli" }),
  ).toHaveAttribute("value", "3");
  const saved = await state(page);
  expect(saved.eggs).toEqual(
    expect.arrayContaining(["flower-cat", "garden-name", "garden-nap"]),
  );
  expect(saved.plants[0].water).toBe(3);
});

test("third visit unlocks moonflower and can transform a full garden without losing growth", async ({
  page,
}) => {
  const plants = Array.from({ length: 6 }, (_, i) => ({
    id: "pot-" + i,
    kind: "tulip",
    name: "Flower " + i,
    stage: 3,
    water: 3,
  }));
  await visit(page, { visits: 2, plants });
  await open(page, "Maybe’s little garden");
  await expect(page.locator(".moonflower-unlock")).toContainText("unlocked");
  await page
    .getByRole("button", { name: "Beri sentuhan moonflower", exact: true })
    .click();
  const saved = await state(page);
  expect(saved.plants).toHaveLength(6);
  expect(saved.plants[0]).toMatchObject({
    name: "Flower 0",
    stage: 3,
    water: 3,
    kind: "moonflower",
  });
});

test("free capsules deliver all 24 distinct stickers; album selection and ownership survive reload", async ({
  page,
}) => {
  await visit(page);
  await open(page, "The cuteness capsule");
  const rewards: string[] = [];
  const categories = new Set<string>();
  for (let i = 0; i < 24; i++) {
    await page
      .getByRole("button", { name: "OPEN A LITTLE GIFT", exact: true })
      .click();
    rewards.push(await page.locator(".capsule-reward h3").innerText());
    categories.add(
      await page.locator(".capsule-gift-extra .eyebrow").innerText(),
    );
    if (
      await page
        .getByRole("button", { name: "Sapa kelinci kapsul", exact: true })
        .count()
    ) {
      await page
        .getByRole("button", { name: "Sapa kelinci kapsul", exact: true })
        .click();
      await expect(page.locator(".capsule-mini-note")).toContainText(
        "dukungan tetap gede",
      );
    }
  }
  expect(new Set(rewards).size).toBe(24);
  expect(categories.size).toBe(6);
  expect((await state(page)).stickers).toHaveLength(24);
  await collect(page, "The little surprise");
  await close(page);
  await page.reload();
  await open(page, "The sticker collection");
  await expect(page.locator(".sticker-card.owned")).toHaveCount(24);
  await page
    .getByRole("button", {
      name: "Queen of Random Thoughts, collected",
      exact: true,
    })
    .click();
  await expect(page.locator(".sticker-description")).toContainText(
    "belok tanpa lampu sein",
  );
  await page.getByRole("button", { name: /Little secrets/ }).click();
  await page
    .getByRole("button", { name: "Tunjukkan petunjuk kecil", exact: true })
    .click();
  await expect(page.locator(".secret-map li")).toHaveCount(22);
  await expect(page.locator(".secret-map")).toContainText(
    "Ketuk logo MAYBEVERSE lima kali",
  );
});

test("bottle notes avoid repeats and fifth bottle unlocks a personal current", async ({
  page,
}) => {
  await visit(page);
  await open(page, "Message in a bottle");
  const notes: string[] = [];
  await page
    .getByRole("button", { name: "Buka botol pesan Radli", exact: true })
    .click();
  for (let i = 0; i < 30; i++) {
    if (i)
      await page
        .getByRole("button", { name: "Buka botol pesan lain", exact: true })
        .click();
    notes.push(await page.locator(".bottle-note p").innerText());
  }
  expect(new Set(notes).size).toBe(30);
  expect((await state(page)).eggs).toContain("bottle-current");
  await collect(page, "The little promise");
});

test("Make Mochi Happy accepts retries, animates care, completes five rounds, and unlocks its star", async ({
  page,
}) => {
  await visit(page);
  await open(page, "Make Mochi happy");
  await page.getByRole("button", { name: "Mulai Make Mochi Happy" }).click();
  const craving = await page
    .locator(".mochi-wish")
    .getAttribute("data-craving");
  const names: Record<string, string> = {
    strawberry: "Stroberi",
    cookie: "Cookie",
    milk: "Susu hangat",
    mochi: "Mochi manis",
    pet: "Elus kepala",
    hug: "Peluk kecil",
    dance: "Ajak dance",
    sleep: "Istirahat",
  };
  const wrong = page
    .locator(".happy-choice")
    .filter({ hasNotText: names[craving!] });
  await wrong.first().click();
  await expect(page.locator(".happy-feedback")).toContainText("Coba satu lagi");
  await expect(page.locator(".happy-score")).toContainText("0 happy hearts");
  for (let i = 0; i < 5; i++) {
    const key = await page.locator(".mochi-wish").getAttribute("data-craving");
    await page.getByRole("button", { name: names[key!], exact: true }).click();
    await expect(
      page.locator(".happy-game-scene svg[data-mascot]"),
    ).toHaveAttribute("data-mascot", "pink-bunny");
    await page
      .getByRole("button", {
        name: i === 4 ? "Lihat hasil kecil kita" : "Keinginan berikutnya",
      })
      .click();
  }
  await expect(page.locator(".happy-result")).toContainText("5/5 happy hearts");
  expect((await state(page)).stats.happy).toBe(1);
  await collect(page, "The little effort");
});

test("night sky messages, moon, golden star, MAYBE constellation and both letters work", async ({
  page,
}) => {
  await visit(page);
  await open(page, "A little night sky");
  await page
    .getByRole("button", { name: "Bintang pesan 1", exact: true })
    .click();
  await expect(page.locator(".sky-note")).toContainText("nggak sendirian");
  await page
    .getByRole("button", { name: "Ganti mode malam", exact: true })
    .click();
  await expect(page.locator("#page")).toHaveClass(/universe-night/);
  await page
    .getByRole("button", { name: "Bintang emas rahasia", exact: true })
    .click();
  await expect(page.locator(".sky-note")).toContainText("Golden compliment");
  for (const letter of "MAYBE")
    await page
      .getByRole("button", { name: "Bintang huruf " + letter, exact: true })
      .click();
  await expect(page.locator(".maybe-constellation button.lit")).toHaveCount(5);
  await expect(page.locator(".constellation-letter")).toContainText(
    "Nama lu udah ada",
  );
  await page
    .getByRole("button", { name: "Surat dari rasi hati", exact: true })
    .click();
  await expect(page.locator(".constellation-letter")).toHaveCount(2);
  await collect(page, "The little home");
  await close(page);
  await page.reload();
  await open(page, "A little night sky");
  await expect(page.locator(".maybe-constellation button.lit")).toHaveCount(5);
  expect((await state(page)).eggs).toEqual(
    expect.arrayContaining(["moon-toggle", "golden-star", "constellation"]),
  );
});

test("40 different surprise deliveries use six designs, answer food gently, and never stack dialogs", async ({
  page,
}) => {
  await visit(page);
  await open(page, "Mochi’s surprise post");
  const messages: string[] = [];
  const layouts = new Set<string>();
  let food = false;
  for (let i = 0; i < 40; i++) {
    if (i)
      await page
        .getByRole("button", { name: "ONE MORE PLEASE!", exact: true })
        .click();
    await expect(page.locator(".surprise-delivery")).toBeVisible();
    messages.push(await page.getByRole("dialog").locator("h2").innerText());
    layouts.add(
      (await page.locator(".surprise-delivery").getAttribute("class"))!.match(
        /delivery-(\w+)/,
      )![1],
    );
    if (
      await page.getByRole("button", { name: "NOT YET", exact: true }).count()
    ) {
      food = true;
      await page.getByRole("button", { name: "NOT YET", exact: true }).click();
      await expect(page.locator(".delivery-reply")).toContainText(
        "nggak apa-apa",
      );
    }
    await expect(page.getByRole("dialog")).toHaveCount(1);
  }
  expect(new Set(messages).size).toBe(40);
  expect(layouts.size).toBe(6);
  expect(food).toBe(true);
  expect((await state(page)).stats.popup).toBe(40);
});

test("automatic surprise appears once after a long pause and can be turned off", async ({
  page,
}) => {
  await page.clock.install();
  await visit(page, { autoPopups: true });
  await page.clock.runFor(75001);
  await expect(page.locator(".surprise-delivery")).toBeVisible();
  await close(page);
  await page.clock.runFor(76000);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await open(page, "Make yourself cozy");
  await page.getByRole("switch", { name: /Kejutan otomatis/ }).click();
  await close(page);
  await page.reload();
  await page.clock.runFor(76000);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  expect((await state(page)).autoPopups).toBe(false);
});

test("automatic surprise does not interrupt an open experience", async ({
  page,
}) => {
  await page.clock.install();
  await visit(page, { autoPopups: true });
  await open(page, "Mochi’s fortune cookie");
  await page.clock.runFor(76000);
  await expect(page.getByRole("dialog")).toHaveCount(1);
  await expect(page.locator(".fortune-experience")).toBeVisible();
  await close(page);
  await page.clock.runFor(76000);
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("sound, calm effects and night preferences persist and all controls remain usable", async ({
  page,
}) => {
  await visit(page);
  await open(page, "Make yourself cozy");
  await expect(
    page.getByRole("switch", { name: /Suara kecil/ }),
  ).toHaveAttribute("aria-checked", "false");
  await page.getByRole("switch", { name: /Suara kecil/ }).click();
  await page.getByRole("switch", { name: /Efek dan gerakan ekstra/ }).click();
  await page.getByRole("switch", { name: /Lampu malam/ }).click();
  await close(page);
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-effects", "calm");
  await expect(page.locator("#page")).toHaveClass(/universe-night/);
  await expect(
    page.getByRole("button", { name: "Matikan suara", exact: true }),
  ).toBeVisible();
  await open(page, "The cuteness capsule");
  await page.getByRole("button", { name: "OPEN A LITTLE GIFT" }).click();
  await expect(page.locator(".capsule-reward")).toBeVisible();
});

test("logo and drum secrets are touch-accessible and giant Mochi keeps the bunny identity", async ({
  page,
}) => {
  await visit(page);
  for (let i = 0; i < 3; i++)
    await page
      .getByRole("button", { name: "Ketuk drum kelinci", exact: true })
      .click();
  expect((await state(page)).eggs).toContain("tap-rhythm");
  for (let i = 0; i < 5; i++)
    await page
      .getByRole("link", { name: "MAYBEVERSE, halaman utama", exact: true })
      .click();
  await expect(page.getByRole("dialog")).toContainText(
    "MOCHI BERUKURAN PELUKAN",
  );
  await expect(
    page.locator(".giant-experience svg[data-mascot]"),
  ).toHaveAttribute("data-mascot", "pink-bunny");
  await page
    .getByRole("button", { name: "Peluk kelinci raksasa", exact: true })
    .click();
  expect((await state(page)).eggs).toContain("giant-mochi");
});

test("POP EVERYTHING completes a real game once, awards its secret, and reset works", async ({
  page,
}) => {
  await visit(page);
  await page.getByRole("button", { name: "Time to pop!" }).click();
  await page
    .getByRole("button", { name: "POP EVERYTHING!", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText("GOOD JOB MAY");
  expect((await state(page)).eggs).toContain("bubble-party");
  const profile = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("maybeverse:mochi-profile")!),
  );
  expect(profile.bubbleGames).toBe(1);
  await page.getByRole("button", { name: "Ulangi", exact: true }).click();
  await expect(
    page.getByRole("button", { name: /Pecahkan bubble/ }),
  ).toHaveCount(12);
  await expect(page.getByRole("dialog")).toContainText("0 / 12");
});

test("all six mood rescue activities work alongside the original personal messages", async ({
  page,
}) => {
  await visit(page);
  for (const name of [
    "Happy banget!",
    "Capekkk",
    "Lagi sedih",
    "Lagi kesel",
    "Stres kuliah",
    "Pokoknya aneh",
  ]) {
    const button = page.getByRole("button", { name, exact: true });
    await button.click();
    await expect(page.locator(".mood-rescue")).toBeVisible();
    for (let i = 0; i < 3; i++)
      await page.locator(".mood-rescue button").click();
    await expect(page.locator(".mood-rescue-done")).toBeVisible();
    await close(page);
  }
});

test("all seven letters award their secret without removing old content", async ({
  page,
}) => {
  await visit(page);
  const letters = page.locator(".letter-card");
  await expect(letters).toHaveCount(7);
  for (let i = 0; i < 7; i++) {
    await letters.nth(i).click();
    await expect(page.locator(".opened-letter p")).not.toBeEmpty();
    await close(page);
  }
  const saved = await state(page);
  expect(saved.letters).toHaveLength(7);
  expect(saved.eggs).toContain("all-letters");
  expect(saved.stickers).toContain("student");
});

test("seven stars can be earned through real experiences, unlock the full letter, and remain reopenable", async ({
  page,
}) => {
  test.setTimeout(180000);
  await visit(page);
  await open(page, "Mochi’s fortune cookie");
  await page
    .getByRole("button", { name: "Pecahkan fortune cookie", exact: true })
    .click();
  await collect(page, "The little hope");
  await close(page);
  await open(page, "The hug machine");
  await page.getByRole("button", { name: "Tiny hug", exact: true }).click();
  await collect(page, "The little warmth");
  await close(page);
  await open(page, "Maybe’s little garden");
  await page.getByLabel("Nama kecilnya").fill("Our Hope");
  await page.getByRole("button", { name: "Tanam bunga", exact: true }).click();
  for (let i = 0; i < 3; i++)
    await page
      .getByRole("button", { name: "Siram Our Hope", exact: true })
      .click();
  await collect(page, "The little growth");
  await close(page);
  await open(page, "The cuteness capsule");
  await page
    .getByRole("button", { name: "OPEN A LITTLE GIFT", exact: true })
    .click();
  await collect(page, "The little surprise");
  await close(page);
  await open(page, "Make Mochi happy");
  await happyGame(page);
  await collect(page, "The little effort");
  await close(page);
  await open(page, "A little night sky");
  for (const l of "MAYBE")
    await page
      .getByRole("button", { name: "Bintang huruf " + l, exact: true })
      .click();
  await collect(page, "The little home");
  await close(page);
  await open(page, "Message in a bottle");
  await page
    .getByRole("button", { name: "Buka botol pesan Radli", exact: true })
    .click();
  await collect(page, "The little promise");
  await close(page);
  await page.getByRole("button", { name: "Open our secret chapter" }).click();
  await expect(page.locator(".chapter-envelope")).toBeEnabled();
  await page.getByRole("button", { name: "Open Radli’s letter" }).click();
  await expect(page.locator(".seven-star-letter")).toContainText(
    "I'm rooting for you. Always.",
  );
  await page.getByRole("button", { name: "Read Again", exact: true }).click();
  await expect(page.locator(".chapter-envelope")).toBeEnabled();
  await page.locator(".chapter-envelope").click();
  await expect(page.locator(".seven-star-letter")).toContainText(
    "Gua cuma pengen punya satu cara kecil",
  );
  await page
    .getByRole("button", { name: "Back to Our Little Universe", exact: true })
    .click();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Open our secret chapter" }),
  ).toBeEnabled();
  expect((await state(page)).fragments).toHaveLength(7);
});

test("new daily dialogue and compliment stay stable and change after local midnight", async ({
  page,
}) => {
  await page.clock.install({ time: new Date("2026-10-14T16:58:00Z") });
  await page.clock.pauseAt(new Date("2026-10-14T16:59:30Z"));
  await visit(page);
  const before = await page.locator(".world-daily p").allTextContents();
  await page.reload();
  await expect(page.locator(".world-daily p")).toHaveText(before);
  await page.clock.runFor(61000);
  expect(await page.locator(".world-daily p").allTextContents()).not.toEqual(
    before,
  );
});

test("offline reload retains and runs the new garden, capsule, cookie and album", async ({
  page,
  context,
}) => {
  await visit(page);
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller)
      await new Promise<void>((resolve) =>
        navigator.serviceWorker.addEventListener(
          "controllerchange",
          () => resolve(),
          { once: true },
        ),
      );
  });
  await open(page, "Maybe’s little garden");
  await page.getByLabel("Nama kecilnya").fill("Offline Bloom");
  await page.getByRole("button", { name: "Tanam bunga", exact: true }).click();
  await close(page);
  await context.setOffline(true);
  await page.reload();
  await open(page, "Maybe’s little garden");
  await page
    .getByRole("button", { name: "Siram Offline Bloom", exact: true })
    .click();
  await expect(
    page.getByRole("progressbar", { name: "Pertumbuhan Offline Bloom" }),
  ).toHaveAttribute("value", "1");
  await close(page);
  await open(page, "The cuteness capsule");
  await page.getByRole("button", { name: "OPEN A LITTLE GIFT" }).click();
  await expect(page.locator(".capsule-reward")).toBeVisible();
  await close(page);
  await open(page, "Mochi’s fortune cookie");
  await page.getByRole("button", { name: "Pecahkan fortune cookie" }).click();
  await expect(page.locator(".fortune-paper p")).not.toBeEmpty();
  await close(page);
  await open(page, "The sticker collection");
  await expect(page.locator(".sticker-card.owned").first()).toBeVisible();
});

test("corrupt world storage recovers safely and unavailable storage does not break interactions", async ({
  page,
}) => {
  await visit(page, {
    plants: [null, { id: "bad", kind: "wrong", name: 3 }],
    stickers: [null, "forged"],
    fragments: "all",
    decks: { fortune: "bad" },
    visits: "hi",
  });
  expect((await state(page)).plants).toEqual([]);
  await open(page, "Maybe’s little garden");
  await page.getByRole("button", { name: "Tanam bunga", exact: true }).click();
  await expect(page.locator(".garden-plot")).toHaveCount(1);
  await close(page);
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new Error("storage unavailable");
    };
  });
  await page.reload();
  await open(page, "The hug machine");
  await page.getByRole("button", { name: "Big hug", exact: true }).click();
  await expect(page.locator(".hug-dialogue")).toContainText("Bebannya");
});

test("phone touch controls open, feed, collect and close without covering the screen", async ({
  browser,
}) => {
  const context = await browser.newContext({
    baseURL: "http://127.0.0.1:4173",
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 3,
    reducedMotion: "reduce",
  });
  const mobile = await context.newPage();
  const runtime: string[] = [];
  mobile.on("pageerror", (error) => runtime.push(error.message));
  try {
    await visit(mobile);
    await mobile
      .locator(".world-destination")
      .filter({
        has: mobile.getByRole("heading", {
          name: "Mochi’s fortune cookie",
          exact: true,
        }),
      })
      .tap();
    await mobile
      .getByRole("button", { name: "Pecahkan fortune cookie", exact: true })
      .tap();
    await mobile
      .getByRole("button", {
        name: "Ambil bintang: The little hope",
        exact: true,
      })
      .tap();
    const box = await mobile.getByRole("dialog").boundingBox();
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.y + box!.height).toBeLessThanOrEqual(844);
    await mobile
      .getByRole("button", { name: "Tutup popup", exact: true })
      .tap();
    await mobile
      .getByRole("button", { name: "Beri Mochi manis", exact: true })
      .tap();
    await expect(mobile.locator(".room-mochi svg")).toHaveAttribute(
      "data-expression",
      "eating",
    );
    await mobile
      .getByRole("button", { name: "Where are you, Mochi?", exact: true })
      .tap();
    await mobile
      .getByRole("button", { name: "Tutup popup", exact: true })
      .tap();
    const hunt = await mobile.locator(".hunt-progress").boundingBox();
    const navigation = await mobile.locator(".mobile-world-nav").boundingBox();
    expect(hunt!.y + hunt!.height).toBeLessThan(navigation!.y);
    expect(
      await mobile.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(runtime).toEqual([]);
  } finally {
    await context.close();
  }
});

for (const name of [
  "The hug machine",
  "Mochi’s fortune cookie",
  "Maybe’s little garden",
  "The cuteness capsule",
  "The sticker collection",
  "Make Mochi happy",
  "A little night sky",
  "Message in a bottle",
  "Mochi’s surprise post",
  "Make yourself cozy",
]) {
  test("accessibility: new experience " + name, async ({ page }) => {
    await visit(page);
    await open(page, name);
    if (name === "Maybe’s little garden") {
      await page
        .getByRole("button", { name: "Tanam bunga", exact: true })
        .click();
      await page
        .getByRole("button", { name: "Siram Little flower", exact: true })
        .click();
    }
    if (name === "The hug machine")
      await page.getByRole("button", { name: "Big hug", exact: true }).click();
    if (name === "The cuteness capsule")
      await page.getByRole("button", { name: "OPEN A LITTLE GIFT" }).click();
    if (name === "Mochi’s fortune cookie")
      await page
        .getByRole("button", { name: "Pecahkan fortune cookie" })
        .click();
    if (name === "Message in a bottle")
      await page
        .getByRole("button", { name: "Buka botol pesan Radli" })
        .click();
    if (name === "Make Mochi happy")
      await page
        .getByRole("button", { name: "Mulai Make Mochi Happy" })
        .click();
    const scan = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .include('[role="dialog"]')
      .analyze();
    expect(scan.violations).toEqual([]);
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });
}
for (const width of [320, 390, 768, 1440]) {
  test(
    "new universe visual layout " + width + "px",
    async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: width < 600 ? 844 : 1000 });
      await visit(page);
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.screenshot({
        path: testInfo.outputPath("world-home-" + width + ".png"),
        fullPage: true,
      });
      for (const name of [
        "Maybe’s little garden",
        "The sticker collection",
        "A little night sky",
        "Make Mochi happy",
        "Make yourself cozy",
      ]) {
        await open(page, name);
        expect(
          await page
            .getByRole("dialog")
            .evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
        ).toBe(true);
        const clipped = await page
          .locator(
            ".world-experience button,.world-experience input,.world-experience select",
          )
          .evaluateAll((elements) =>
            elements
              .filter(
                (e) =>
                  e.getClientRects().length &&
                  e.scrollWidth > e.clientWidth + 1,
              )
              .map((e) => e.textContent),
          );
        expect(clipped).toEqual([]);
        await page.screenshot({
          path: testInfo.outputPath(
            name.replaceAll(" ", "-") + "-" + width + ".png",
          ),
        });
        await close(page);
      }
    },
  );
}
