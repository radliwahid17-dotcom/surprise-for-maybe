import { useState, type CSSProperties } from "react";
import { Heart, Mail, Moon, Star } from "lucide-react";
import { Mochi } from "../Mochi";
import { useUniverse } from "./Universe";
import { starLetter } from "./data";
import { ExperienceFrame, StarFragment } from "./Shared";
import type { ExperienceActions } from "./Treats";
const letterPaths: Record<string, string> = {
  M: "12,88 12,20 50,57 88,20 88,88",
  A: "13,88 49,17 87,88 71,57 29,57",
  Y: "14,19 49,55 86,19 49,55 49,88",
  B: "19,89 19,18 62,18 85,34 66,53 19,53 67,53 88,72 66,89 19,89",
  E: "87,18 18,18 18,54 76,54 18,54 18,88 87,88",
};
const skyNotes = [
  "Bintang ini kecil, tapi cukup buat jadi pengingat: kamu nggak sendirian.",
  "Mochi mengirim pesan dari bulan: tempat duduk Maybe masih disimpan.",
  "Langit boleh gelap. Hal hangat tidak harus terang sekali.",
  "Kalau hari ini ramai, lihat satu titik kecil dulu. Kita pelan-pelan.",
  "Radli nitip harapan: semoga ada hal baik yang menemukanmu.",
  "Tidak semua arah harus dipilih malam ini. Boleh istirahat dulu.",
  "Bintang ini bersinar tanpa tahu siapa yang melihat. Usahamu juga tetap berarti.",
  "May, gua nggak bisa ngasih seluruh langit. Jadi gua bikin satu yang kecil buat lu.",
];
export function LittleNightSky({ sound, celebrate }: ExperienceActions) {
  const world = useUniverse();
  const [note, setNote] = useState(
    "Sentuh bintang. Ada cerita kecil yang disimpan di cahaya.",
  );
  const [heartLetter, setHeartLetter] = useState(false);
  const visited = "MAYBE"
    .split("")
    .filter((l) => world.progress.stats["sky-" + l.toLowerCase()] > 0);
  const complete = visited.length === 5;
  function letter(l: string) {
    if (!visited.includes(l)) world.bump("sky-" + l.toLowerCase());
    world.award("stars");
    sound("sparkle");
    setNote(
      "Huruf " +
        l +
        " menemukan tempatnya. Langit ini punya satu nama favorit.",
    );
    if (!visited.includes(l) && visited.length === 4) {
      world.egg("constellation");
      celebrate();
      setNote("MAYBE. Namamu sengaja ditulis di sini, May. — Radli");
    }
  }
  return (
    <ExperienceFrame
      title="A little night sky"
      kicker="YOUR NAME, KEPT AMONG THE STARS"
      description="Lima huruf kecil. Beberapa surat yang belum ditemukan. Satu langit yang sabar."
      className="sky-experience"
    >
      <div
        className={"interactive-sky " + (world.progress.night ? "moonlit" : "")}
      >
        <button
          className="sky-moon"
          onClick={() => {
            world.setting("night", !world.progress.night);
            world.egg("moon-toggle");
            world.award("moon");
            sound("note");
            setNote(
              world.progress.night
                ? "Lampu dunia kecil dinyalakan lagi."
                : "Mode malam menyala. Kita kecilkan bisingnya sebentar.",
            );
          }}
          aria-label="Ganti mode malam"
          aria-pressed={world.progress.night}
        >
          <Moon fill="currentColor" />
        </button>
        {skyNotes.map((message, i) => (
          <button
            className={"touch-star sky-star-" + i}
            key={i}
            style={{
              left: 14 + (i % 4) * 24 + "%",
              top: (i < 4 ? 25 : 88) + "%",
            }}
            onClick={() => {
              setNote(message);
              world.award("stars");
              sound("sparkle");
            }}
            aria-label={"Bintang pesan " + (i + 1)}
          >
            <Star size={18} fill="currentColor" />
          </button>
        ))}
        <div className="maybe-constellation">
          {"MAYBE".split("").map((l) => (
            <button
              className={visited.includes(l) ? "lit" : ""}
              key={l}
              onClick={() => letter(l)}
              aria-label={"Bintang huruf " + l}
              aria-pressed={visited.includes(l)}
            >
              <svg viewBox="0 0 100 110" aria-hidden="true">
                <polyline
                  points={letterPaths[l]}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                {letterPaths[l].split(" ").map((p, i) => {
                  const [x, y] = p.split(",");
                  return (
                    <circle key={i} cx={x} cy={y} r="4" fill="currentColor" />
                  );
                })}
              </svg>
              <span>{l}</span>
            </button>
          ))}
        </div>
        <button
          className="touch-star golden-star"
          aria-label="Bintang emas rahasia"
          onClick={() => {
            world.egg("golden-star");
            world.award("adorable");
            sound("reveal");
            celebrate();
            setNote(
              "Golden compliment: May, lu lucu tanpa harus berusaha. Komite kelinci baru saja mengesahkan.",
            );
          }}
        >
          <Star size={24} fill="currentColor" />
        </button>
        <span className="sky-caption">a sky for one very special name</span>
      </div>
      <p className="sky-note" role="status">
        {note}
      </p>
      <div className="sky-letter-actions">
        <button
          className="secondary-button"
          onClick={() => {
            setHeartLetter((v) => !v);
            sound("note");
          }}
        >
          <Heart size={16} />
          Surat dari rasi hati
        </button>
      </div>
      {heartLetter && (
        <article className="constellation-letter">
          <div className="little-heart-constellation" aria-hidden="true">
            {Array.from({ length: 12 }, (_, i) => (
              <i
                key={i}
                style={{
                  left:
                    50 +
                    Math.pow(Math.sin((i / 12) * Math.PI * 2), 3) * 42 +
                    "%",
                  top:
                    48 -
                    (13 * Math.cos((i / 12) * Math.PI * 2) -
                      5 * Math.cos(((2 * i) / 12) * Math.PI * 2) -
                      2 * Math.cos(((3 * i) / 12) * Math.PI * 2) -
                      Math.cos(((4 * i) / 12) * Math.PI * 2)) *
                      2.5 +
                    "%",
                }}
              >
                ✦
              </i>
            ))}
          </div>
          <p>
            May, kalau perasaan lu hari ini susah dijelasin, gua tetap mau duduk
            di sebelahnya. Nggak semua hal perlu nama supaya pantas ditemani.
          </p>
          <span className="handwritten">— Radli ♡</span>
        </article>
      )}
      {complete && (
        <>
          <article className="constellation-letter">
            <Mail size={20} />
            <h3>A name written softly</h3>
            <p>
              Gua nulis MAYBE di langit kecil ini supaya lu punya satu tempat
              yang nggak perlu nyari cara buat diterima. Nama lu udah ada di
              pintunya dari awal.
            </p>
            <span className="handwritten">— Radli ♡</span>
          </article>
          <StarFragment id="sky" />
        </>
      )}
      {!complete && (
        <p className="sky-progress">
          {visited.length}/5 huruf rasi ditemukan. Mereka tetap menyala saat
          kamu kembali.
        </p>
      )}
    </ExperienceFrame>
  );
}
export function SecretChapter({
  sound,
  onBack,
}: {
  sound: ExperienceActions["sound"];
  onBack: () => void;
}) {
  const world = useUniverse();
  const [opened, setOpened] = useState(false);
  if (world.progress.fragments.length < 7)
    return (
      <ExperienceFrame
        title="Seven little stars"
        kicker="A STORY STILL GROWING"
        description="Ada tujuh potongan cerita di dunia ini. Kumpulkan dulu, lalu Mochi akan membuka amplopnya."
      >
        <p>{world.progress.fragments.length}/7 bintang ditemukan.</p>
      </ExperienceFrame>
    );
  return (
    <ExperienceFrame
      title="A little universe, just for May."
      kicker="THE SEVEN-STAR SECRET CHAPTER"
      description=""
      className={"secret-chapter " + (opened ? "chapter-open" : "")}
    >
      <div className="chapter-sky">
        <div className="chapter-heart-stars" aria-hidden="true">
          {Array.from({ length: 21 }, (_, i) => {
            const t = (i / 21) * Math.PI * 2;
            return (
              <i
                key={i}
                style={
                  {
                    "--heart-x": 50 + Math.pow(Math.sin(t), 3) * 42 + "%",
                    "--heart-y":
                      47 -
                      (13 * Math.cos(t) -
                        5 * Math.cos(2 * t) -
                        2 * Math.cos(3 * t) -
                        Math.cos(4 * t)) *
                        2.55 +
                      "%",
                    "--star-x": ((i * 37) % 95) + "%",
                    "--star-y": ((i * 29) % 90) + "%",
                    "--star-delay": i * 0.04 + "s",
                  } as CSSProperties
                }
              >
                ✦
              </i>
            );
          })}
        </div>
        <Mochi expression={opened ? "kiss" : "blush"} accessory="flower" />
        <button
          className="chapter-envelope"
          onClick={() => {
            setOpened(true);
            sound("reveal");
            world.bump("chapter");
          }}
          aria-label="Buka surat tujuh bintang"
          disabled={opened}
        >
          <span className="envelope-fold" />
          <Heart fill="currentColor" />
        </button>
      </div>
      {!opened ? (
        <>
          <p className="chapter-invitation">
            Tujuh bintang tadi ternyata menuju satu amplop kecil. Mochi bilang:
            ini memang disimpan buat kamu.
          </p>
          <button
            className="primary-button"
            onClick={() => {
              setOpened(true);
              sound("reveal");
              world.bump("chapter");
            }}
          >
            Open Radli’s letter <Mail size={16} />
          </button>
        </>
      ) : (
        <>
          <article className="seven-star-letter">{starLetter}</article>
          <div className="chapter-actions">
            <button
              className="secondary-button"
              onClick={() => {
                setOpened(false);
                sound("note");
              }}
            >
              Read Again
            </button>
            <button className="primary-button" onClick={onBack}>
              Back to Our Little Universe
            </button>
          </div>
        </>
      )}
    </ExperienceFrame>
  );
}
