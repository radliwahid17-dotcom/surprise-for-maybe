import { useState } from "react";
import {
  Heart,
  Music2,
  PawPrint,
  Moon,
  Play,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { Mochi } from "../Mochi";
import { useCompanion } from "../Companion";
import { snacks, type CareAction } from "../mochi-data";
import { useUniverse } from "./Universe";
import { ToyIcon } from "./Illustrations";
import { ExperienceFrame, StarFragment } from "./Shared";
import type { ExperienceActions } from "./Treats";
const wants = [
  {
    id: "strawberry",
    name: "Stroberi",
    wish: "Mochi pengen stroberi yang pink-manis.",
    action: "feed",
    kind: "berry",
  },
  {
    id: "cookie",
    name: "Cookie",
    wish: "Mochi mendengar suara kriuk. Dia pengen cookie.",
    action: "feed",
    kind: "cookie",
  },
  {
    id: "milk",
    name: "Susu hangat",
    wish: "Mochi mau minum susu hangat dari gelas kecil.",
    action: "feed",
    kind: "coffee",
  },
  {
    id: "mochi",
    name: "Mochi manis",
    wish: "Mochi penasaran sama camilan yang namanya sama: mochi manis.",
    action: "feed",
    kind: "cookie",
  },
  {
    id: "pet",
    name: "Elus kepala",
    wish: "Telinganya capek jadi antena. Mochi mau dielus kepalanya.",
    action: "pet",
  },
  {
    id: "hug",
    name: "Peluk kecil",
    wish: "Mochi membuka dua tangan mungil. Dia mau peluk kecil.",
    action: "hug",
  },
  {
    id: "dance",
    name: "Ajak dance",
    wish: "Mochi punya energi kebanyakan. Dia mau diajak dance.",
    action: "dance",
  },
  {
    id: "sleep",
    name: "Istirahat",
    wish: "Mochi mulai menguap. Dia mau istirahat sebentar.",
    action: "sleep",
  },
] as const;
function shuffle() {
  const items = [...wants];
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items.slice(0, 5);
}
export function MakeMochiHappy({ sound, celebrate }: ExperienceActions) {
  const world = useUniverse();
  const mochi = useCompanion();
  const [requests, setRequests] = useState(shuffle);
  const [phase, setPhase] = useState<"ready" | "playing" | "done">("ready");
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [attempts, setAttempts] = useState(0);
  const request = requests[round];
  const start = () => {
    setRequests(shuffle());
    setPhase("playing");
    setRound(0);
    setScore(0);
    setCorrect(false);
    setFeedback("");
    setAttempts(0);
    if (mochi.sleeping) mochi.care("wake");
    sound("squeak");
  };
  function choose(id: string) {
    if (correct) return;
    setAttempts((n) => n + 1);
    if (id !== request.id) {
      setFeedback(
        "Mochi: lucu sih, tapi aku lagi pengen " +
          request.name.toLowerCase() +
          ". Coba satu lagi, kita nggak buru-buru.",
      );
      sound("pop");
      return;
    }
    const food = snacks.find((s) => s.id === id);
    mochi.care(
      request.action as CareAction,
      food ? { emoji: food.emoji, line: food.line } : undefined,
    );
    setCorrect(true);
    setScore((n) => n + 1);
    setFeedback(
      "YESS! Keinginan kelinci dipahami. " +
        (food
          ? "Nom nom… telinganya ikut senang."
          : "Mochi jadi lebih nyaman."),
    );
    sound(food ? "bubble" : "squeak");
  }
  function next() {
    if (round === 4) {
      setPhase("done");
      world.bump("happy");
      world.award("brave");
      celebrate();
      sound("note");
      if (mochi.sleeping) mochi.care("wake");
      mochi.care("celebrate");
      return;
    }
    if (mochi.sleeping) mochi.care("wake");
    setRound((n) => n + 1);
    setCorrect(false);
    setFeedback("");
  }
  const distractors = wants.filter((w) => w.id !== request.id);
  const options = [
    request,
    distractors[round % distractors.length],
    distractors[(round + 3) % distractors.length],
  ];
  if (round % 2 === 0) options.reverse();
  return (
    <ExperienceFrame
      title="Make Mochi happy"
      kicker="A LITTLE GAME OF LISTENING"
      description="Lima keinginan kecil. Pilih yang cocok; kalau belum pas, boleh coba lagi tanpa kehilangan poin."
      className="happy-game"
    >
      <div className={"happy-game-scene " + (correct ? "happy-correct" : "")}>
        <Mochi
          expression={
            phase === "ready"
              ? "confused"
              : phase === "done"
                ? "celebrate"
                : correct
                  ? mochi.expression
                  : "happy"
          }
          accessory={mochi.profile.accessory}
        />
        {correct && <span className="happy-spark">✦</span>}
      </div>
      {phase === "ready" ? (
        <>
          <p>Mochi punya beberapa ide random. Kamu siap jadi teman kecilnya?</p>
          <button className="primary-button" onClick={start}>
            <Play size={16} />
            Mulai Make Mochi Happy
          </button>
        </>
      ) : phase === "playing" ? (
        <>
          <div className="happy-score">
            <span>Keinginan {round + 1}/5</span>
            <span>{score} happy hearts</span>
          </div>
          <p className="mochi-wish" data-craving={request.id}>
            {request.wish}
          </p>
          <div className="happy-choices">
            {options.map((o) => (
              <button
                key={o.id}
                disabled={correct}
                className="happy-choice"
                onClick={() => choose(o.id)}
              >
                {o.id === "mochi" ? (
                  <svg viewBox="0 0 120 120" aria-hidden="true">
                    <path
                      d="M31 92L95 28"
                      stroke="#b99670"
                      strokeWidth="7"
                      strokeLinecap="round"
                    />
                    <circle cx="37" cy="84" r="19" fill="#b9d0a6" />
                    <circle
                      cx="59"
                      cy="60"
                      r="20"
                      fill="#fff2df"
                      stroke="#dcc5b3"
                      strokeWidth="2"
                    />
                    <circle cx="83" cy="35" r="20" fill="#e8b1c7" />
                    <path
                      d="M77 26Q82 19 91 28"
                      stroke="#fff6ee"
                      strokeWidth="3"
                      fill="none"
                    />
                  </svg>
                ) : "kind" in o ? (
                  <ToyIcon kind={o.kind} />
                ) : o.id === "pet" ? (
                  <PawPrint />
                ) : o.id === "hug" ? (
                  <Heart />
                ) : o.id === "dance" ? (
                  <Music2 />
                ) : (
                  <Moon />
                )}
                <span>{o.name}</span>
              </button>
            ))}
          </div>
          <p className="happy-feedback" role="status">
            {feedback ||
              "Pilih yang Mochi minta. Dia sudah bilang pelan-pelan."}
          </p>
          {correct && (
            <button className="primary-button" onClick={next}>
              {round === 4 ? "Lihat hasil kecil kita" : "Keinginan berikutnya"}
              <ArrowRight size={16} />
            </button>
          )}
        </>
      ) : (
        <>
          <div className="happy-result" role="status">
            <h3>{score}/5 happy hearts!</h3>
            <p>
              {attempts === 5
                ? "Lima keinginan, lima kali kelinci dipahami."
                : "Kamu tetap mencoba sampai kelincinya nyaman. Itu yang paling penting."}
            </p>
            <p>Radli bilang: perhatian kecil kamu punya arti besar, May.</p>
          </div>
          <StarFragment id="happy" />
          <button className="secondary-button" onClick={start}>
            <RotateCcw size={15} />
            Main lagi bareng Mochi
          </button>
        </>
      )}
    </ExperienceFrame>
  );
}
