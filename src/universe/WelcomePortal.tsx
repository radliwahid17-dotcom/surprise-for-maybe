import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Mochi } from "../Mochi";
export function WelcomePortal({
  onEnter,
  onGrant,
}: {
  onEnter: () => void;
  onGrant: () => void;
}) {
  const [granted, setGranted] = useState(false);
  const [refusals, setRefusals] = useState(0);
  const [answer, setAnswer] = useState("");
  return (
    <section className={"welcome-portal " + (granted ? "portal-open" : "")}>
      <div className="portal-illustration">
        <div className="portal-ring" />
        <span className="portal-cloud cloud" />
        <Mochi expression={granted ? "jump" : refusals ? "cry" : "confused"} />
        <i className="portal-star one">✦</i>
        <i className="portal-star two">✧</i>
      </div>
      <span className="eyebrow">A VERY SPECIAL DELIVERY</span>
      <h2 id="modal-title">
        {granted ? "ACCESS GRANTED!" : "WAIT WAIT WAIT!!"}
      </h2>
      {!granted ? (
        <>
          <p className="portal-question">
            Are you… <em>MAYBE?!</em>
          </p>
          <div className="portal-choices">
            <button
              className="primary-button"
              onClick={() => {
                setGranted(true);
                onGrant();
              }}
            >
              YESSS THAT’S MEEE 💗
            </button>
            <button
              className={"secondary-button nope-shift-" + Math.min(refusals, 2)}
              onClick={() => setRefusals((n) => Math.min(n + 1, 2))}
            >
              NOPE, WRONG PERSON 🤨
            </button>
          </div>
          {refusals > 0 && (
            <p className="portal-reply" role="status">
              HUH?! TAPI RADLI BILANG CUMA MAYBE YANG BOLEH MASUK 😭
              <small>
                Kalau kamu cuma bercanda, Mochi percaya kok. Tombolnya tetap di
                sini.
              </small>
            </p>
          )}
        </>
      ) : (
        <>
          <p className="portal-question">
            Welcome to your very own little universe, <em>May.</em>
          </p>
          <p>
            Made with love, chaos, and a suspicious amount of effort by Radli.
          </p>
          {!answer ? (
            <div className="portal-author">
              <span>Ada seseorang yang pengen kamu senyum. Tebak siapa?</span>
              <div className="portal-choices">
                <button
                  className="text-button"
                  onClick={() =>
                    setAnswer("YAAA BENERRR!! 🥳💗 +1000 happiness points!")
                  }
                >
                  Radli yaaa? 😭
                </button>
                <button
                  className="text-button"
                  onClick={() =>
                    setAnswer(
                      "MASA GATAU SIHHH 😤 Ya Radli lah, siapa lagi WKWKWK!",
                    )
                  }
                >
                  Siapa tuh? 🤨
                </button>
              </div>
            </div>
          ) : (
            <p className="welcome-answer" role="status">
              {answer}
            </p>
          )}
          <button className="primary-button portal-enter" onClick={onEnter}>
            Masuk ke duniaku <ArrowRight size={16} />
          </button>
        </>
      )}
      <span className="modal-small">
        one tiny portal, an unreasonable amount of love ♡
      </span>
    </section>
  );
}
