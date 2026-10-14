import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { AnimatePresence, MotionConfig, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Check,
  Heart,
  Mail,
  Moon,
  RotateCw,
  Sparkles,
  Star,
  Sun,
} from "lucide-react";
import { Daisy, LogoStar, Mochi } from "./Mochi";
import Modal from "./Modal";
import { Effects, ReactionArt, type Celebration } from "./Reactions";
import { LoveNotes, GamesCatalog } from "./LegacySections";
import { SiteHeader } from "./SiteHeader";
import { FinalPage } from "./FinalPage";
import { BubbleGame, CatchGame } from "./Games";
import {
  moods,
  notes,
  secretNote,
  sunshine,
  surprises,
  type Effect,
  type Message,
} from "./data";
import { chooseOther, localDay, readSaved, save } from "./storage";
import { useCompanion } from "./Companion";
import { MochiBedroom, PinkHiddenEnding } from "./MochiBedroom";
import { useSound } from "./useSound";
import { Hero } from "./Hero";
import { MoodSection } from "./MoodSection";
import { useUniverse } from "./universe/Universe";
import {
  UniverseHub,
  WorldToast,
  MobileNavigation,
  type ExperienceId,
} from "./universe/Hub";
const ExperienceRenderer = lazy(() =>
  import("./universe/ExperienceRenderer").then((module) => ({
    default: module.ExperienceRenderer,
  })),
);
import { WelcomePortal } from "./universe/WelcomePortal";
import { MoodRescue } from "./universe/MoodRescue";

type OpenModal =
  | { type: "welcome" }
  | { type: "message"; message: Message; emergency?: boolean }
  | { type: "note"; index: number }
  | { type: "secret" }
  | { type: "catch" }
  | { type: "bubble" }
  | { type: "find" }
  | { type: "hidden-ending" }
  | { type: "experience"; id: ExperienceId };
const secretMessages = [
  "Mochi nyasar di sini gara-gara nyium aroma cemilan. Pesan rahasianya: makan dulu, May!",
  "Ketemu! Mochi lagi sembunyi dari deadline. Katanya: lu keren bahkan pas lagi capek.",
  "Mochi bawa satu pesan dari Radli: gua seneng lu ada. Beneran.",
  "Mochi suka sudut tenang ini. Dia cuma pengen bilang: May, gua bangga sama lu.",
];

function OverlayPresence({ children }: { children: ReactNode }) {
  const systemReduceMotion = useReducedMotion();
  const { progress } = useUniverse();
  const reduceMotion = systemReduceMotion || !progress.effects;
  return reduceMotion ? (
    <>{children}</>
  ) : (
    <AnimatePresence mode="wait">{children}</AnimatePresence>
  );
}

