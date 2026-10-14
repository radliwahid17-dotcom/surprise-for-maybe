import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { readSaved, save, localDay } from "../storage";
import {
  eggs,
  fragmentIds,
  fragments,
  stickers,
  type FragmentId,
} from "./data";

export type PlantKind =
  | "tulip"
  | "daisy"
  | "lavender"
  | "sunflower"
  | "moonflower";
export type Plant = {
  id: string;
  kind: PlantKind;
  name: string;
  stage: number;
  water: number;
};
type Deck = "fortune" | "bottle" | "popup" | "capsule";
export type Progress = {
  version: 2;
  visits: number;
  stickers: string[];
  fragments: FragmentId[];
  eggs: string[];
  plants: Plant[];
  letters: number[];
  stats: Record<string, number>;
  decks: Record<Deck, number[]>;
  effects: boolean;
  autoPopups: boolean;
  night: boolean;
};
const plantKinds: PlantKind[] = [
  "tulip",
  "daisy",
  "lavender",
  "sunflower",
  "moonflower",
];
const stickerIds = new Set(stickers.map((s) => s.id));
const eggIds = new Set(eggs.map((e) => e.id));
const count = (v: unknown) =>
  typeof v === "number" && Number.isFinite(v)
    ? Math.max(0, Math.min(999999, Math.floor(v)))
    : 0;
const strings = (v: unknown, ids: Set<string>) =>
  Array.isArray(v)
    ? [
        ...new Set(
          v.filter((s): s is string => typeof s === "string" && ids.has(s)),
        ),
      ]
    : [];
