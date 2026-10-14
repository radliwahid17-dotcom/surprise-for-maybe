import type { ReactNode } from "react";
import { ArrowRight, Mail } from "lucide-react";
import { Mochi, LogoStar } from "./Mochi";
import { notes } from "./data";
export function LoveNotes({
  onOpen,
  hiddenMochi,
}: {
  onOpen: (index: number) => void;
  hiddenMochi: ReactNode;
}) {
  return (
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
            Untuk hari yang berbeda-beda. Ada satu surat yang selalu bisa kamu
            buka.
          </p>
        </div>
        <span className="handwritten letter-hint">a hug, but in words ↙</span>
      </div>
      <div className="letters-grid">
        {notes.map((note, index) => (
          <button
            className={`letter-card ${note.color}`}
            key={note.id}
            onClick={() => onOpen(index)}
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
        {hiddenMochi}
      </div>
    </section>
  );
}
export function GamesCatalog({
  onCatch,
  onFind,
  onBubble,
  hiddenMochi,
  completed,
}: {
  onCatch: () => void;
  onFind: () => void;
  onBubble: () => void;
  hiddenMochi: ReactNode;
  completed: boolean;
}) {
  return (
    <section
      id="play"
      className="games-section section-wrap"
      aria-labelledby="games-title"
    >
      <div className="section-title-row">
        <div>
          <span className="eyebrow">LESS OVERTHINKING, MORE LITTLE JOYS</span>
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
            <button className="game-button" onClick={onCatch}>
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
            {hiddenMochi}
          </div>
          <div className="game-card-copy">
            <span className="eyebrow">02 / HELLO, LITTLE FRIEND</span>
            <h3>Find Mochi</h3>
            <p>
              Si kecil suka main petak umpet.
              <br />
              Bisa nemuin dia di dunia ini?
            </p>
            <button className="game-button" onClick={onFind}>
              {completed ? "Lihat petualanganmu" : "Where are you, Mochi?"}{" "}
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
            <button className="game-button" onClick={onBubble}>
              Time to pop! <ArrowRight size={16} />
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}
