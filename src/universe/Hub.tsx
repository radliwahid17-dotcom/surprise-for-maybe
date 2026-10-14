import { useRef } from "react";
import {
  ArrowRight,
  BookHeart,
  Heart,
  Home,
  Map,
  Settings2,
  Sparkles,
  Star,
} from "lucide-react";
import { Mochi } from "../Mochi";
import { useCompanion } from "../Companion";
import { useUniverse } from "./Universe";
import {
  dailyCompliments,
  dailyDialogues,
  fragments,
  fragmentIds,
  stickers,
  eggs,
  type StickerKind,
} from "./data";
import { ToyIcon } from "./Illustrations";
export type ExperienceId =
  | "hug"
  | "fortune"
  | "garden"
  | "capsule"
  | "album"
  | "happy"
  | "sky"
  | "bottle"
  | "delivery"
  | "settings"
  | "chapter"
  | "giant";
const destinations: {
  id: ExperienceId | "emergency" | "mood";
  name: string;
  tag: string;
  description: string;
  kind: StickerKind;
  color: string;
}[] = [
  {
    id: "garden",
    name: "Maybe’s little garden",
    tag: "GROW SOMETHING SOFT",
    description: "Satu benih, satu nama, satu hal kecil yang tumbuh.",
    kind: "flower",
    color: "mint",
  },
  {
    id: "hug",
    name: "The hug machine",
    tag: "NO REASON REQUIRED",
    description: "Tiny, big, atau super mega. Peluknya selalu ada.",
    kind: "heart",
    color: "pink",
  },
  {
    id: "fortune",
    name: "Mochi’s fortune cookie",
    tag: "A LITTLE CRUNCH",
    description: "Ramalan absurd dan kalimat yang hangat.",
    kind: "cookie",
    color: "butter",
  },
  {
    id: "capsule",
    name: "The cuteness capsule",
    tag: "FREE LITTLE TREASURES",
    description: "Putar mesin. Ada hadiah kecil buat Maybe.",
    kind: "crown",
    color: "peach",
  },
  {
    id: "happy",
    name: "Make Mochi happy",
    tag: "LISTEN TO THE BUNNY",
    description: "Lima keinginan kelinci yang sangat random.",
    kind: "bunny",
    color: "lavender",
  },
  {
    id: "sky",
    name: "A little night sky",
    tag: "YOUR NAME UP THERE",
    description: "Sentuh bintang. Mungkin ada surat buatmu.",
    kind: "telescope",
    color: "blue",
  },
  {
    id: "bottle",
    name: "Message in a bottle",
    tag: "SIGNED, RADLI",
    description: "Catatan kecil yang sengaja sampai ke kamu.",
    kind: "letter",
    color: "pink",
  },
  {
    id: "album",
    name: "The sticker collection",
    tag: "KEEP THE LITTLE THINGS",
    description: "Stiker, pencapaian, dan rahasia yang ditemukan.",
    kind: "book",
    color: "lavender",
  },
  {
    id: "delivery",
    name: "Mochi’s surprise post",
    tag: "UNEXPECTED BUNNY MAIL",
    description: "Berita lucu dari kantor pos dua telinga.",
    kind: "coffee",
    color: "peach",
  },
  {
    id: "emergency",
    name: "Emergency happiness",
    tag: "WHEN THE DAY IS A LOT",
    description: "IN CASE OF BAD MOOD, PRESS THIS!",
    kind: "shield",
    color: "butter",
  },
  {
    id: "mood",
    name: "The mood rescue room",
    tag: "EVERY FEELING WELCOME",
    description: "Satu ruangan kecil untuk perasaan hari ini.",
    kind: "cloud",
    color: "blue",
  },
  {
    id: "settings",
    name: "Make yourself cozy",
    tag: "YOUR WORLD, YOUR PACE",
    description: "Atur suara, gerakan, lampu, dan kejutan.",
    kind: "moon",
    color: "mint",
  },
];
export function UniverseHub({
  onOpen,
  onEmergency,
  onMood,
}: {
  onOpen: (id: ExperienceId) => void;
  onEmergency: () => void;
  onMood: () => void;
}) {
  const world = useUniverse();
  const mochi = useCompanion();
  const taps = useRef(0);
  return (
    <section
      className="universe-hub section-wrap"
      id="explore"
      aria-labelledby="explore-title"
    >
      <div className="section-title-row">
        <div>
          <span className="eyebrow">
            MAYBE’S LITTLE NEIGHBORHOOD · CHAPTER 02
          </span>
          <h2 id="explore-title">
            A whole little world. <em>Just for you.</em>
          </h2>
          <p>Pilih petualangan kecil. Nggak ada urutan yang harus benar.</p>
        </div>
        <button
          className="world-settings-shortcut"
          aria-label="Buka pengaturan dunia kecil"
          aria-describedby="world-comfort-tooltip"
          onClick={() => onOpen("settings")}
        >
          <Settings2 size={19} />
          <span
            className="world-tooltip"
            id="world-comfort-tooltip"
            role="tooltip"
          >
            Suara, lampu, dan tempat yang nyaman.
          </span>
        </button>
      </div>
      <div className="world-daily">
        <div className="daily-bunny">
          <Mochi expression="happy" accessory={mochi.profile.accessory} />
          <span>{world.day.label}</span>
        </div>
        <div>
          <span className="eyebrow">MOCHI’S DAILY LITTLE CHAOS</span>
          <p>{dailyDialogues[world.day.index % dailyDialogues.length]}</p>
        </div>
        <div className="daily-compliment">
          <span className="eyebrow">ONE COMPLIMENT, KEPT SOFTLY</span>
          <p>{dailyCompliments[world.day.index % dailyCompliments.length]}</p>
        </div>
      </div>
      <div className="little-passport">
        <span>
          <BookHeart size={16} />
          {world.progress.stickers.length}/{stickers.length} little stickers
        </span>
        <span>
          <Star size={16} />
          {world.progress.fragments.length}/7 story stars
        </span>
        <span>
          <Sparkles size={16} />
          {world.progress.eggs.length}/{eggs.length} little secrets
        </span>
        <button
          aria-label="Ketuk drum kelinci"
          onClick={() => {
            taps.current++;
            mochi.care("spin");
            if (taps.current % 3 === 0) {
              world.egg("tap-rhythm");
              world.notify(
                "Tap, tap, tiny chaos!",
                "Tiga ketukan membuka secret rhythm. Telinga kiri masih belajar beat.",
              );
            }
          }}
        >
          tap, tap, tap ♡
        </button>
      </div>
      <div className="world-destinations">
        {destinations.map((d, i) => (
          <button
            key={d.id}
            className={"world-destination world-card-" + d.color}
            onClick={() =>
              d.id === "emergency"
                ? onEmergency()
                : d.id === "mood"
                  ? onMood()
                  : onOpen(d.id)
            }
          >
            <span className="world-card-number">0{(i % 9) + 1}</span>
            <span className="world-card-art">
              {d.kind === "bunny" ? (
                <Mochi expression="blush" accessory="ribbon" />
              ) : (
                <ToyIcon kind={d.kind} />
              )}
            </span>
            <span className="world-card-tag">{d.tag}</span>
            <h3>{d.name}</h3>
            <p>{d.description}</p>
            <span className="world-card-open">
              step inside <ArrowRight size={13} />
            </span>
          </button>
        ))}
      </div>
      <div
        className={
          "seven-star-passport " +
          (world.progress.fragments.length === 7 ? "complete" : "")
        }
      >
        <div>
          <span className="eyebrow">A LITTLE STORY, HIDDEN IN PLAIN SIGHT</span>
          <h3>Seven stars. One letter.</h3>
          <p>
            Beberapa cerita disimpan di cookie, peluk, taman, hadiah, game,
            langit, dan botol kecil.
          </p>
        </div>
        <div className="story-star-row">
          {fragmentIds.map((id) => (
            <span
              role="img"
              key={id}
              className={world.progress.fragments.includes(id) ? "found" : ""}
              title={fragments[id].hint}
              aria-label={
                fragments[id].name +
                (world.progress.fragments.includes(id)
                  ? ", collected"
                  : ", " + fragments[id].hint)
              }
            >
              <Star size={21} fill="currentColor" />
            </span>
          ))}
        </div>
        <button
          className="primary-button"
          disabled={world.progress.fragments.length < 7}
          onClick={() => onOpen("chapter")}
        >
          {world.progress.fragments.length === 7
            ? "Open our secret chapter"
            : world.progress.fragments.length + "/7 little stars found"}
          <MailIcon />
        </button>
      </div>
    </section>
  );
}
function MailIcon() {
  return <Heart size={15} />;
}
export function WorldToast() {
  const world = useUniverse();
  return world.toast ? (
    <aside className="world-toast" role="status" key={world.toast.id}>
      <Star size={19} />
      <div>
        <b>{world.toast.title}</b>
        <p>{world.toast.text}</p>
      </div>
    </aside>
  ) : null;
}
export function MobileNavigation({ onAlbum }: { onAlbum: () => void }) {
  return (
    <nav className="mobile-world-nav" aria-label="Navigasi dunia kecil">
      <a href="#">
        <Home size={18} />
        <span>Home</span>
      </a>
      <a href="#mochi-room">
        <Heart size={18} />
        <span>Mochi</span>
      </a>
      <a href="#explore">
        <Map size={18} />
        <span>Explore</span>
      </a>
      <button onClick={onAlbum}>
        <BookHeart size={18} />
        <span>Saved</span>
      </button>
    </nav>
  );
}
