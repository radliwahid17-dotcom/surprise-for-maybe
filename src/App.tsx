import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { AnimatePresence, MotionConfig, useReducedMotion } from "motion/react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Check,
  Gift,
  Heart,
  Mail,
  Moon,
  RotateCw,
  Sparkles,
  Star,
  Sun,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Cat, Daisy, LogoStar, Mochi } from "./Mochi";
import Modal from "./Modal";
import { BubbleGame, CatchGame } from "./Games";
import {
  finalLetter,
  moods,
  notes,
  secretNote,
  sunshine,
  surprises,
  type Effect,
  type Message,
} from "./data";
import { chooseOther, localDay, readSaved, save } from "./storage";

type OpenModal =
  | { type: "welcome" }
  | { type: "message"; message: Message }
  | { type: "note"; index: number }
  | { type: "secret" }
  | { type: "catch" }
  | { type: "bubble" }
  | { type: "find" };
type Celebration = { type: Effect; id: number };
const secretMessages = [
  "Mochi nyasar di sini gara-gara nyium aroma cemilan. Pesan rahasianya: makan dulu, May!",
  "Ketemu! Mochi lagi sembunyi dari deadline. Katanya: lu keren bahkan pas lagi capek.",
  "Mochi bawa satu pesan dari Radli: gua seneng lu ada. Beneran.",
  "Mochi suka sudut tenang ini. Dia cuma pengen bilang: May, gua bangga sama lu.",
];