export default function App() {
  const mochi = useCompanion();
  const world = useUniverse();
  const { soundOn, play: playSound, toggle: toggleSound } = useSound();
  const [modal, setModal] = useState<OpenModal | null>(() =>
    readSaved<boolean>("welcomed", false) === true ? null : { type: "welcome" },
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
  const modalRef = useRef<OpenModal | null>(modal);
  const automaticShown = useRef(false);
  const lastActivity = useRef(Date.now());
  const logoTaps = useRef(0);
  const mochiTaps = useRef(0);
  const heartTaps = useRef(0);
  const previousSurprise = useRef(-1);
  const effectsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hugTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastNavigation = useRef(false);
  const finalHeading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    modalRef.current = modal;
  }, [modal]);
  useEffect(() => {
    const active = () => {
      lastActivity.current = Date.now();
    };
    window.addEventListener("pointerdown", active, { passive: true });
    window.addEventListener("keydown", active);
    window.addEventListener("scroll", active, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", active);
      window.removeEventListener("keydown", active);
      window.removeEventListener("scroll", active);
    };
  }, []);
  useEffect(() => {
    if (!world.progress.autoPopups || final || automaticShown.current) return;
    const timer = setTimeout(() => {
      automaticShown.current = true;
      if (
        !modalRef.current &&
        !document.hidden &&
        Date.now() - lastActivity.current >= 8000
      ) {
        playSound("notification");
        setModal({ type: "experience", id: "delivery" });
      }
    }, 75000);
    return () => clearTimeout(timer);
  }, [world.progress.autoPopups, final, playSound]);
  useEffect(() => {
    discovered.forEach(world.egg);
    if (mochi.profile.pets > 0) world.award("favorite");
    if (mochi.profile.pets >= 10) world.egg("secret-dance");
    if (mochi.profile.feeds > 0) world.award("snack");
    if (mochi.profile.hugs > 0) world.award("adorable");
    if (mochi.profile.naps > 0) world.award("cozy");
    if (mochi.profile.dances > 0) world.award("dance");
    if (mochi.profile.talks > 0) world.award("queen");
  }, [
    discovered,
    mochi.profile.pets,
    mochi.profile.feeds,
    mochi.profile.hugs,
    mochi.profile.naps,
    mochi.profile.dances,
    mochi.profile.talks,
    world.award,
    world.egg,
  ]);
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

  function celebrate(type: Effect = "confetti") {
    if (effectsTimer.current) clearTimeout(effectsTimer.current);
    setCelebration({ type, id: Date.now() });
    effectsTimer.current = setTimeout(() => setCelebration(null), 4200);
  }
  function reveal(message: Message, emergency = false) {
    playSound();
    celebrate(message.effect);
    setModal({ type: "message", message, emergency });
  }
  function discover(key: string) {
    world.egg(key);
    setDiscovered((previous) => {
      const next = [...new Set([...previous, key])];
      save("discoveries", next);
      return next;
    });
    mochi.syncDiscoveries();
  }
  function closeModal() {
    if (modal?.type === "welcome") save("welcomed", true);
    setModal(null);
  }
  function surprise() {
    const index = chooseOther(surprises.length, previousSurprise.current);
    previousSurprise.current = index;
    mochi.reactToMood("mixed");
    reveal(surprises[index], true);
  }
  function findMochi(index: number) {
    if (found.includes(index)) return;
    const next = [...found, index];
    setFound(next);
    save("found-mochis", next);
    mochi.syncDiscoveries();
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
  function openFinal() {
    window.location.hash = "one-last-thing";
    playSound("note");
  }
  function sendHug() {
    mochi.care("hug");
    playSound("note");
    celebrate("hearts");
    setHugging(true);
    if (hugTimer.current) clearTimeout(hugTimer.current);
    hugTimer.current = setTimeout(() => setHugging(false), 5000);
  }

  const petHero = () => {
    mochiTaps.current++;
    mochi.care("pet");
    playSound("pop");
    if (mochiTaps.current % 10 === 0) {
      world.egg("secret-dance");
      mochi.care("dance");
      reveal({
        title: "TEN PATS, ONE SECRET DANCE!",
        text: "Mochi menyiapkan gerakan paling random. Radli memberi nilai 10 untuk niat bikin Maybe senyum.",
        emoji: "💗",
        effect: "dance",
      });
    } else if (mochiTaps.current % 5 === 0) {
      discover("super-mochi");
      reveal({
        title: "IT’S A BIRD! IT’S A PLANE! IT’S… MOCHI!",
        text: "Super Mochi hadir! Kekuatan supernya: bikin Maybe senyum dan nyembunyiin deadline selama 5 menit. Cape-nya dari selimut Radli.",
        emoji: "🦸",
        effect: "meteor",
      });
    }
  };

  return (
    <MotionConfig reducedMotion={world.progress.effects ? "user" : "always"}>
      <div
        id="page"
        className={
          (final ? "final-page" : "") +
          (world.progress.night ? " universe-night" : "")
        }
      >
        <SiteHeader
          final={final}
          soundOn={soundOn}
          onSound={toggleSound}
          onHome={() => {
            logoTaps.current++;
            if (logoTaps.current % 5 === 0) {
              world.egg("giant-mochi");
              playSound("reveal");
              setModal({ type: "experience", id: "giant" });
            }
          }}
          onHeart={() => {
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
        />

        {modal?.type === "welcome" ? (
          <main className="portal-backdrop-scene" aria-hidden="true">
            <div className="portal-background-halo" />
            <div className="portal-background-cloud cloud" />
            <span className="portal-background-flower">
              <Daisy />
            </span>
            <span className="portal-background-note">
              a little world is waiting for you ♡
            </span>
          </main>
        ) : !final ? (
          <main>
            <Hero
              onPet={petHero}
              superhero={discovered.includes("super-mochi")}
            />

            <div className="little-strip">
              <span>✦</span> no perfect days required <span>♡</span> just come
              as you are <span>✦</span> you’re safe in this little universe{" "}
              <span>♡</span>
              <HiddenMochi index={0} />
            </div>

            <MoodSection
              mood={mood}
              onSelect={(item) => {
                setMood(item.id);
                save("mood", item.id);
                mochi.reactToMood(item.id);
                world.bump("moods");
                world.award("soft");
                reveal(item);
              }}
            />

            <MochiBedroom
              onSound={() => playSound("pop")}
              discoveries={discovered}
              onWish={() => {
                discover("window-wish");
                reveal({
                  title: "Dari jendela kecil, buat hati kamu.",
                  text: "Mochi baru nemu catatan Radli di balik bintang: “May, kalau hari ini berat, jangan lupa ada tempat yang selalu seneng kamu pulang. Di sini, di hati gua, di mana pun kita bisa saling nemenin.” ♡",
                  emoji: "💌",
                  effect: "hearts",
                });
              }}
              onHiddenEnding={() => {
                if (!mochi.secretReady) return;
                discover("pink-ending");
                playSound("note");
                celebrate("hearts");
                setModal({ type: "hidden-ending" });
              }}
            />

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

            <UniverseHub
              onOpen={(id) => {
                playSound("pop");
                setModal({ type: "experience", id });
              }}
              onEmergency={surprise}
              onMood={() =>
                document.getElementById("mood")?.scrollIntoView({
                  behavior:
                    world.progress.effects &&
                    !window.matchMedia("(prefers-reduced-motion: reduce)")
                      .matches
                      ? "smooth"
                      : "instant",
                })
              }
            />

            <LoveNotes
              hiddenMochi={<HiddenMochi index={1} />}
              onOpen={(index) => {
                playSound("note");
                world.readLetter(index);
                setModal({ type: "note", index });
              }}
            />
            <GamesCatalog
              completed={found.length === 4}
              hiddenMochi={<HiddenMochi index={2} className="game-hidden" />}
              onCatch={() => {
                playSound();
                setModal({ type: "catch" });
              }}
              onFind={() => {
                setHunt(true);
                playSound();
                setModal({ type: "find" });
              }}
              onBubble={() => {
                playSound();
                setModal({ type: "bubble" });
              }}
            />

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
          <FinalPage
            headingRef={finalHeading}
            hugging={hugging}
            accessory={mochi.profile.accessory}
            onHug={sendHug}
          />
        )}
        {!final && modal?.type !== "welcome" && (
          <MobileNavigation
            onAlbum={() => setModal({ type: "experience", id: "album" })}
          />
        )}
      </div>
      <WorldToast />
      <Effects celebration={world.progress.effects ? celebration : null} />
      <OverlayPresence>
        {modal && (
          <Modal
            key={
              modal.type === "experience"
                ? modal.type + "-" + modal.id
                : modal.type
            }
            onClose={closeModal}
            className={`${modal.type}-modal`}
          >
            {modal.type === "welcome" && (
              <WelcomePortal
                onEnter={closeModal}
                onGrant={() => {
                  playSound("reveal");
                  celebrate("confetti");
                }}
              />
            )}
            {modal.type === "message" && (
              <div
                className={
                  "message-content " +
                  (modal.emergency ? "emergency-message" : "")
                }
                data-mood={
                  moods.find((item) => item.title === modal.message.title)?.id
                }
              >
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
                {moods.some((item) => item.title === modal.message.title) && (
                  <MoodRescue
                    mood={
                      moods.find((item) => item.title === modal.message.title)!
                        .id
                    }
                    sound={() => playSound("note")}
                  />
                )}
                {modal.emergency && (
                  <div className="emergency-inline-hug">
                    <Mochi
                      expression="hug"
                      accessory={mochi.profile.accessory}
                    />
                    <Heart fill="currentColor" />
                    <Mochi expression="hug" accessory="ribbon" />
                    <span>a tiny hug, included ♡</span>
                  </div>
                )}
                <span className="message-signature">
                  with love, Radli & Mochi ♡
                </span>
                <button className="primary-button" onClick={closeModal}>
                  Makasih, aku simpan di hati <Heart size={16} />
                </button>
                {modal.emergency && (
                  <button className="text-button" onClick={surprise}>
                    ONE MORE PLEASE! <Sparkles size={15} />
                  </button>
                )}
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
                onComplete={(score) => {
                  mochi.recordGame("catch", score);
                  if (score >= 3) world.egg("game-costume");
                  if (score >= 5) world.award("champion");
                }}
                bestScore={mochi.profile.bestCatch}
                accessory={mochi.profile.accessory}
              />
            )}
            {modal.type === "bubble" && (
              <BubbleGame
                celebrate={() => {
                  playSound("note");
                  celebrate("confetti");
                }}
                sound={() => playSound("bubble")}
                onComplete={() => mochi.recordGame("bubble")}
                onPopAll={() => {
                  world.egg("bubble-party");
                  world.award("chaos");
                }}
                accessory={mochi.profile.accessory}
              />
            )}
            {modal.type === "find" && (
              <div className="find-content">
                <Mochi className="bob" accessory={mochi.profile.accessory} />
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
            {modal.type === "hidden-ending" && (
              <PinkHiddenEnding
                onClose={closeModal}
                onHug={() => {
                  mochi.care("hug");
                  playSound("note");
                  celebrate("hearts");
                }}
              />
            )}
            {modal.type === "experience" && (
              <Suspense
                fallback={
                  <div className="world-experience">
                    <h2 id="modal-title">Mochi lagi mengempukkan bantal…</h2>
                    <Mochi expression="confused" />
                  </div>
                }
              >
                <ExperienceRenderer
                  id={modal.id}
                  sound={playSound}
                  celebrate={() => celebrate("confetti")}
                  soundOn={soundOn}
                  onSound={toggleSound}
                  onClose={closeModal}
                />
              </Suspense>
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
