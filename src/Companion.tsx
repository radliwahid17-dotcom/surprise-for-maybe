import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  accessories,
  mochiSpeech,
  type Accessory,
  type CareAction,
  type MochiProfile,
} from "./mochi-data";
import { chooseOther, readSaved, save } from "./storage";

const blankProfile: MochiProfile = {
  version: 1,
  visits: 0,
  lastSeen: 0,
  pets: 0,
  feeds: 0,
  naps: 0,
  hugs: 0,
  dances: 0,
  talks: 0,
  tickles: 0,
  love: 0,
  bestCatch: 0,
  catchGames: 0,
  bubbleGames: 0,
  accessory: "none",
  unlocked: ["none"],
};
const accessoryIds = new Set(accessories.map((item) => item.id));
function getProfile(): MochiProfile {
  const stored = readSaved<unknown>("mochi-profile", null);
  if (!stored || typeof stored !== "object")
    return { ...blankProfile, unlocked: ["none"] };
  const value = stored as Record<string, unknown>;
  const next = { ...blankProfile, unlocked: ["none"] as Accessory[] };
  for (const key of [
    "visits",
    "lastSeen",
    "pets",
    "feeds",
    "naps",
    "hugs",
    "dances",
    "talks",
    "tickles",
    "love",
    "bestCatch",
    "catchGames",
    "bubbleGames",
  ] as const) {
    const number = value[key];
    if (typeof number === "number" && Number.isFinite(number) && number >= 0)
      next[key] = Math.min(Number.MAX_SAFE_INTEGER, Math.floor(number));
  }
  if (Array.isArray(value.unlocked))
    next.unlocked = [
      ...new Set([
        "none" as Accessory,
        ...value.unlocked.filter(
          (item): item is Accessory =>
            typeof item === "string" && accessoryIds.has(item as Accessory),
        ),
      ]),
    ];
  if (
    typeof value.accessory === "string" &&
    next.unlocked.includes(value.accessory as Accessory)
  )
    next.accessory = value.accessory as Accessory;
  return next;
}
function award(profile: MochiProfile): MochiProfile {
  const unlocked = new Set(profile.unlocked);
  if (profile.pets >= 3) unlocked.add("ribbon");
  if (profile.feeds >= 2) unlocked.add("beret");
  if (profile.naps >= 1) unlocked.add("nightcap");
  if (profile.hugs >= 1) unlocked.add("scarf");
  if (profile.bestCatch >= 3) unlocked.add("glasses");
  if (profile.bubbleGames >= 1) unlocked.add("flower");
  const legacy = readSaved<unknown>("found-mochis", []);
  if (
    Array.isArray(legacy) &&
    new Set(
      legacy.filter((item) => Number.isInteger(item) && item >= 0 && item < 4),
    ).size === 4
  )
    unlocked.add("crown");
  return {
    ...profile,
    love: Math.min(profile.love, 100),
    unlocked: [...unlocked],
  };
}

type CompanionState = {
  profile: MochiProfile;
  expression: string;
  sleeping: boolean;
  speech: string;
  snack: string | null;
  returning: boolean;
  announcement: string;
  care: (action: CareAction, snack?: { emoji: string; line: string }) => void;
  dress: (accessory: Accessory) => void;
  reactToMood: (mood: string) => void;
  recordGame: (game: "catch" | "bubble", score?: number) => void;
  syncDiscoveries: () => void;
  surprise: () => void;
  secretReady: boolean;
};
const CompanionContext = createContext<CompanionState | null>(null);
export function useCompanion() {
  const companion = useContext(CompanionContext);
  if (!companion) throw new Error("Pink Mochi needs its companion provider.");
  return companion;
}

