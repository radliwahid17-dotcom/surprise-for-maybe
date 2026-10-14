import { memo } from "react";
import { Mochi } from "../Mochi";
import type { StickerKind } from "./data";
import type { PlantKind } from "./Universe";

function ToyIconView({
  kind,
  className = "",
}: {
  kind: StickerKind;
  className?: string;
}) {
  const shapes = {
    cloud: (
      <>
        <path
          d="M27 80C7 77 9 51 30 50C31 23 65 19 77 43C99 37 113 62 97 79Z"
          fill="#e1d9ef"
        />
        <path d="M37 84L31 101M56 85L50 104M79 83L74 100" stroke="#a989bc" />
        <circle cx="43" cy="61" r="3" />
        <circle cx="73" cy="61" r="3" />
        <path d="M54 73Q59 79 65 73" fill="none" />
      </>
    ),
    coffee: (
      <>
        <path d="M31 47H85V83Q81 102 58 102Q34 100 31 83Z" fill="#f1c7d2" />
        <path d="M85 57Q109 52 105 73Q99 87 85 84" fill="none" />
        <path
          d="M42 29Q32 20 43 10M59 28Q70 18 58 9M76 29Q67 19 78 10"
          fill="none"
          stroke="#b9a48b"
        />
        <path d="M20 104H100" stroke="#d8baac" />
        <path
          d="M55 67C45 55 33 69 56 84C83 67 66 55 55 67Z"
          fill="#fffaf4"
          stroke="none"
        />
      </>
    ),
    crown: (
      <>
        <path d="M21 84L15 31L42 52L60 21L79 53L105 30L98 84Z" fill="#f2d993" />
        <path d="M22 88H98V100H22Z" fill="#e6b8c9" />
        <circle cx="60" cy="65" r="9" fill="#d998b0" />
        <circle cx="15" cy="28" r="5" />
        <circle cx="60" cy="18" r="5" />
        <circle cx="105" cy="27" r="5" />
      </>
    ),
    heart: (
      <>
        <path d="M60 40C36 8 0 46 60 99C122 46 88 8 60 40Z" fill="#e9acbf" />
        <path
          d="M31 44Q37 30 47 35"
          stroke="#fff8ee"
          fill="none"
          strokeWidth="5"
        />
        <path d="M46 66Q59 80 75 65" fill="none" />
        <circle cx="42" cy="54" r="3" />
        <circle cx="79" cy="54" r="3" />
      </>
    ),
    berry: (
      <>
        <path d="M25 39Q12 77 60 107Q110 76 96 39Z" fill="#e6a4b5" />
        <path d="M26 39L36 20L53 31L60 13L70 32L88 20L94 40Z" fill="#aec297" />
        {[
          [39, 52],
          [59, 55],
          [79, 52],
          [45, 72],
          [69, 76],
          [57, 92],
        ].map(([x, y]) => (
          <ellipse
            key={x + y}
            cx={x}
            cy={y}
            rx="2"
            ry="4"
            fill="#fff4db"
            stroke="none"
          />
        ))}
      </>
    ),
    flower: (
      <>
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <ellipse
            key={a}
            cx="60"
            cy="38"
            rx="16"
            ry="25"
            transform={"rotate(" + a + " 60 61)"}
            fill="#fff5df"
          />
        ))}
        <circle cx="60" cy="61" r="17" fill="#eed386" />
        <circle cx="54" cy="59" r="2.5" />
        <circle cx="67" cy="59" r="2.5" />
        <path d="M55 67Q61 72 66 66" fill="none" />
      </>
    ),
    telescope: (
      <>
        <path d="M29 62L88 27L103 52L44 86Z" fill="#b3d6e1" />
        <path d="M82 29L91 22L109 53L99 59Z" fill="#d8bfdc" />
        <path d="M59 80L44 111M62 80L83 109M61 79V109" fill="none" />
        <path
          d="M19 19L22 28L31 31L22 34L19 43L16 34L7 31L16 28Z"
          fill="#e7c97f"
          stroke="none"
        />
      </>
    ),
    cookie: (
      <>
        <path
          d="M19 82Q5 40 40 24Q60 10 78 28Q119 35 102 81Q71 108 19 82Z"
          fill="#ebcb9d"
        />
        <path d="M26 78Q54 39 92 77M58 42L59 89" fill="none" stroke="#b88c69" />
        <path d="M46 83L82 89L75 110L39 102Z" fill="#fffaf3" />
        <path d="M48 92L66 96" fill="none" stroke="#b47991" />
      </>
    ),
    letter: (
      <>
        <path d="M13 31H107V97H13Z" fill="#f4d7df" />
        <path
          d="M13 32L60 66L107 32M13 97L46 60M107 97L73 61"
          fill="none"
          stroke="#c28c9e"
        />
        <path
          d="M59 67C47 52 33 68 59 86C86 69 72 52 59 67Z"
          fill="#c6859f"
          stroke="none"
        />
      </>
    ),
    book: (
      <>
        <path
          d="M12 27Q36 16 58 34Q81 16 107 27V98Q82 87 58 104Q37 88 12 98Z"
          fill="#d9cee7"
        />
        <path
          d="M58 34V104M24 44L45 50M24 61L45 65M74 48L94 41M74 65L94 59"
          fill="none"
          stroke="#ac90bc"
        />
        <path d="M81 24V70L89 63L98 65V21" fill="#eeb6c9" stroke="none" />
      </>
    ),
    bed: (
      <>
        <path d="M16 70H105V97H16Z" fill="#e8b8c9" />
        <rect x="16" y="49" width="39" height="20" rx="8" fill="#fff4e8" />
        <path
          d="M16 38V106M105 62V106M16 81H105"
          fill="none"
          stroke="#c99982"
          strokeWidth="7"
        />
        <path
          d="M73 50Q62 37 71 29M89 40Q80 26 92 19"
          fill="none"
          stroke="#b7a2c8"
        />
      </>
    ),
    glass: (
      <>
        <circle cx="49" cy="49" r="31" fill="#d9edf0" />
        <path d="M71 72L104 105" stroke="#d6a4b7" strokeWidth="17" />
        <circle cx="49" cy="49" r="24" fill="#eef8f6" />
        <path
          d="M31 44Q34 29 46 28"
          stroke="#fff"
          strokeWidth="5"
          fill="none"
        />
        <path
          d="M49 43C35 29 28 49 49 62C72 49 63 29 49 43Z"
          fill="#dca6b7"
          stroke="none"
        />
      </>
    ),
    bolt: (
      <>
        <path d="M65 10L22 68H51L43 110L99 51H70L81 10Z" fill="#f0d797" />
        <path
          d="M83 84C72 73 65 87 83 99C104 87 92 73 83 84Z"
          fill="#dea4b9"
          stroke="none"
        />
      </>
    ),
    moon: (
      <>
        <path
          d="M77 11C23 16 13 80 59 105C86 116 112 98 110 74C58 84 43 40 77 11Z"
          fill="#e9d397"
        />
        <path d="M70 60L81 65M70 81Q79 89 88 80" fill="none" />
        <path
          d="M97 17L100 26L110 29L100 32L97 42L94 32L85 29L94 26Z"
          fill="#d2b9dc"
          stroke="none"
        />
      </>
    ),
    shield: (
      <>
        <path
          d="M60 13L105 31V61Q101 94 60 112Q20 94 15 61V31Z"
          fill="#c8dbbd"
        />
        <path
          d="M38 60L54 76L82 43"
          fill="none"
          stroke="#7c9e76"
          strokeWidth="7"
        />
      </>
    ),
    water: (
      <>
        <path d="M22 54H77V98H22Z" fill="#bcdde3" />
        <path
          d="M26 55Q12 19 53 28Q84 25 72 57M76 69L97 57L107 68L78 92"
          fill="none"
          stroke="#a2c2c9"
          strokeWidth="8"
        />
        <path
          d="M105 79L101 91M114 84L111 100M95 77L89 86"
          fill="none"
          stroke="#9dbccc"
        />
      </>
    ),
    planet: (
      <>
        <ellipse cx="60" cy="61" rx="35" ry="36" fill="#e1bdd4" />
        <ellipse
          cx="60"
          cy="61"
          rx="57"
          ry="14"
          transform="rotate(-24 60 61)"
          fill="none"
          stroke="#e5c990"
          strokeWidth="8"
        />
        <path
          d="M26 11L29 20L38 23L29 26L26 35L23 26L14 23L23 20Z"
          fill="#bfcfb1"
          stroke="none"
        />
        <circle cx="50" cy="52" r="3" />
        <circle cx="69" cy="51" r="3" />
        <path d="M54 72Q62 78 69 69" fill="none" />
      </>
    ),
    trophy: (
      <>
        <path d="M34 21H86V49Q85 75 60 77Q34 75 34 49Z" fill="#ecd28d" />
        <path
          d="M34 29H16V47Q15 70 42 65M86 29H104V49Q102 70 79 65M60 76V101M40 107H80"
          fill="none"
          stroke="#c5a16f"
          strokeWidth="6"
        />
        <path
          d="M60 35L64 46L76 47L67 55L69 67L60 61L50 67L52 55L43 47L55 46Z"
          fill="#fff6da"
          stroke="none"
        />
      </>
    ),
  };
  return (
    <svg
      className={"toy-icon " + className}
      viewBox="0 0 120 120"
      aria-hidden="true"
      fill="#775956"
      stroke="#98726c"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {shapes[kind as keyof typeof shapes] || shapes.heart}
    </svg>
  );
}
export function StickerArt({
  kind,
  color,
}: {
  kind: StickerKind;
  color: string;
}) {
  return (
    <div className={"sticker-art sticker-" + color}>
      <span className="sticker-sparkle" aria-hidden="true">
        ✦
      </span>
      {kind === "bunny" || kind === "dance" ? (
        <Mochi
          expression={kind === "dance" ? "dance" : "blush"}
          accessory={color === "mint" ? "flower" : "ribbon"}
        />
      ) : kind === "hug" ? (
        <div className="sticker-bunny-pair">
          <Mochi expression="hug" />
          <Mochi expression="hug" accessory="ribbon" />
        </div>
      ) : (
        <ToyIcon kind={kind} />
      )}
    </div>
  );
}
export function PlantIllustration({
  kind,
  stage,
}: {
  kind: PlantKind;
  stage: number;
}) {
  const color = {
    tulip: "#e7a7bc",
    daisy: "#fff4d9",
    lavender: "#c4afdc",
    sunflower: "#ecd17f",
    moonflower: "#a9d1c5",
  }[kind];
  return (
    <svg
      className={"plant-art growth-" + stage}
      viewBox="0 0 140 175"
      aria-hidden="true"
    >
      <ellipse cx="70" cy="162" rx="47" ry="6" fill="#a7837114" />
      <path
        d="M35 118H105L96 158Q70 166 44 158Z"
        fill="#e2b6a3"
        stroke="#bd927f"
        strokeWidth="2"
      />
      <rect
        x="31"
        y="111"
        width="78"
        height="15"
        rx="6"
        fill="#edc5b2"
        stroke="#bd927f"
        strokeWidth="2"
      />
      <ellipse cx="70" cy="113" rx="31" ry="5" fill="#a47d67" />
      {stage === 0 ? (
        <ellipse cx="70" cy="109" rx="4" ry="3" fill="#f2da9c" />
      ) : (
        <g className="plant-growth">
          <path
            d={"M70 111Q65 87 70 " + (stage === 1 ? 84 : 56)}
            stroke="#90aa82"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M68 100Q35 76 38 94Q43 111 69 106M70 90Q103 64 102 85Q96 102 70 99"
            fill="#adc79b"
            stroke="#8ea77f"
            strokeWidth="1.5"
          />
          {stage === 2 ? (
            <ellipse
              cx="70"
              cy="54"
              rx="12"
              ry="17"
              fill={color}
              stroke="#bb8f9b"
              strokeWidth="1.5"
            />
          ) : stage === 3 ? (
            <g>
              {kind === "tulip" ? (
                <path
                  d="M43 36L56 49L70 27L84 49L98 34Q99 76 70 78Q42 75 43 36Z"
                  fill={color}
                  stroke="#bf8c9f"
                  strokeWidth="1.5"
                />
              ) : kind === "lavender" ? (
                <g fill={color}>
                  {[36, 46, 56, 66].map((y, i) => (
                    <g key={y}>
                      <ellipse cx={i % 2 ? 64 : 72} cy={y} rx="11" ry="8" />
                      <ellipse cx={i % 2 ? 76 : 67} cy={y + 4} rx="10" ry="7" />
                    </g>
                  ))}
                </g>
              ) : (
                <g>
                  {[0, 60, 120, 180, 240, 300].map((a) => (
                    <ellipse
                      key={a}
                      cx="70"
                      cy="35"
                      rx="13"
                      ry="24"
                      transform={"rotate(" + a + " 70 56)"}
                      fill={color}
                      stroke="#d2bbaa"
                      strokeWidth="1"
                    />
                  ))}
                  <circle cx="70" cy="56" r="13" fill="#ecd08b" />
                  <circle cx="66" cy="54" r="2" fill="#806149" />
                  <circle cx="75" cy="54" r="2" fill="#806149" />
                  <path d="M67 62Q71 66 75 61" stroke="#806149" fill="none" />
                </g>
              )}
            </g>
          ) : null}
        </g>
      )}
      <path
        d="M66 137C59 129 50 138 66 149C84 138 74 129 66 137Z"
        fill="#fff4ea"
      />
    </svg>
  );
}

export const ToyIcon = memo(ToyIconView);