function OverlayPresence({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  return reduceMotion ? (
    <>{children}</>
  ) : (
    <AnimatePresence mode="wait">{children}</AnimatePresence>
  );
}

function Effects({ celebration }: { celebration: Celebration | null }) {
  if (!celebration) return null;
  const tokens =
    celebration.type === "hearts" || celebration.type === "hug"
      ? ["♥", "♡", "♥"]
      : celebration.type === "meteor" || celebration.type === "stars"
        ? ["✦", "★", "✧"]
        : celebration.type === "cat"
          ? ["♡", "✦", "🐾"]
          : ["●", "✦", "♥", "▰"];
  return (
    <div
      className={`effects effect-${celebration.type}`}
      key={celebration.id}
      aria-hidden="true"
    >
      {Array.from({ length: 32 }, (_, index) => (
        <span
          className="particle"
          key={index}
          style={
            {
              "--x": `${(index * 37 + 11) % 100}%`,
              "--drift": `${((index * 41) % 240) - 120}px`,
              "--delay": `${(index % 9) * 0.09}s`,
              "--rotation": `${index * 23}deg`,
              "--color": [
                "#ee91a5",
                "#e1ba63",
                "#a799ca",
                "#96bfa8",
                "#edbb97",
              ][index % 5],
            } as CSSProperties
          }
        >
          {tokens[index % tokens.length]}
        </span>
      ))}
    </div>
  );
}

function ReactionArt({
  effect,
  expression,
}: {
  effect: Effect;
  expression?: string;
}) {
  if (effect === "cat") return <Cat />;
  if (effect === "hug")
    return (
      <div className="hug-art">
        <Mochi />
        <Mochi className="mochi-friend" />
        <Heart className="hug-heart" fill="currentColor" />
      </div>
    );
  return (
    <Mochi
      className={effect === "dance" ? "dancing" : "bob"}
      expression={expression}
      superhero={effect === "meteor"}
    />
  );
}

export default function App() {
  const [modal, setModal] = useState<OpenModal | null>(null);
  const [welcomeAnswer, setWelcomeAnswer] = useState<string | null>(null);
  const [soundOn, setSoundOn] = useState(
    () => readSaved<boolean>("sound", false) === true,
  );
  const [mood, setMood] = useState<string | null>(() => {
    const value = readSaved<unknown>("mood", null);
    return typeof value === "string" && moods.some((item) => item.id === value)
      ? value
      : null;
  });
  const [discovered, setDiscovered] = useState<string[]>(() => {
    const value = readSaved<unknown>("discoveries", []);
    return Array.isArray(value)
      ? value.filter((item): item is string => typeof item === "string")
      : [];
  });
  const [found, setFound] = useState<number[]>(() => {
    const value = readSaved<unknown>("found-mochis", []);
    return Array.isArray(value)
      ? [
          ...new Set(
            value.filter(
              (item): item is number =>
                Number.isInteger(item) && item >= 0 && item < 4,
            ),
          ),
        ]
      : [];
  });
  const [hunt, setHunt] = useState(false);
  const [day, setDay] = useState(localDay);
  const [dailyIndex, setDailyIndex] = useState(
    () => localDay().index % sunshine.length,
  );
  const [celebration, setCelebration] = useState<Celebration | null>(null);
  const [secretInput, setSecretInput] = useState("");
  const [secretHint, setSecretHint] = useState("");
  const [final, setFinal] = useState(
    () => window.location.hash === "#one-last-thing",
  );
  const [hugging, setHugging] = useState(false);
  const [installEvent, setInstallEvent] = useState<
    | (Event & {
        prompt: () => Promise<void>;
        userChoice: Promise<{ outcome: string }>;
      })
    | null
  >(null);
  const audio = useRef<AudioContext | null>(null);
  const mochiTaps = useRef(0);
  const heartTaps = useRef(0);
  const previousSurprise = useRef(-1);
  const effectsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hugTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastNavigation = useRef(false);
  const finalHeading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!readSaved("welcomed", false)) {
      const timer = setTimeout(() => setModal({ type: "welcome" }), 650);
      return () => clearTimeout(timer);
    }
  }, []);
  useEffect(() => {
    const timer = setInterval(() => {
      const next = localDay();
      setDay((previous) => {
        if (previous.key !== next.key) {
          setDailyIndex(next.index % sunshine.length);
          return next;
        }
        return previous;
      });
    }, 60000);
    const onHash = () => {
      lastNavigation.current = true;
      setFinal(window.location.hash === "#one-last-thing");
    };
    const onInstall = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as typeof installEvent);
    };
    window.addEventListener("hashchange", onHash);
    window.addEventListener("beforeinstallprompt", onInstall);
    return () => {
      clearInterval(timer);
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("beforeinstallprompt", onInstall);
      if (effectsTimer.current) clearTimeout(effectsTimer.current);
      if (hugTimer.current) clearTimeout(hugTimer.current);
    };
  }, []);
  useEffect(() => {
    if (lastNavigation.current) {
      window.scrollTo({ top: 0, behavior: "instant" });
      if (final) finalHeading.current?.focus({ preventScroll: true });
      else
        document.getElementById("hero-title")?.focus({ preventScroll: true });
      lastNavigation.current = false;
    }
  }, [final]);

  const playSound = useCallback(
    (kind: "pop" | "sparkle" | "note" = "sparkle", force = false) => {
      if (!soundOn && !force) return;
      try {
        const AudioConstructor =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext;
        if (!AudioConstructor) return;
        audio.current ??= new AudioConstructor();
        const context = audio.current;
        if (context.state === "suspended")
          void context.resume().catch(() => {});
        const now = context.currentTime;
        const frequencies =
          kind === "pop"
            ? [600, 400]
            : kind === "note"
              ? [523.25, 659.25, 783.99]
              : [659.25, 880, 1046.5];
        frequencies.forEach((frequency, index) => {
          const oscillator = context.createOscillator();
          const gain = context.createGain();
          oscillator.type = "sine";
          oscillator.frequency.setValueAtTime(frequency, now + index * 0.075);
          gain.gain.setValueAtTime(0, now + index * 0.075);
          gain.gain.linearRampToValueAtTime(0.055, now + index * 0.075 + 0.015);
          gain.gain.exponentialRampToValueAtTime(
            0.001,
            now + index * 0.075 + 0.19,
          );
          oscillator.connect(gain);
          gain.connect(context.destination);
          oscillator.start(now + index * 0.075);
          oscillator.stop(now + index * 0.075 + 0.2);
          oscillator.onended = () => {
            oscillator.disconnect();
            gain.disconnect();
          };
        });
      } catch {
        /* Audio is a bonus; all interactions still work without it. */
      }
    },
    [soundOn],
  );

  function celebrate(type: Effect = "confetti") {
    if (effectsTimer.current) clearTimeout(effectsTimer.current);
    setCelebration({ type, id: Date.now() });
    effectsTimer.current = setTimeout(() => setCelebration(null), 4200);
  }
  function reveal(message: Message) {
    playSound();
    celebrate(message.effect);
    setModal({ type: "message", message });
  }
  function discover(key: string) {
    setDiscovered((previous) => {
      const next = [...new Set([...previous, key])];
      save("discoveries", next);
      return next;
    });
  }
  function closeModal() {
    if (modal?.type === "welcome") save("welcomed", true);
    setModal(null);
  }
  function surprise() {
    const index = chooseOther(surprises.length, previousSurprise.current);
    previousSurprise.current = index;
    reveal(surprises[index]);
  }
  function findMochi(index: number) {
    if (found.includes(index)) return;
    const next = [...found, index];
    setFound(next);
    save("found-mochis", next);
    setHunt(true);
    if (next.length === 4) discover("find-mochi");
    reveal({
      title:
        next.length === 4
          ? "The whole Mochi crew is home! 🥳"
          : "Psst… kamu nemuin Mochi!",
      text: `${secretMessages[index]}\n\n${next.length} dari 4 Mochi ditemukan${next.length === 4 ? ". Misi selesai, detektif May!" : ". Masih ada teman kecil di sudut lain."}`,
      emoji: "🌟",
      effect: next.length === 4 ? "confetti" : "stars",
    });
  }
  function HiddenMochi({
    index,
    className = "",
  }: {
    index: number;
    className?: string;
  }) {
    return (
      <button
        className={`hidden-mochi ${className} ${found.includes(index) ? "found" : ""}`}
        aria-label={
          found.includes(index)
            ? `Mochi ${index + 1} sudah ditemukan`
            : `Mochi tersembunyi ${index + 1}`
        }
        disabled={found.includes(index)}
        onClick={() => findMochi(index)}
      >
        {found.includes(index) ? <Check size={18} /> : <Mochi />}
      </button>
    );
  }
  const selectedMood = moods.find((item) => item.id === mood);
  function openFinal() {
    window.location.hash = "one-last-thing";
    playSound("note");
  }
  function sendHug() {
    playSound("note");
    celebrate("hearts");
    setHugging(true);
    if (hugTimer.current) clearTimeout(hugTimer.current);
    hugTimer.current = setTimeout(() => setHugging(false), 5000);
  }

  return (
    <MotionConfig reducedMotion="user">
      <div id="page" className={final ? "final-page" : ""}>
        <header className="site-header">
          <div className="header-inner">
            <a
              href="#"
              className="brand"
              aria-label="MAYBEVERSE, halaman utama"
            >
              <LogoStar className="brand-star" />
              <span>
                MAYBEVERSE<small>a little world, just for you</small>
              </span>
            </a>
            {!final && (
              <nav aria-label="Navigasi utama">
                <a href="#mood">Your mood</a>
                <a href="#letters">Love notes</a>
                <a href="#play">Little joys</a>
              </nav>
            )}
            <div className="header-actions">
              <button
                className={`sound-toggle ${soundOn ? "enabled" : ""}`}
                aria-pressed={soundOn}
                aria-label={soundOn ? "Matikan suara" : "Aktifkan suara"}
                onClick={() => {
                  const next = !soundOn;
                  setSoundOn(next);
                  save("sound", next);
                  if (next) playSound("sparkle", true);
                  else void audio.current?.suspend().catch(() => {});
                }}
              >
                {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
                <span>Sound {soundOn ? "on" : "off"}</span>
              </button>
              <button
                className="header-heart icon-button"
                aria-label="Kirim hati untuk Radli"
                onClick={() => {
                  heartTaps.current++;
                  playSound("pop");
                  celebrate("hearts");
                  if (heartTaps.current % 10 === 0) {
                    discover("ten-hearts");
                    reveal({
                      title: "OKE OKE I LOVE YOU TOO 😭",
                      text: "Sepuluh hati diterima. Radli pura-pura kalem, padahal udah senyum dari tadi. Terima kasih, May ♡",
                      emoji: "💗",
                      effect: "hearts",
                    });
                  }
                }}
              >
                <Heart size={20} />
              </button>
            </div>
          </div>
        </header>

        {!final ? (
          <main>
            <section className="hero section-wrap" aria-labelledby="hero-title">
              <div className="hero-copy">
                <div className="eyebrow hero-eyebrow">
                  <span className="tiny-star">✦</span> A TINY UNIVERSE MADE JUST
                  FOR YOU
                </div>
                <h1 id="hero-title" tabIndex={-1}>
                  A little happiness,
                  <br />
                  just for <em>Maybe.</em>
                  <svg
                    className="title-heart"
                    viewBox="0 0 64 66"
                    aria-hidden="true"
                  >
                    <path
                      d="M30 55C24 44 3 29 8 15C12 3 29 5 31 20C36 5 55 6 56 20C57 35 36 44 30 55Z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <path
                      d="M51 47L56 52M58 38L63 39"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </h1>
                <p className="hero-welcome">
                  Welcome to your little universe, Maybe! 🌷
                </p>
                <p className="hero-description">
                  Di sini kamu nggak perlu jadi siapa-siapa. Cukup jadi Maybe,
                  <br className="desktop-break" /> dan biarin dunia kecil ini
                  bikin kamu senyum hari ini.
                </p>
                <div className="hero-buttons">
                  <a className="primary-button" href="#mood">
                    A little happiness, please <ArrowDown size={17} />
                  </a>
                  <span className="handwritten">you deserve it ♡</span>
                </div>
                <div className="from-radli">
                  <span className="from-avatar">R</span>
                  <span>
                    From Radli, <b>your biggest supporter.</b> ♡
                  </span>
                </div>
              </div>
              <div
                className="hero-art"
                aria-label="Dunia kecil Mochi di antara awan, bunga, dan hati"
              >
                <div className="art-orbit" />
                <div className="art-arch">
                  <div className="arch-grid" />
                  <div className="cloud art-cloud-one" />
                  <div className="cloud art-cloud-two" />
                  <span className="arch-star s1">✧</span>
                  <span className="arch-star s2">✦</span>
                  <span className="arch-star s3">✧</span>
                  <div className="landscape landscape-back" />
                  <div className="landscape landscape-front" />
                  <div className="art-flower flower-left">
                    <Daisy />
                  </div>
                  <div className="art-flower flower-right">
                    <Daisy />
                  </div>
                </div>
                <span className="art-heart heart-one">♥</span>
                <span className="art-heart heart-two">♡</span>
                <span className="art-sparkle">✦</span>
                <div className="art-daisy">
                  <Daisy />
                </div>
                <button
                  className="hero-mochi"
                  aria-label="Sapa Mochi"
                  onClick={() => {
                    mochiTaps.current++;
                    playSound("pop");
                    if (mochiTaps.current % 5 === 0) {
                      discover("super-mochi");
                      reveal({
                        title: "IT’S A BIRD! IT’S A PLANE! IT’S… MOCHI!",
                        text: "Super Mochi hadir! Kekuatan supernya: bikin Maybe senyum dan nyembunyiin deadline selama 5 menit. Cape-nya dari selimut Radli.",
                        emoji: "🦸",
                        effect: "meteor",
                      });
                    }
                  }}
                >
                  <Mochi
                    superhero={discovered.includes("super-mochi")}
                    expression={mood ?? "happy"}
                  />
                </button>
                <div className="art-speech">
                  hi, May! <span>♡</span>
                </div>
                <div className="art-tag">
                  <span>✿</span> a pocket full of sunshine
                </div>
                <div className="art-note">
                  <span>special delivery</span>
                  <b>one happy little heart</b>
                  <small>for: Maybe · from: Radli</small>
                  <Heart size={22} fill="currentColor" />
                </div>
                <div className="meet-mochi">
                  meet Mochi{" "}
                  <svg viewBox="0 0 70 45" aria-hidden="true">
                    <path
                      d="M3 30Q40 48 55 5M45 9L56 3L61 14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <small>your tiny happiness buddy</small>
                </div>
              </div>
            </section>

            <div className="little-strip">
              <span>✦</span> no perfect days required <span>♡</span> just come
              as you are <span>✦</span> you’re safe in this little universe{" "}
              <span>♡</span>
              <HiddenMochi index={0} />
            </div>

            <section
              id="mood"
              className="mood-section section-wrap"
              aria-labelledby="mood-title"
            >
              <div className="section-title-row">
                <div>
                  <span className="eyebrow">FIRST, A LITTLE HEART CHECK</span>
                  <h2 id="mood-title">
                    How’s my Maybe today?{" "}
                    <span className="small-script">be honest ♡</span>
                  </h2>
                  <p>
                    Hey, May! How’s your little heart today? 🥹 Semua perasaan
                    boleh mampir di sini.
                  </p>
                </div>
                <div className="mood-doodle">
                  <Daisy />
                </div>
              </div>
              <div className="mood-options">
                {moods.map((item) => (
                  <button
                    key={item.id}
                    className={`mood-card ${item.color} ${mood === item.id ? "selected" : ""}`}
                    aria-pressed={mood === item.id}
                    aria-label={item.label}
                    onClick={() => {
                      setMood(item.id);
                      save("mood", item.id);
                      reveal(item);
                    }}
                  >
                    <span className="mood-emoji">{item.emoji}</span>
                    <span>{item.label}</span>
                    {mood === item.id && (
                      <span className="selected-check">
                        <Check size={11} />
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <p className="mood-footnote">
                {selectedMood
                  ? `Mood terakhir: ${selectedMood.label}. Berubah pikiran? Boleh pilih lagi kapan aja. ♡`
                  : "Nggak perlu dijelasin. Pilih aja yang paling terasa kayak kamu."}
              </p>
            </section>

            <section
              className="care-grid section-wrap"
              aria-label="Sedikit semangat hari ini"
            >
              <article className="sunshine-card">
                <div className="card-topline">
                  <span className="eyebrow">
                    <span>☀</span> DAILY LITTLE SUNSHINE
                  </span>
                  <span className="date-chip">{day.label}</span>
                </div>
                <h2>
                  A little reminder,
                  <br />
                  <em>for your little heart.</em>
                </h2>
                <p className="sunshine-label">
                  Today’s little reminder for Maybe 🌤️
                </p>
                <p className="daily-message" key={dailyIndex}>
                  “{sunshine[dailyIndex]}”
                </p>
                <div className="sunshine-bottom">
                  <button
                    className="text-button"
                    onClick={() => {
                      setDailyIndex((previous) =>
                        chooseOther(sunshine.length, previous),
                      );
                      playSound("note");
                    }}
                  >
                    <RotateCw size={14} /> Give me another one!
                  </button>
                  <span className="tiny-signature">— Radli ♡</span>
                </div>
                <Sun
                  className="sun-decoration"
                  strokeWidth={0.8}
                  aria-hidden="true"
                />
              </article>
              <article className="emergency-card">
                <span className="eyebrow">YOUR LITTLE EMERGENCY KIT</span>
                <div className="emergency-heading">
                  <h2>
                    World being
                    <br />a little too much?
                  </h2>
                  <div className="heart-bandage">
                    ♥<span>✚</span>
                  </div>
                </div>
                <p>
                  Oke, kita kasih hari kamu sedikit plot twist.
                  <br />
                  Satu pencetan. Satu kejutan. Banyak sayang.
                </p>
                <button className="emergency-button" onClick={surprise}>
                  <Heart size={19} fill="currentColor" />
                  <span>
                    PENCET KALO DUNIA
                    <br />
                    <b>LAGI NYEBELIN 😤💗</b>
                  </span>
                  <Sparkles size={20} />
                </button>
                <span className="emergency-fineprint">
                  use as often as your heart needs
                </span>
              </article>
            </section>

            <section
              id="letters"
              className="letters-section section-wrap"
              aria-labelledby="letters-title"
            >
              <div className="section-title-row">
                <div>
                  <span className="eyebrow">SOME WORDS, WRAPPED IN LOVE</span>
                  <h2 id="letters-title">
                    Love notes from Radli <Mail className="inline-icon" />
                  </h2>
                  <p>
                    Untuk hari yang berbeda-beda. Ada satu surat yang selalu
                    bisa kamu buka.
                  </p>
                </div>
                <span className="handwritten letter-hint">
                  a hug, but in words ↙
                </span>
              </div>
              <div className="letters-grid">
                {notes.map((note, index) => (
                  <button
                    className={`letter-card ${note.color}`}
                    key={note.id}
                    onClick={() => {
                      playSound("note");
                      setModal({ type: "note", index });
                    }}
                  >
                    <div className="envelope">
                      <div className="envelope-back" />
                      <div className="envelope-paper">dear May, ♡</div>
                      <div className="envelope-front" />
                      <div className="envelope-flap" />
                      <span className="envelope-seal">{note.emoji}</span>
                    </div>
                    <span className="letter-open">OPEN WHEN…</span>
                    <h3>{note.label}</h3>
                    <span className="letter-description">{note.eyebrow}</span>
                    <ArrowRight className="letter-arrow" size={15} />
                  </button>
                ))}
              </div>
              <div className="letters-afterword">
                <span>Every word meant. Every envelope yours.</span>
                <HiddenMochi index={1} />
              </div>
            </section>

            <section
              id="play"
              className="games-section section-wrap"
              aria-labelledby="games-title"
            >
              <div className="section-title-row">
                <div>
                  <span className="eyebrow">
                    LESS OVERTHINKING, MORE LITTLE JOYS
                  </span>
                  <h2 id="games-title">A tiny break from the big world.</h2>
                  <p>Seriusnya nanti lagi. Sekarang, main sebentar yuk?</p>
                </div>
                <LogoStar className="play-doodle" />
              </div>
              <div className="games-grid">
                <article className="game-card catch-card">
                  <div className="game-illustration">
                    <span className="mini-heart mh1">♥</span>
                    <span className="mini-heart mh2">♥</span>
                    <span className="mini-heart mh3">♡</span>
                    <div className="heart-basket">
                      ♡<div />
                    </div>
                    <span className="game-tag">30 SECONDS OF LOVE</span>
                  </div>
                  <div className="game-card-copy">
                    <span className="eyebrow">01 / COLLECT SOME HUGS</span>
                    <h3>Catch the Love</h3>
                    <p>
                      Hati-hati, banyak hati jatuh!
                      <br />
                      Tangkap sebanyak mungkin.
                    </p>
                    <button
                      className="game-button"
                      onClick={() => {
                        playSound();
                        setModal({ type: "catch" });
                      }}
                    >
                      Let’s catch some love <ArrowRight size={16} />
                    </button>
                  </div>
                </article>
                <article className="game-card find-card">
                  <div className="game-illustration">
                    <div className="hide-cloud hc1" />
                    <div className="hide-cloud hc2" />
                    <Mochi />
                    <span className="game-tag">A LITTLE HIDE & SEEK</span>
                    <HiddenMochi index={2} className="game-hidden" />
                  </div>
                  <div className="game-card-copy">
                    <span className="eyebrow">02 / HELLO, LITTLE FRIEND</span>
                    <h3>Find Mochi</h3>
                    <p>
                      Si kecil suka main petak umpet.
                      <br />
                      Bisa nemuin dia di dunia ini?
                    </p>
                    <button
                      className="game-button"
                      onClick={() => {
                        setHunt(true);
                        playSound();
                        setModal({ type: "find" });
                      }}
                    >
                      {found.length === 4
                        ? "Lihat petualanganmu"
                        : "Where are you, Mochi?"}{" "}
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </article>
                <article className="game-card pop-card">
                  <div className="game-illustration">
                    <div className="demo-bubble db1">stres</div>
                    <div className="demo-bubble db2">capek</div>
                    <div className="demo-bubble db3">bad mood</div>
                    <span className="game-tag">POP YOUR WORRIES AWAY</span>
                  </div>
                  <div className="game-card-copy">
                    <span className="eyebrow">03 / LET A LITTLE GO</span>
                    <h3>Anti-Bad-Mood Bubble</h3>
                    <p>
                      Tap, pop, lega.
                      <br />
                      Lepasin beban kecil satu-satu.
                    </p>
                    <button
                      className="game-button"
                      onClick={() => {
                        playSound();
                        setModal({ type: "bubble" });
                      }}
                    >
                      Time to pop! <ArrowRight size={16} />
                    </button>
                  </div>
                </article>
              </div>
            </section>

            <section className="final-invite section-wrap">
              <div className="final-invite-stars" aria-hidden="true">
                ✦ <span>☾</span> ✧
              </div>
              <div>
                <span className="eyebrow">BEFORE YOU GO…</span>
                <h2>There’s one last thing, May.</h2>
                <p>Some feelings look a little prettier under the stars.</p>
              </div>
              <button className="primary-button" onClick={openFinal}>
                Just between us <Moon size={16} />
              </button>
              <button
                className="special-star"
                aria-label="Bintang istimewa"
                onClick={() => {
                  discover("meteor");
                  reveal({
                    title: "Satu bintang, satu harapan.",
                    text: "Kalau bisa nitip satu hal ke langit malam, gua bakal minta: semoga hari Maybe sedikit lebih hangat. Kamu pantas dapat hal-hal lembut, May.",
                    emoji: "🌠",
                    effect: "meteor",
                  });
                }}
              >
                ✧
              </button>
            </section>

            <footer className="site-footer section-wrap">
              <div className="footer-top">
                <div className="footer-brand">
                  <LogoStar className="brand-star" />
                  <b>MAYBEVERSE</b>
                  <span>A tiny universe made just to see you smile.</span>
                </div>
                <form
                  className="secret-form"
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (secretInput.trim().toUpperCase() === "RADLI") {
                      discover("secret-letter");
                      setSecretHint("");
                      playSound("note");
                      celebrate("hearts");
                      setModal({ type: "secret" });
                    } else {
                      setSecretHint(
                        "Hmm… coba nama orang yang bikin dunia kecil ini 👀",
                      );
                      playSound("pop");
                    }
                  }}
                >
                  <label htmlFor="secret-code">Psst… punya kode rahasia?</label>
                  <div>
                    <input
                      id="secret-code"
                      name="secret-code"
                      placeholder="Bisikkan di sini…"
                      value={secretInput}
                      onChange={(event) => {
                        setSecretInput(event.target.value);
                        setSecretHint("");
                      }}
                      maxLength={40}
                      autoComplete="off"
                      aria-describedby={secretHint ? "secret-hint" : undefined}
                    />
                    <button aria-label="Buka kode rahasia" type="submit">
                      <ArrowRight size={18} />
                    </button>
                  </div>
                  {secretHint && (
                    <small id="secret-hint" role="status">
                      {secretHint}
                    </small>
                  )}
                </form>
              </div>
              <div className="footer-bottom">
                <span>
                  Made for Maybe. Made with care. Made by Radli.{" "}
                  <Heart size={12} fill="currentColor" />
                </span>
                <div>
                  <button
                    className="do-not-press"
                    onClick={() => {
                      discover("forbidden-button");
                      reveal({
                        title: "KETAHUAN YA SUKA PENASARAN 😭",
                        text: "Mochi sudah memperkirakan ini. Hukuman: harus menerima satu pujian. Maybe, lu lucu banget pas penasaran. Oke selesai, boleh lanjut scroll.",
                        emoji: "🤨",
                        effect: "dance",
                      });
                    }}
                  >
                    JANGAN DIPENCET
                  </button>
                  <HiddenMochi index={3} />
                </div>
              </div>
              <div className="install-row">
                {installEvent ? (
                  <button
                    className="text-button"
                    onClick={async () => {
                      try {
                        await installEvent.prompt();
                        await installEvent.userChoice;
                        setInstallEvent(null);
                      } catch {
                        setSecretHint(
                          "Bisa ditambahkan lewat menu browser: Add to Home Screen.",
                        );
                      }
                    }}
                  >
                    Tambah dunia kecil ini ke home screen ↗
                  </button>
                ) : (
                  <span>
                    Keep this little world close. Di iPhone: Bagikan → Tambah ke
                    Layar Utama.
                  </span>
                )}
              </div>
            </footer>
            {hunt && (
              <aside className="hunt-progress" aria-live="polite">
                <Mochi />
                <span>
                  {found.length === 4
                    ? "Misi selesai! ♡"
                    : `${found.length}/4 Mochi ditemukan`}
                </span>
                <button
                  aria-label="Tutup progres pencarian"
                  onClick={() => setHunt(false)}
                >
                  ×
                </button>
              </aside>
            )}
          </main>
        ) : (
          <main className="night-main">
            <div className="night-sky" aria-hidden="true">
              {Array.from({ length: 42 }, (_, index) => (
                <i
                  className="night-star"
                  key={index}
                  style={
                    {
                      left: `${(index * 37 + 3) % 100}%`,
                      top: `${(index * 23 + 8) % 90}%`,
                      "--delay": `${index % 7}s`,
                    } as CSSProperties
                  }
                />
              ))}
            </div>
            <a className="back-link" href="#">
              <ArrowLeft size={16} /> Back to your little universe
            </a>
            <div className="star-heart" aria-hidden="true">
              {Array.from({ length: 32 }, (_, index) => {
                const t = (index / 32) * Math.PI * 2;
                return (
                  <span
                    key={index}
                    style={
                      {
                        left: `${50 + Math.pow(Math.sin(t), 3) * 42}%`,
                        top: `${47 - (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * 2.55}%`,
                        "--delay": `${index * 0.065}s`,
                      } as CSSProperties
                    }
                  >
                    ✦
                  </span>
                );
              })}
              <span className="heart-moon">☾</span>
            </div>
            <span className="eyebrow">A SMALL LETTER UNDER A BIG SKY</span>
            <h1 tabIndex={-1} ref={finalHeading}>
              One Last Thing, <em>May…</em>
            </h1>
            <article className="final-letter">
              <p>{finalLetter}</p>
              <div className={`final-hug ${hugging ? "hugging" : ""}`}>
                <Mochi />
                <Heart fill="currentColor" />
                <Mochi className="mochi-friend" />
              </div>
              <button className="primary-button" onClick={sendHug}>
                Send a virtual hug 🫂
              </button>
              <p className="hug-response" role="status">
                {hugging
                  ? "Peluk diterima. Radli balas dua kali lebih hangat. ♡"
                  : "From my little corner of the universe, to yours."}
              </p>
            </article>
            <p className="night-footer">
              Made for Maybe. Always in your corner. — Radli ♡
            </p>
          </main>
        )}
      </div>
      <Effects celebration={celebration} />
      <OverlayPresence>
        {modal && (
          <Modal
            key={modal.type}
            onClose={closeModal}
            className={`${modal.type}-modal`}
          >
            {modal.type === "welcome" && (
              <div className="welcome-content">
                <div className="welcome-gift">
                  <Gift size={70} strokeWidth={1.1} />
                  <span>✦</span>
                  <span>♡</span>
                </div>
                <span className="eyebrow">SPECIAL DELIVERY FOR MAYBE</span>
                <h2 id="modal-title">
                  {welcomeAnswer ? "Hehe. Caught me! 💗" : "🚨 PERHATIAN! 🚨"}
                </h2>
                {!welcomeAnswer ? (
                  <>
                    <p>
                      Terdeteksi seorang cewek lucu bernama <b>Maybe</b> sedang
                      membuka website ini.
                    </p>
                    <p>
                      Ada seseorang yang pengen kamu senyum hari ini.
                      <br />
                      Tebak siapa? 👀
                    </p>
                    <div className="welcome-choices">
                      <button
                        className="primary-button"
                        onClick={() => {
                          setWelcomeAnswer(
                            "YAAA BENERRR!! 🥳💗 +1000 happiness points!",
                          );
                          playSound();
                          celebrate("confetti");
                        }}
                      >
                        Radli yaaa? 😭
                      </button>
                      <button
                        className="secondary-button"
                        onClick={() => {
                          setWelcomeAnswer(
                            "MASA GATAU SIHHH 😤 Ya Radli lah, siapa lagi WKWKWK!",
                          );
                          playSound();
                          celebrate("hearts");
                        }}
                      >
                        Siapa tuh? 🤨
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="welcome-answer" role="status">
                      {welcomeAnswer}
                    </p>
                    <p>This little universe is all yours.</p>
                    <button className="primary-button" onClick={closeModal}>
                      Masuk ke duniaku <ArrowRight size={16} />
                    </button>
                  </>
                )}
                <span className="modal-small">
                  a little happiness, signed Radli ♡
                </span>
              </div>
            )}
            {modal.type === "message" && (
              <div className="message-content">
                <div className="reaction-art">
                  <ReactionArt
                    effect={modal.message.effect}
                    expression={
                      moods.find((item) => item.title === modal.message.title)
                        ?.id
                    }
                  />
                </div>
                <span className="eyebrow">A LITTLE SOMETHING FOR YOU</span>
                <h2 id="modal-title">{modal.message.title}</h2>
                <p>{modal.message.text}</p>
                <span className="message-signature">
                  with love, Radli & Mochi ♡
                </span>
                <button className="primary-button" onClick={closeModal}>
                  Makasih, aku simpan di hati <Heart size={16} />
                </button>
              </div>
            )}
            {modal.type === "note" && (
              <article className="opened-letter">
                <span className="letter-stamp">{notes[modal.index].emoji}</span>
                <span className="eyebrow">
                  OPEN WHEN {notes[modal.index].label.toUpperCase()}
                </span>
                <h2 id="modal-title">{notes[modal.index].title}</h2>
                <p>{notes[modal.index].text}</p>
                <span className="letter-signature">
                  Always in your corner,
                  <br />
                  <b>Radli ♡</b>
                </span>
                <button className="text-button" onClick={closeModal}>
                  Lipat dan simpan <Mail size={16} />
                </button>
              </article>
            )}
            {modal.type === "secret" && (
              <article className="opened-letter secret-letter">
                <span className="letter-stamp">🔐</span>
                <span className="eyebrow">YOU FOUND A LITTLE SECRET</span>
                <h2 id="modal-title">Just between us, May.</h2>
                <p>{secretNote}</p>
                <button className="primary-button" onClick={openFinalAndClose}>
                  Masih ada satu surat lagi <Moon size={16} />
                </button>
              </article>
            )}
            {modal.type === "catch" && (
              <CatchGame
                celebrate={() => {
                  playSound("note");
                  celebrate("hearts");
                }}
                sound={() => playSound("pop")}
              />
            )}
            {modal.type === "bubble" && (
              <BubbleGame
                celebrate={() => {
                  playSound("note");
                  celebrate("confetti");
                }}
                sound={() => playSound("pop")}
              />
            )}
            {modal.type === "find" && (
              <div className="find-content">
                <Mochi className="bob" />
                <span className="eyebrow">CALLING DETECTIVE MAY</span>
                <h2 id="modal-title">Where are you, Mochi?</h2>
                <p>
                  {found.length === 4
                    ? "Semua 4 Mochi sudah ditemukan! Teman kecilmu tetap ada di dunia ini, ditandai dengan centang. Misi ini tersimpan di perangkatmu. ♡"
                    : "Ada 4 Mochi mungil yang ngumpet di sudut-sudut website. Lihat baik-baik, lalu tap mereka buat dapat pesan rahasia. Ada yang tinggal dekat awan, ada yang suka surat… 👀"}
                </p>
                <div className="found-count">
                  {Array.from({ length: 4 }, (_, index) => (
                    <span
                      key={index}
                      className={found.includes(index) ? "is-found" : ""}
                    >
                      {found.includes(index) ? (
                        <Check size={18} />
                      ) : (
                        <Star size={18} />
                      )}
                    </span>
                  ))}
                </div>
                <p className="modal-small">
                  {found.length} dari 4 ditemukan · tersimpan di perangkat ini
                </p>
                <button className="primary-button" onClick={closeModal}>
                  {found.length === 4
                    ? "Aku detektif hebat 😎"
                    : "Let the tiny adventure begin"}{" "}
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </Modal>
        )}
      </OverlayPresence>
    </MotionConfig>
  );

  function openFinalAndClose() {
    setModal(null);
    openFinal();
  }
}
