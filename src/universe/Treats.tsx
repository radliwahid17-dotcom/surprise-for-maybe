import { useEffect, useRef, useState } from "react";
import { Heart, Sparkles } from "lucide-react";
import { Mochi } from "../Mochi";
import { useCompanion } from "../Companion";
import { useUniverse } from "./Universe";
import {
  bottleNotes,
  dailyCompliments,
  fortunes,
  popups,
  stickers,
} from "./data";
import { StickerArt, ToyIcon } from "./Illustrations";
import { ExperienceFrame, StarFragment } from "./Shared";
import type { SoundKind } from "../useSound";
export type ExperienceActions = {
  sound: (kind?: SoundKind) => void;
  celebrate: () => void;
};

export function FortuneCookie({ sound, celebrate }: ExperienceActions) {
  const world = useUniverse();
  const [index, setIndex] = useState<number | null>(null);
  function crack() {
    setIndex(world.draw("fortune", fortunes.length));
    sound("reveal");
    celebrate();
    world.award("monday");
    if ((world.progress.stats.fortune || 0) + 1 >= 3) {
      world.award("fortune");
      world.egg("cookie-crumble");
    }
  }
  return (
    <ExperienceFrame
      title="Mochi’s fortune cookie"
      kicker="A TINY CRUNCH, A LITTLE HOPE"
      description="Prediksi absurd dan kalimat hangat. Semua ramalan di sini cuma hiburan, ya."
      className="fortune-experience"
    >
      <button
        className={"fortune-cookie " + (index !== null ? "cracked" : "")}
        onClick={crack}
        aria-label={
          index === null
            ? "Pecahkan fortune cookie"
            : "Buka fortune cookie lain"
        }
      >
        <ToyIcon kind="cookie" />
        <span>
          {index === null ? "tap for a tiny fortune" : "one more tiny crunch?"}
        </span>
      </button>
      <div className="fortune-paper" role="status">
        {index !== null ? (
          <>
            <span>FORTUNE NO. {String(index + 1).padStart(2, "0")}</span>
            <p>{fortunes[index]}</p>
            <small>signed, the very unofficial bunny oracle</small>
          </>
        ) : (
          <p>A little message is waiting inside.</p>
        )}
      </div>
      {index !== null && <StarFragment id="fortune" />}
    </ExperienceFrame>
  );
}
const hugStyles = [
  {
    id: "tiny",
    name: "Tiny hug",
    line: "Satu peluk mungil buat sela hari yang rame. Aku di sini, May.",
  },
  {
    id: "big",
    name: "Big hug",
    line: "Peluk sedikit lebih lama. Bebannya boleh ditaruh dulu, nggak harus langsung beres.",
  },
  {
    id: "mega",
    name: "SUPER MEGA ULTRA HUG",
    line: "HUG-SIZED UNIVERSE! Radli, Mochi, dan seluruh bantal mengirim peluk paling empuk buat Maybe.",
  },
];
export function HugMachine({ sound, celebrate }: ExperienceActions) {
  const world = useUniverse();
  const mochi = useCompanion();
  const [hug, setHug] = useState<number | null>(null);
  const [serial, setSerial] = useState(0);
  function send(index: number) {
    setHug(index);
    setSerial((n) => n + 1);
    mochi.care("hug");
    world.bump("hugs");
    world.award("hug");
    sound("note");
    celebrate();
    if (index === 2) world.egg("mega-hug");
  }
  return (
    <ExperienceFrame
      title="The virtual hug machine"
      kicker="NO REASON REQUIRED"
      description="Pilih ukuran peluk. Semuanya dibuat dari kelembutan yang sama."
      className="hug-experience"
    >
      <div
        key={serial}
        className={
          "hug-machine-scene " +
          (hug === null ? "" : "hug-" + hugStyles[hug].id)
        }
      >
        <Mochi
          expression={hug === null ? "happy" : "hug"}
          accessory={mochi.profile.accessory}
        />
        <Heart className="hug-machine-heart" fill="currentColor" />
        <Mochi expression={hug === null ? "blush" : "hug"} accessory="ribbon" />
        <span className="hug-cloud cloud" />
      </div>
      <div className="hug-size-options">
        {hugStyles.map((h, i) => (
          <button
            className={i === 2 ? "primary-button" : "secondary-button"}
            key={h.id}
            onClick={() => send(i)}
            aria-pressed={hug === i}
          >
            {h.name}
          </button>
        ))}
      </div>
      <p className="hug-dialogue" role="status">
        {hug === null
          ? "Mochi sudah membuka dua tangan kecilnya."
          : hugStyles[hug].line}
      </p>
      {hug !== null && <StarFragment id="hug" />}
    </ExperienceFrame>
  );
}
export function MessageBottle({ sound }: ExperienceActions) {
  const world = useUniverse();
  const [index, setIndex] = useState<number | null>(null);
  function open() {
    setIndex(world.draw("bottle", bottleNotes.length));
    world.award("radli");
    sound("note");
    if ((world.progress.stats.bottle || 0) + 1 >= 5)
      world.egg("bottle-current");
  }
  return (
    <ExperienceFrame
      title="A message in a bottle"
      kicker="FROM RADLI’S LITTLE CORNER"
      description="Ada catatan yang sengaja dikirim lewat arus kecil, sampai ke Maybe."
      className="bottle-experience"
    >
      <button
        className={"message-bottle " + (index !== null ? "bottle-open" : "")}
        onClick={open}
        aria-label={
          index === null ? "Buka botol pesan Radli" : "Buka botol pesan lain"
        }
      >
        <svg viewBox="0 0 160 215" aria-hidden="true">
          <path
            d="M64 34H96V70Q100 84 114 98L121 180Q120 203 80 205Q40 203 39 180L46 98Q61 83 64 70Z"
            fill="#d8edef"
            stroke="#99b9bd"
            strokeWidth="3"
          />
          <rect
            className="bottle-cork"
            x="61"
            y="17"
            width="38"
            height="28"
            rx="6"
            fill="#d8b398"
            stroke="#b08870"
            strokeWidth="2"
          />
          <rect
            x="54"
            y="111"
            width="54"
            height="61"
            rx="4"
            fill="#fff6e8"
            transform="rotate(-9 80 141)"
          />
          <path
            d="M78 136C68 121 57 137 78 151C104 137 90 121 78 136Z"
            fill="#d89baf"
          />
          <path
            d="M50 103L48 161"
            stroke="#fff"
            strokeWidth="5"
            opacity=".6"
            strokeLinecap="round"
          />
        </svg>
        <span>
          {index === null ? "tap to uncork" : "another little current?"}
        </span>
      </button>
      <article className="bottle-note" role="status">
        <span className="handwritten">Hey, May…</span>
        <p>
          {index === null
            ? "Ada kata-kata kecil yang belum sampai."
            : bottleNotes[index]}
        </p>
        <span className="handwritten">— Radli ♡</span>
      </article>
      {index !== null && <StarFragment id="bottle" />}
    </ExperienceFrame>
  );
}
export function CapsuleMachine({ sound, celebrate }: ExperienceActions) {
  const world = useUniverse();
  const companion = useCompanion();
  const [index, setIndex] = useState<number | null>(null);
  const [miniReply, setMiniReply] = useState(false);
  const [busy, setBusy] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  function draw() {
    if (busy) return;
    setBusy(true);
    sound("squeak");
    const finish = () => {
      const next = world.draw("capsule", stickers.length);
      setIndex(next);
      setMiniReply(false);
      world.award(stickers[next].id);
      setBusy(false);
      sound("reveal");
      celebrate();
    };
    if (
      !world.progress.effects ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      finish();
    else timer.current = setTimeout(finish, 700);
  }
  const reward = index !== null ? stickers[index] : null;
  const giftKinds = [
    "Cute sticker",
    "Tiny compliment",
    "Secret note",
    "Mini Pink Mochi",
    "Funny achievement",
    "A surprise from Radli",
  ];
  const giftKind = index === null ? 0 : index % giftKinds.length;
  return (
    <ExperienceFrame
      title="The cuteness capsule machine"
      kicker="FREE LITTLE GIFTS, FOREVER"
      description="Putar, buka, simpan hal lucu. Semua hadiah gratis, tanpa iklan atau batas kunjungan."
      className="capsule-experience"
    >
      <div className={"capsule-machine " + (busy ? "machine-drawing" : "")}>
        <div className="capsule-dome">
          {Array.from({ length: 9 }, (_, i) => (
            <i
              key={i}
              className={"tiny-capsule capsule-color-" + (i % 4)}
              style={{
                left: 9 + ((i * 29) % 70) + "%",
                top: 15 + ((i * 31) % 60) + "%",
                rotate: ((i * 37) % 80) - 40 + "deg",
              }}
            />
          ))}
          <Mochi
            className="machine-bunny"
            expression={busy ? "spin" : "happy"}
          />
        </div>
        <div className="capsule-machine-base">
          <span>MAYBE’S LITTLE TREASURES</span>
          <button
            className="machine-knob"
            onClick={draw}
            disabled={busy}
            aria-label="Putar mesin kapsul"
          >
            <Sparkles size={25} />
          </button>
          <div className="capsule-chute" />
        </div>
      </div>
      <button className="primary-button" onClick={draw} disabled={busy}>
        {busy ? "Mochi lagi bungkus hadiah…" : "OPEN A LITTLE GIFT"}
      </button>
      {reward && (
        <article className="capsule-reward" role="status" key={reward.id}>
          <StickerArt kind={reward.kind} color={reward.color} />
          <div>
            <span className="eyebrow">A LITTLE TREASURE FOR MAYBE</span>
            <h3>{reward.name}</h3>
            <p>{reward.description}</p>
            <small>
              Sudah tersimpan di album. Kapsul berikutnya selalu gratis.
            </small>
          </div>
        </article>
      )}
      {reward && index !== null && (
        <div className="capsule-gift-extra">
          <span className="eyebrow">{giftKinds[giftKind]}</span>
          {giftKind === 0 && (
            <p>
              Sticker kecil, kenangan besar. Kamu bisa menyimpannya di album
              tanpa perlu melakukan apa-apa lagi.
            </p>
          )}
          {giftKind === 1 && (
            <p>{dailyCompliments[index % dailyCompliments.length]}</p>
          )}
          {giftKind === 2 && (
            <p className="capsule-secret-note">
              {bottleNotes[index % bottleNotes.length]}
              <small>— Radli ♡</small>
            </p>
          )}
          {giftKind === 3 && (
            <>
              <Mochi
                expression={miniReply ? companion.expression : "blush"}
                accessory="ribbon"
              />
              <button
                className="secondary-button"
                onClick={() => {
                  companion.surprise();
                  setMiniReply(true);
                  sound("squeak");
                }}
              >
                Sapa kelinci kapsul
              </button>
              {miniReply && (
                <p className="capsule-mini-note" role="status">
                  HELLOOO MAY! Versi mungil, dukungan tetap gede banget ♡
                </p>
              )}
            </>
          )}
          {giftKind === 4 && (
            <p>
              Penghargaan resmi: {reward.name}. Juri terdiri dari Mochi dan satu
              bantal. Keputusannya bulat.
            </p>
          )}
          {giftKind === 5 && (
            <p>
              May, gua sengaja nitip kejutan kecil ini. Nggak ada syarat
              apa-apa; gua cuma seneng bisa bikin tempat yang hangat buat lu. —
              Radli ♡
            </p>
          )}
        </div>
      )}
      {reward && <StarFragment id="capsule" />}
    </ExperienceFrame>
  );
}
export function SurpriseDelivery({ sound, celebrate }: ExperienceActions) {
  const world = useUniverse();
  const [index, setIndex] = useState<number | null>(null);
  const [reply, setReply] = useState("");
  const opened = useRef(false);
  useEffect(() => {
    if (!opened.current) {
      opened.current = true;
      setIndex(world.draw("popup", popups.length));
    }
  }, [world.draw]);
  if (index === null)
    return (
      <ExperienceFrame
        title="A tiny delivery is coming…"
        kicker="MOCHI’S POST OFFICE"
        description="Mochi lagi memilih perangko hati."
      >
        <Mochi expression="confused" />
      </ExperienceFrame>
    );
  const popup = popups[index];
  function more() {
    setIndex(world.draw("popup", popups.length));
    setReply("");
    sound("notification");
    celebrate();
  }
  return (
    <ExperienceFrame
      title={popup.title}
      kicker="MOCHI’S UNEXPECTED DELIVERY"
      description=""
      className={"surprise-delivery delivery-" + popup.style}
    >
      <div className="delivery-illustration">
        <Mochi expression={popup.expression} />
        <span className="delivery-stamp">FOR MAYBE</span>
      </div>
      <p className="delivery-body">{popup.body}</p>
      <div className="delivery-buttons">
        <button
          className="primary-button"
          onClick={() => {
            setReply(
              popup.question
                ? "YESSS! Mochi senang kamu sempat makan. Peluk kecil buat kamu."
                : "Pesan disimpan di kantong hati. Mochi ikut senang ♡",
            );
            sound("squeak");
          }}
        >
          {popup.button}
        </button>
        {popup.question && (
          <button
            className="secondary-button"
            onClick={() => {
              setReply(
                "Belum juga nggak apa-apa. Kalau bisa, cari waktu buat makan yang nyaman ya, May. Mochi temenin.",
              );
              sound("note");
            }}
          >
            NOT YET
          </button>
        )}
      </div>
      {reply && (
        <p className="delivery-reply" role="status">
          {reply}
        </p>
      )}
      <button className="text-button" onClick={more}>
        ONE MORE PLEASE! <Sparkles size={15} />
      </button>
      <small className="delivery-count">
        tiny delivery {index + 1} of {popups.length}
      </small>
    </ExperienceFrame>
  );
}
