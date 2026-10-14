import type { CSSProperties, Ref } from "react";
import { ArrowLeft, Heart } from "lucide-react";
import { Mochi } from "./Mochi";
import { finalLetter } from "./data";
import type { Accessory } from "./mochi-data";
export function FinalPage({
  headingRef,
  hugging,
  accessory,
  onHug,
}: {
  headingRef: Ref<HTMLHeadingElement>;
  hugging: boolean;
  accessory: Accessory;
  onHug: () => void;
}) {
  return (
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
      <h1 tabIndex={-1} ref={headingRef}>
        One Last Thing, <em>May…</em>
      </h1>
      <article className="final-letter">
        <p>{finalLetter}</p>
        <div className={`final-hug ${hugging ? "hugging" : ""}`}>
          <Mochi expression={hugging ? "hug" : "happy"} accessory={accessory} />
          <Heart fill="currentColor" />
          <Mochi
            className="mochi-friend"
            expression={hugging ? "hug" : "happy"}
            accessory="ribbon"
          />
        </div>
        <button className="primary-button" onClick={onHug}>
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
  );
}
