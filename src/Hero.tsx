import { ArrowDown, ArrowRight, Heart, PawPrint } from "lucide-react";
import { Daisy, Mochi } from "./Mochi";
import { useCompanion } from "./Companion";
import { useUniverse } from "./universe/Universe";
export function Hero({
  onPet,
  superhero,
}: {
  onPet: () => void;
  superhero: boolean;
}) {
  const mochi = useCompanion();
  const world = useUniverse();
  return (
    <section className="hero section-wrap" aria-labelledby="hero-title">
      <div className="hero-copy">
        <div className="eyebrow hero-eyebrow">
          <span className="tiny-star">✦</span> A TINY UNIVERSE MADE JUST FOR YOU
        </div>
        <h1 id="hero-title" tabIndex={-1}>
          A little happiness,
          <br />
          just for <em>Maybe.</em>
          <svg className="title-heart" viewBox="0 0 64 66" aria-hidden="true">
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
          <br className="desktop-break" /> dan biarin dunia kecil ini bikin kamu
          senyum hari ini.
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
        <a className="hero-room-link" href="#mochi-room">
          <PawPrint size={14} /> A tiny bunny is waiting for you{" "}
          <ArrowRight size={14} />
        </a>
      </div>
      <div
        className="hero-art"
        aria-label="Dunia kecil Mochi di antara awan, bunga, dan hati"
        onPointerMove={(event) => {
          if (
            !world.progress.effects ||
            !window.matchMedia("(hover: hover) and (pointer: fine)").matches ||
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
          )
            return;
          const box = event.currentTarget.getBoundingClientRect();
          event.currentTarget.style.setProperty(
            "--parallax-x",
            ((event.clientX - box.x - box.width / 2) / box.width) * 12 + "px",
          );
          event.currentTarget.style.setProperty(
            "--parallax-y",
            ((event.clientY - box.y - box.height / 2) / box.height) * 12 + "px",
          );
        }}
        onPointerLeave={(event) => {
          event.currentTarget.style.setProperty("--parallax-x", "0px");
          event.currentTarget.style.setProperty("--parallax-y", "0px");
        }}
      >
        <div className="pink-halo" aria-hidden="true" />
        <div className="art-orbit" aria-hidden="true" />
        <span className="pink-spark pink-spark-one" aria-hidden="true">
          ✦
        </span>
        <span className="pink-spark pink-spark-two" aria-hidden="true">
          ✧
        </span>
        <span className="pink-spark pink-spark-three" aria-hidden="true">
          ✿
        </span>
        <span className="art-heart heart-one">♥</span>
        <span className="art-heart heart-two">♡</span>
        <span className="art-sparkle">✦</span>
        <div className="art-daisy">
          <Daisy />
        </div>
        <button className="hero-mochi" aria-label="Sapa Mochi" onClick={onPet}>
          <Mochi
            superhero={superhero}
            expression={mochi.expression}
            accessory={mochi.profile.accessory}
          />
        </button>
        <div className="art-speech">
          Hey May!
          <br />
          You got this! <span>✧</span>
        </div>
        <div className="art-tag">
          <span>♡</span> Mochi loves you
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
  );
}
