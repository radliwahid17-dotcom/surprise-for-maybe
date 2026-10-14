import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Heart, Play, RotateCcw, Pause } from "lucide-react";
import { Mochi } from "./Mochi";
import type { Accessory } from "./mochi-data";

type GameProps = {
  celebrate: () => void;
  sound: () => void;
  onComplete?: (score: number) => void;
  bestScore?: number;
  accessory?: Accessory;
};
type FallingHeart = { id: number; left: number; born: number; size: number };

export function CatchGame({
  celebrate,
  sound,
  onComplete,
  bestScore = 0,
  accessory = "none",
}: GameProps) {
  const [phase, setPhase] = useState<"ready" | "playing" | "paused" | "done">(
    "ready",
  );
  const [seconds, setSeconds] = useState(30);
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState<FallingHeart[]>([]);
  const serial = useRef(0);
  const finish = useRef(celebrate);
  finish.current = celebrate;
  const completion = useRef(onComplete);
  completion.current = onComplete;
  const scoreRef = useRef(score);
  scoreRef.current = score;
  const remainingTime = useRef(30000);
  const pausedAt = useRef(0);
  const caught = useRef(new Set<number>());
  useEffect(() => {
    if (phase !== "playing") return;
    const start = Date.now();
    const initialRemaining = remainingTime.current;
    let completed = false;
    let nextSpawn = 0;
    const tick = () => {
      const now = Date.now();
      remainingTime.current = Math.max(0, initialRemaining - (now - start));
      const remaining = Math.ceil(remainingTime.current / 1000);
      setSeconds(remaining);
      if (remaining === 0) {
        if (completed) return;
        completed = true;
        setPhase("done");
        setHearts([]);
        finish.current();
        completion.current?.(scoreRef.current);
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
    return () => {
      clearInterval(interval);
      remainingTime.current = Math.max(
        0,
        initialRemaining - (Date.now() - start),
      );
    };
  }, [phase]);
  useEffect(() => {
    const pauseHidden = () => {
      if (document.hidden && phase === "playing") {
        pausedAt.current = Date.now();
        setPhase("paused");
      }
    };
    document.addEventListener("visibilitychange", pauseHidden);
    return () => document.removeEventListener("visibilitychange", pauseHidden);
  }, [phase]);
  function start() {
    caught.current.clear();
    remainingTime.current = 30000;
    setScore(0);
    setSeconds(30);
    setHearts([]);
    setPhase("playing");
  }
  function pause() {
    pausedAt.current = Date.now();
    setPhase("paused");
  }
  function resume() {
    const duration = Date.now() - pausedAt.current;
    setHearts((previous) =>
      previous.map((heart) => ({ ...heart, born: heart.born + duration })),
    );
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
      <div className="catch-extras">
        <span>Personal best: {Math.max(bestScore, score)} ♡</span>
        {phase === "playing" && (
          <button className="text-button" onClick={pause}>
            <Pause size={13} /> Jeda game
          </button>
        )}
        <span className="catch-combo" aria-live="polite">
          {score > 0 && score % 5 === 0
            ? "A hug-sized combo! ✨"
            : "Mochi is cheering for you"}
        </span>
      </div>
      <div
        className={`catch-board ${phase}`}
        aria-label="Area permainan tangkap hati"
      >
        <div className="game-cloud cloud-one" />
        <div className="game-cloud cloud-two" />
        {(phase === "playing" || phase === "paused") &&
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
              disabled={phase !== "playing"}
              onClick={() => catchHeart(heart.id)}
            >
              <Heart fill="currentColor" strokeWidth={1.5} />
            </button>
          ))}
        {phase === "ready" && (
          <div className="game-overlay">
            <Mochi accessory={accessory} />
            <button className="primary-button" onClick={start}>
              <Play size={16} fill="currentColor" /> Mulai tangkap hati
            </button>
          </div>
        )}
        {phase === "paused" && (
          <div className="game-overlay pause-overlay">
            <Mochi expression="tired" accessory={accessory} />
            <h3>Take a tiny breath.</h3>
            <p>Hatinya nunggu. Mochi juga.</p>
            <button className="primary-button" onClick={resume}>
              <Play size={15} /> Lanjut tangkap hati
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
export function BubbleGame({
  celebrate,
  sound,
  onComplete,
  accessory = "none",
}: GameProps) {
  const [popped, setPopped] = useState<number[]>([]);
  const poppedIds = useRef(new Set<number>());
  function reset() {
    poppedIds.current.clear();
    setPopped([]);
  }
  function pop(index: number) {
    if (poppedIds.current.has(index)) return;
    poppedIds.current.add(index);
    sound();
    const next = [...poppedIds.current];
    setPopped(next);
    if (next.length === bubbleWords.length) {
      celebrate();
      onComplete?.(next.length);
    }
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
        <button className="text-button" onClick={reset}>
          <RotateCcw size={14} /> Ulangi
        </button>
      </div>
      {popped.length === bubbleWords.length ? (
        <div className="bubble-result" role="status">
          <Mochi className="dancing" accessory={accessory} />
          <h3>GOOD JOB MAY! 😎</h3>
          <p>Sekarang dunia boleh nyebelin, tapi kamu tetap keren.</p>
          <button className="primary-button" onClick={reset}>
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