function loadProgress(): Progress {
  const legacy = readSaved<{ visits?: number }>("mochi-profile", {});
  const blank: Progress = {
    version: 2,
    visits: count(legacy?.visits),
    stickers: [],
    fragments: [],
    eggs: [],
    plants: [],
    letters: [],
    stats: {},
    decks: { fortune: [], bottle: [], popup: [], capsule: [] },
    effects: true,
    autoPopups: true,
    night: false,
  };
  const raw = readSaved<unknown>("universe-v2", null);
  if (!raw || typeof raw !== "object") return blank;
  const v = raw as Record<string, unknown>;
  blank.visits = count(v.visits);
  blank.stickers = strings(v.stickers, stickerIds);
  blank.fragments = strings(v.fragments, new Set(fragmentIds)) as FragmentId[];
  blank.eggs = strings(v.eggs, eggIds);
  blank.letters = Array.isArray(v.letters)
    ? [
        ...new Set(
          v.letters.filter(
            (n): n is number => Number.isInteger(n) && n >= 0 && n < 7,
          ),
        ),
      ]
    : [];
  if (v.stats && typeof v.stats === "object")
    for (const [key, value] of Object.entries(v.stats))
      if (/^[a-z-]{1,30}$/.test(key)) blank.stats[key] = count(value);
  if (v.decks && typeof v.decks === "object")
    for (const key of ["fortune", "bottle", "popup", "capsule"] as Deck[]) {
      const values = (v.decks as Record<string, unknown>)[key];
      blank.decks[key] = Array.isArray(values)
        ? [
            ...new Set(
              values.filter(
                (n): n is number => Number.isInteger(n) && n >= 0 && n < 100,
              ),
            ),
          ]
        : [];
    }
  if (Array.isArray(v.plants)) {
    const seen = new Set<string>();
    for (const p of v.plants.slice(0, 6)) {
      if (
        !p ||
        typeof p !== "object" ||
        typeof p.id !== "string" ||
        p.id.length > 80 ||
        seen.has(p.id) ||
        !plantKinds.includes(p.kind) ||
        typeof p.name !== "string"
      )
        continue;
      seen.add(p.id);
      blank.plants.push({
        id: p.id,
        kind: p.kind,
        name: p.name.slice(0, 24) || "Little flower",
        stage: Math.min(3, count(p.stage)),
        water: count(p.water),
      });
    }
  }
  blank.effects = v.effects !== false;
  blank.autoPopups = v.autoPopups !== false;
  blank.night = v.night === true;
  return blank;
}
type Toast = { title: string; text: string; id: number };
type World = {
  progress: Progress;
  day: ReturnType<typeof localDay>;
  toast: Toast | null;
  award: (id: string) => boolean;
  egg: (id: string) => boolean;
  fragment: (id: FragmentId) => void;
  bump: (key: string, amount?: number) => number;
  draw: (deck: Deck, total: number) => number;
  readLetter: (index: number) => void;
  plant: (kind: PlantKind, name: string) => void;
  water: (id: string) => void;
  rename: (id: string, name: string) => void;
  graft: (id: string) => void;
  setting: (key: "effects" | "autoPopups" | "night", value: boolean) => void;
  notify: (title: string, text: string) => void;
};
const WorldContext = createContext<World | null>(null);
export function useUniverse() {
  const world = useContext(WorldContext);
  if (!world) throw new Error("MAYBEVERSE needs its universe provider.");
  return world;
}
export function UniverseProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState(loadProgress);
  const current = useRef(progress);
  const [day, setDay] = useState(localDay);
  const [toast, setToast] = useState<Toast | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const booted = useRef(false);
  const serial = useRef(0);
  const commit = useCallback((change: (p: Progress) => Progress) => {
    const next = change(current.current);
    current.current = next;
    setProgress(next);
    save("universe-v2", next);
  }, []);
  const notify = useCallback((title: string, text: string) => {
    setToast({ title, text, id: ++serial.current });
  }, []);
  const award = useCallback(
    (id: string) => {
      if (!stickerIds.has(id) || current.current.stickers.includes(id))
        return false;
      commit((p) => ({ ...p, stickers: [...p.stickers, id] }));
      const item = stickers.find((s) => s.id === id)!;
      notify("A tiny sticker found", item.name + " — " + item.description);
      return true;
    },
    [commit, notify],
  );
  const egg = useCallback(
    (id: string) => {
      if (!eggIds.has(id) || current.current.eggs.includes(id)) return false;
      commit((p) => ({ ...p, eggs: [...p.eggs, id] }));
      const item = eggs.find((e) => e.id === id)!;
      award("sleuth");
      notify("Psst… a little secret!", item.name);
      return true;
    },
    [commit, award, notify],
  );
  const fragment = useCallback(
    (id: FragmentId) => {
      if (current.current.fragments.includes(id)) return;
      commit((p) => ({ ...p, fragments: [...p.fragments, id] }));
      notify(fragments[id].name, fragments[id].line);
      if (current.current.fragments.length === 7) {
        award("universe");
        notify(
          "Seven little stars, one little letter",
          "Secret chapter sudah terbuka. Kamu bisa membacanya kapan saja.",
        );
      }
    },
    [commit, notify, award],
  );
  const bump = useCallback(
    (key: string, amount = 1) => {
      const next = count((current.current.stats[key] || 0) + amount);
      commit((p) => ({ ...p, stats: { ...p.stats, [key]: next } }));
      return next;
    },
    [commit],
  );
  const draw = useCallback(
    (deck: Deck, total: number) => {
      const history = current.current.decks[deck];
      const candidates = Array.from({ length: total }, (_, i) => i).filter(
        (i) => !history.includes(i),
      );
      const pool = candidates.length
        ? candidates
        : Array.from({ length: total }, (_, i) => i).filter(
            (i) => i !== history.at(-1),
          );
      const index = pool[Math.floor(Math.random() * pool.length)] ?? 0;
      commit((p) => ({
        ...p,
        decks: {
          ...p.decks,
          [deck]: [...(candidates.length ? history : []), index],
        },
        stats: { ...p.stats, [deck]: count((p.stats[deck] || 0) + 1) },
      }));
      return index;
    },
    [commit],
  );
  const readLetter = useCallback(
    (index: number) => {
      if (current.current.letters.includes(index)) return;
      commit((p) => ({ ...p, letters: [...p.letters, index] }));
      if (current.current.letters.length === 7) {
        award("student");
        egg("all-letters");
        notify(
          "Every word, kept",
          "Ketujuh surat sudah dibaca. Radli senang kata-katanya sampai ke kamu.",
        );
      }
    },
    [commit, award, egg, notify],
  );
  const plant = useCallback(
    (kind: PlantKind, name: string) => {
      if (
        current.current.plants.length >= 6 ||
        (kind === "moonflower" && current.current.visits < 3)
      )
        return;
      const safe = name.trim().slice(0, 24) || "Little flower";
      const p: Plant = {
        id: Date.now().toString(36) + "-" + ++serial.current,
        kind,
        name: safe,
        stage: 0,
        water: 0,
      };
      commit((v) => ({ ...v, plants: [...v.plants, p] }));
      award("gardener");
      if (safe.toLowerCase() === "radli") {
        egg("garden-name");
        notify(
          "Radli grows here too",
          "Bunganya belum mekar, tapi gua sudah seneng dikasih tempat. — Radli",
        );
      }
    },
    [commit, award, egg, notify],
  );
  const water = useCallback(
    (id: string) => {
      const existing = current.current.plants.find((p) => p.id === id);
      if (!existing) return;
      const stage = Math.min(3, existing.stage + 1);
      commit((p) => ({
        ...p,
        plants: p.plants.map((plant) =>
          plant.id === id ? { ...plant, stage, water: plant.water + 1 } : plant,
        ),
      }));
      award("water");
      if (stage === 3) award("bloom");
    },
    [commit, award],
  );
  const rename = useCallback(
    (id: string, name: string) => {
      const safe = name.trim().slice(0, 24);
      if (!safe) return;
      commit((p) => ({
        ...p,
        plants: p.plants.map((plant) =>
          plant.id === id ? { ...plant, name: safe } : plant,
        ),
      }));
      if (safe.toLowerCase() === "radli") {
        egg("garden-name");
        notify(
          "A little name, a big smile",
          "Gua ditanam di taman lu? Oke, gua janji nggak rebutan air sama bunga. — Radli",
        );
      }
    },
    [commit, egg, notify],
  );
  const setting = useCallback(
    (key: "effects" | "autoPopups" | "night", value: boolean) =>
      commit((p) => ({ ...p, [key]: value })),
    [commit],
  );
  const graft = useCallback(
    (id: string) => {
      if (current.current.visits < 3) return;
      commit((p) => ({
        ...p,
        plants: p.plants.map((plant) =>
          plant.id === id ? { ...plant, kind: "moonflower" as const } : plant,
        ),
      }));
    },
    [commit],
  );
  useEffect(() => {
    if (!booted.current) {
      booted.current = true;
      commit((p) => ({ ...p, visits: count(p.visits + 1) }));
      award("cutie");
    }
    const timer = setInterval(() => setDay(localDay()), 60000);
    return () => clearInterval(timer);
  }, [commit, award]);
  useEffect(() => {
    if (!toast) return;
    toastTimer.current = setTimeout(() => setToast(null), 5500);
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, [toast]);
  useEffect(() => {
    document.documentElement.dataset.effects = progress.effects
      ? "full"
      : "calm";
    return () => {
      delete document.documentElement.dataset.effects;
    };
  }, [progress.effects]);
  return (
    <WorldContext.Provider
      value={{
        progress,
        day,
        toast,
        award,
        egg,
        fragment,
        bump,
        draw,
        readLetter,
        plant,
        water,
        rename,
        graft,
        setting,
        notify,
      }}
    >
      {children}
    </WorldContext.Provider>
  );
}