export function CompanionProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState(() => award(getProfile()));
  const [returning] = useState(() => getProfile().visits > 0);
  const [expression, setExpression] = useState("happy");
  const [sleeping, setSleeping] = useState(false);
  const [speech, setSpeech] = useState(() =>
    getProfile().visits > 0
      ? "Maybe balik! Mochi udah siapin tempat paling empuk buat kamu ♡"
      : "Hey May! You got this! ✨ Mochi senang kamu mampir.",
  );
  const [snack, setSnack] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const registered = useRef(false);
  const reactionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSpeech = useRef<Partial<Record<CareAction, number>>>({});
  const knownAccessories = useRef(new Set(profile.unlocked));

  useEffect(() => {
    if (!registered.current) {
      registered.current = true;
      setProfile((previous) => ({
        ...previous,
        visits: previous.visits + 1,
        lastSeen: Date.now(),
      }));
    }
    if (returning) emotion("jump", 2600);
  }, []);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const rest = () => {
      if (timer) clearTimeout(timer);
      if (sleeping || document.hidden) return;
      timer = setTimeout(() => {
        care("sleep");
        setSpeech(
          "Zzz… kelincinya ketiduran. Sentuh pelan-pelan kalau mau ditemani lagi ♡",
        );
      }, 90000);
    };
    rest();
    window.addEventListener("pointerdown", rest, { passive: true });
    window.addEventListener("keydown", rest);
    document.addEventListener("visibilitychange", rest);
    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener("pointerdown", rest);
      window.removeEventListener("keydown", rest);
      document.removeEventListener("visibilitychange", rest);
    };
  }, [sleeping]);
  useEffect(() => {
    save("mochi-profile", profile);
    const newlyUnlocked = profile.unlocked.filter(
      (id) => !knownAccessories.current.has(id),
    );
    profile.unlocked.forEach((id) => knownAccessories.current.add(id));
    if (newlyUnlocked.length) {
      setAnnouncement(
        `Aksesorinya kebuka! ${newlyUnlocked.map((id) => accessories.find((item) => item.id === id)?.name).join(", ")} ♡`,
      );
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setAnnouncement(""), 6000);
    }
  }, [profile]);
  useEffect(
    () => () => {
      if (reactionTimer.current) clearTimeout(reactionTimer.current);
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    [],
  );

  function emotion(next: string, duration = 4200) {
    if (reactionTimer.current) clearTimeout(reactionTimer.current);
    setExpression(next);
    setSnack(null);
    reactionTimer.current = setTimeout(() => {
      setExpression("happy");
      setSnack(null);
    }, duration);
  }
  function care(action: CareAction, food?: { emoji: string; line: string }) {
    if (sleeping && action === "pet") {
      care("wake");
      return;
    }
    if (sleeping && action !== "wake" && action !== "sleep") {
      setSpeech(
        "Mochi lagi mimpi ketemu Maybe. Bangunkan pelan-pelan dulu, ya ♡",
      );
      return;
    }
    const phrases = mochiSpeech[action];
    const index = chooseOther(phrases.length, lastSpeech.current[action] ?? 0);
    lastSpeech.current[action] = index;
    setSpeech(food?.line ?? phrases[index]);
    if (action === "sleep") {
      if (reactionTimer.current) clearTimeout(reactionTimer.current);
      setSleeping(true);
      setExpression("sleeping");
      setSnack(null);
    } else {
      if (action === "wake") setSleeping(false);
      emotion(
        {
          pet:
            profile.pets % 10 === 9
              ? "dance"
              : ["blush", "jump", "kiss"][profile.pets % 3],
          feed: "eating",
          hug: "hug",
          dance: "dance",
          talk: "confused",
          tickle: "angry",
          kiss: "kiss",
          spin: "spin",
          hide: "hide",
          celebrate: "celebrate",
          wake: "jump",
        }[action],
      );
      if (food) setSnack(food.emoji);
    }
    setProfile((previous) => {
      const next = {
        ...previous,
        love: Math.min(100, previous.love + (action === "talk" ? 1 : 5)),
      };
      const field = (
        {
          pet: "pets",
          feed: "feeds",
          sleep: "naps",
          hug: "hugs",
          dance: "dances",
          talk: "talks",
          tickle: "tickles",
          kiss: null,
          spin: null,
          hide: null,
          celebrate: null,
          wake: null,
        } as const
      )[action];
      if (field) next[field]++;
      return award(next);
    });
  }
  function dress(accessory: Accessory) {
    if (!profile.unlocked.includes(accessory)) return;
    setProfile((previous) => ({ ...previous, accessory }));
    if (!sleeping) emotion("blush");
    setSpeech(
      accessory === "none"
        ? "Outfit paling original: jadi Mochi. Badge hati tetap wajib ♡"
        : `${accessories.find((item) => item.id === accessory)?.name} dipakai! Kata Radli: lucunya nambah, Maybe-nya tetep favorit.`,
    );
  }
  function reactToMood(mood: string) {
    setSleeping(false);
    emotion(mood, 7000);
    setSpeech(
      {
        happy: "MAYBE HAPPY! Mochi ikut lompat! 🥳",
        tired: "Kalau capek, kamar kecil ini siap jadi tempat istirahat.",
        sad: "Peluk dulu ya, May. Sedihnya boleh ditaruh di sini.",
        angry: "Mochi pasang muka galak buat nemenin kamu. Tetap nggak serem.",
        stress:
          "Satu tugas dulu. Mochi jagain camilannya, Radli jagain semangatnya.",
        mixed: "Nggak harus tahu nama perasaannya. Duduk bareng aja dulu.",
      }[mood] ?? mochiSpeech.talk[0],
    );
  }
  function recordGame(game: "catch" | "bubble", score = 0) {
    setProfile((previous) =>
      award({
        ...previous,
        love: previous.love + 5,
        bestCatch:
          game === "catch"
            ? Math.max(previous.bestCatch, score)
            : previous.bestCatch,
        catchGames: previous.catchGames + (game === "catch" ? 1 : 0),
        bubbleGames: previous.bubbleGames + (game === "bubble" ? 1 : 0),
      }),
    );
    if (!sleeping) emotion("jump");
    setSpeech(
      "Mochi tepuk tangan pakai telinga. Prestasi May harus dirayakan ♡",
    );
  }
  function syncDiscoveries() {
    setProfile((previous) => award(previous));
  }
  function surprise() {
    if (sleeping) care("wake");
    else {
      care("talk");
      emotion("jump");
    }
  }
  const secretReady =
    profile.pets > 0 &&
    profile.feeds > 0 &&
    profile.naps > 0 &&
    profile.hugs > 0 &&
    profile.dances > 0;
  return (
    <CompanionContext.Provider
      value={{
        profile,
        expression,
        sleeping,
        speech,
        snack,
        returning,
        announcement,
        care,
        dress,
        reactToMood,
        recordGame,
        syncDiscoveries,
        surprise,
        secretReady,
      }}
    >
      {children}
    </CompanionContext.Provider>
  );
}
