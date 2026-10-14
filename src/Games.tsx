import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Heart, Play, RotateCcw } from "lucide-react";
import { Mochi } from "./Mochi";

type GameProps = { celebrate: () => void; sound: () => void };
type FallingHeart = { id: number; left: number; born: number; size: number };

export function CatchGame({ celebrate, sound }: GameProps) {
  const [phase, setPhase] = useState<"ready" | "playing" | "done">("ready");
  const [seconds, setSeconds] = useState(30);
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState<FallingHeart[]>([]);
  const serial = useRef(0);
  const finish = useRef(celebrate);
  finish.current = celebrate;
  const caught = useRef(new Set<number>());
  useEffect(() => {
    if (phase !== "playing") return;
    const start = Date.now();
    let nextSpawn = 0;
    const tick = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((30000 - (now - start)) / 1000));
      setSeconds(remaining);
      if (remaining === 0) {
        setPhase("done");
        setHearts([]);
        finish.current();
        return;
      }
      if (now >= nextSpawn) {
        nextSpawn = now + 480;
        setHearts((previous) => [
          ...previous.filter((heart) => now - heart.born < 4100),
          {
            id: serial.current++,
            left: 5 + Math.random() * 80,
            born: now,
            size: 36 + Math.random() * 14,
          },
        ]);
      }
    };
    tick();
    const interval = window.setInterval(tick, 100);
    return () => clearInterval(interval);
  }, [phase]);
  function start() {
    caught.current.clear();
    setScore(0);
    setSeconds(30);
    setHearts([]);
    setPhase("playing");
  }
  function catchHeart(id: number) {
    if (phase !== "playing" || caught.current.has(id)) return;
    caught.current.add(id);
    sound();
    setScore((previous) => previous + 1);
    setHearts((previous) => previous.filter((heart) => heart.id !== id));
  }
  return (
    <div className="game-content">
      <span className="eyebrow">a pocketful of love</span>
      <h2 id="modal-title">Catch the Love</h2>
      <p>
        Tap hati yang turun. Kumpulkan sebanyak mungkin dalam 30 detik! Pakai
        Tab + Enter juga bisa.
      </p>
      <div className="game-score">
        <span>
          <Heart size={16} /> <b>{score}</b> hati
        </span>
        <span className={seconds <= 5 ? "time-warning" : ""}>
          {seconds}s tersisa
        </span>
      </div>
      <div
        className={`catch-board ${phase}`}
        aria-label="Area permainan tangkap hati"
      >
        <div className="game-cloud cloud-one" />
        <div className="game-cloud cloud-two" />
        {phase === "playing" &&
          hearts.map((heart) => (
            <button
              key={heart.id}
              className="falling-heart"
              style={
                {
                  left: `${heart.left}%`,
                  "--heart-size": `${heart.size}px`,
                } as CSSProperties
              }
              aria-label="Tangkap hati"
              onClick={() => catchHeart(heart.id)}
            >
              <Heart fill="currentColor" strokeWidth={1.5} />
            </button>
          ))}
        {phase === "ready" && (
          <div className="game-overlay">
            <Mochi />
            <button className="primary-button" onClick={start}>
              <Play size={16} fill="currentColor" /> Mulai tangkap hati
            </button>
          </div>
        )}
        {phase === "done" && (
          <div className="game-overlay result" role="status">
            <span className="result-emoji">💗</span>
            <h3>CONGRATULATIONS!</h3>
            <p>You just collected 999 hugs from Radli!</p>
            <span>
              {score} hati tertangkap. Peluknya tetap nggak terbatas, May.
            </span>
            <button className="primary-button" onClick={start}>
              <RotateCcw size={16} /> Main lagi
            </button>
          </div>
        )}
        <span className="board-ground">made of love, sprinkled with silly</span>
      </div>
    </div>
  );
}

const bubbleWords = [
  "stres",
  "capek",
  "overthinking",
  "bad mood",
  "deadline",
  "ragu",
  "kesel",
  "khawatir",
  "stres",
  "capek",
  "bad mood",
  "overthinking",
];
export function BubbleGame({ celebrate, sound }: GameProps) {
  const [popped, setPopped] = useState<number[]>([]);
  function pop(index: number) {
    if (popped.includes(index)) return;
    sound();
    const next = [...popped, index];
    setPopped(next);
    if (next.length === bubbleWords.length) celebrate();
  }
  return (
    <div className="game-content">
      <span className="eyebrow">pop a little, breathe a little</span>
      <h2 id="modal-title">Anti-Bad-Mood Bubble</h2>
      <p>
        Bayangin tiap bubble satu beban kecil. Tap untuk melepasnya, pelan-pelan
        juga boleh.
      </p>
      <div className="game-score">
        <span>
          🫧 {popped.length} / {bubbleWords.length} dilepas
        </span>
        <button className="text-button" onClick={() => setPopped([])}>
          <RotateCcw size={14} /> Ulangi
        </button>
      </div>
      {popped.length === bubbleWords.length ? (
        <div className="bubble-result" role="status">
          <Mochi className="dancing" />
          <h3>GOOD JOB MAY! 😎</h3>
          <p>Sekarang dunia boleh nyebelin, tapi kamu tetap keren.</p>
          <button className="primary-button" onClick={() => setPopped([])}>
            Pop lagi? 🫧
          </button>
        </div>
      ) : (
        <div className="bubble-board">
          {bubbleWords.map((word, index) => (
            <button
              key={index}
              className={`bubble bubble-${index % 4} ${popped.includes(index) ? "popped" : ""}`}
              style={{ "--delay": `${index * -0.7}s` } as CSSProperties}
              onClick={() => pop(index)}
              disabled={popped.includes(index)}
              aria-label={`Pecahkan bubble ${word}`}
            >
              <span>{word}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
