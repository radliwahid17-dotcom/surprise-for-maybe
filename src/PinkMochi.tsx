import { memo, useId } from "react";
import type { Accessory } from "./mochi-data";

export type PinkMochiProps = {
  className?: string;
  expression?: string;
  superhero?: boolean;
  accessory?: Accessory;
};
const body =
  "M162.3 104H165A135 141 0 0 1 300 245V264.74A116.1 121.26 0 0 1 183.9 386H151.5A121.5 126.9 0 0 1 30 259.1V242.18A132.3 138.18 0 0 1 162.3 104Z";

function Ear({ side }: { side: "left" | "right" }) {
  const left = side === "left";
  const cx = left ? 92 : 238;
  return (
    <g transform={`rotate(${left ? -24 : 24} ${cx} 104)`}>
      <g
        className={`mochi__ear mochi__ear--${side}`}
        transform={`translate(${left ? 50 : 196} 48)`}
      >
        <path
          d="M42 0C65.2 0 84 25.07 84 56V84C84 99.46 74.6 112 63 112H21C9.4 112 0 99.46 0 84V56C0 25.07 18.8 0 42 0Z"
          fill="#fffaf5"
        />
        <path
          d="M42 9C60.23 9 75 30.04 75 56V84C75 94.49 69.63 103 63 103H21C14.37 103 9 94.49 9 84V56C9 30.04 23.77 9 42 9Z"
          fill="#f4c2c7"
        />
        <path
          d="M42 26C50.84 26 58 39.43 58 56V86H26V56C26 39.43 33.16 26 42 26Z"
          fill="#fffaf5"
        />
      </g>
    </g>
  );
}

function Flower({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {Array.from({ length: 5 }, (_, index) => (
        <ellipse
          key={index}
          cx="0"
          cy="-8"
          rx="5"
          ry="8"
          fill="#fffdf8"
          stroke="#e7c6af"
          strokeWidth="1"
          transform={`rotate(${index * 72})`}
        />
      ))}
      <circle r="5.5" fill="#e4bd68" />
    </g>
  );
}
function Outfit({ accessory }: { accessory: Accessory }) {
  if (accessory === "ribbon")
    return (
      <g className="mochi__accessory" data-accessory="ribbon">
        <path
          d="M147 115C126 89 105 97 117 123C126 138 141 132 152 122M154 120C174 94 195 100 185 125C177 139 163 132 153 123"
          fill="#e4a1b5"
          stroke="#c97e97"
          strokeWidth="2"
        />
        <path
          d="M145 126L129 146L144 145L152 129M157 126L170 145L171 130"
          fill="#d991aa"
        />
        <ellipse cx="153" cy="120" rx="8" ry="10" fill="#c97e97" />
      </g>
    );
  if (accessory === "beret")
    return (
      <g
        className="mochi__accessory"
        data-accessory="beret"
        transform="rotate(-12 159 109)"
      >
        <ellipse
          cx="159"
          cy="110"
          rx="57"
          ry="21"
          fill="#d291a4"
          stroke="#bb718a"
          strokeWidth="2"
        />
        <path d="M137 106C136 80 172 77 184 104" fill="#e6a5b5" />
        <path
          d="M158 84Q151 72 161 68"
          stroke="#bb718a"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M190 106C180 95 171 105 177 115L191 132L203 115C208 104 198 96 190 106"
          fill="#c86583"
        />
        <path
          d="M184 100L190 107L198 100M190 94V104"
          stroke="#839174"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>
    );
  if (accessory === "nightcap")
    return (
      <g className="mochi__accessory" data-accessory="nightcap">
        <path
          d="M107 125Q108 54 151 63Q196 57 234 119Q179 96 149 133Z"
          fill="#d9cbe8"
          stroke="#b99bcf"
          strokeWidth="2"
        />
        <path
          d="M106 126Q160 108 199 127"
          stroke="#fffaf5"
          strokeWidth="15"
          strokeLinecap="round"
        />
        <circle cx="233" cy="119" r="13" fill="#fffaf5" />
        <path
          d="M144 82A12 12 0 1 0 157 99A11 11 0 0 1 144 82"
          fill="#fff4cc"
        />
      </g>
    );
  if (accessory === "scarf")
    return (
      <g className="mochi__accessory" data-accessory="scarf">
        <path
          d="M53 301Q163 331 282 300L279 325Q164 355 55 326Z"
          fill="#e3a4b6"
          stroke="#c17e98"
          strokeWidth="2"
        />
        <path d="M231 324L236 373L265 375L256 318" fill="#d793ab" />
        <path
          d="M239 354L259 355M240 362L261 364"
          stroke="#ffdfdf"
          strokeWidth="4"
        />
      </g>
    );
  if (accessory === "glasses")
    return (
      <g
        className="mochi__accessory"
        data-accessory="glasses"
        stroke="#bd7290"
        strokeWidth="3"
        fill="#f3c4d328"
      >
        <path d="M111 221C94 207 79 223 87 239L111 257L133 239C143 222 127 207 111 221ZM219 221C203 207 187 222 196 239L219 257L242 239C251 222 235 207 219 221Z" />
        <path
          d="M136 233Q165 218 193 233M86 229L66 224M244 229L265 224"
          fill="none"
        />
      </g>
    );
  if (accessory === "flower")
    return (
      <g className="mochi__accessory" data-accessory="flower">
        <path
          d="M102 122Q165 96 228 121"
          fill="none"
          stroke="#a8b391"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <Flower x={123} y={115} />
        <Flower x={165} y={108} />
        <Flower x={207} y={115} />
      </g>
    );
  if (accessory === "crown")
    return (
      <g className="mochi__accessory" data-accessory="crown">
        <path
          d="M111 126L99 89L132 109L164 76L195 109L230 89L217 126Z"
          fill="#ead18c"
          stroke="#c9a76b"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M159 103C149 92 141 104 150 113L164 125L178 113C187 103 177 94 166 103"
          fill="#ce91a4"
        />
        <circle cx="99" cy="88" r="5" fill="#fff3ca" />
        <circle cx="164" cy="76" r="5" fill="#fff3ca" />
        <circle cx="230" cy="89" r="5" fill="#fff3ca" />
      </g>
    );
  return null;
}

/** The proportions and palette here reproduce design-reference/PINK_MOCHI_DESIGN.md. */
function PinkMochiView({
  className = "",
  expression = "happy",
  superhero = false,
  accessory = "none",
}: PinkMochiProps) {
  const uid = useId().replace(/:/g, "");
  const cream = `mochi-cream-${uid}`;
  const silhouette = `mochi-body-${uid}`;
  const sleeping = expression === "sleeping" || expression === "tired";
  const cuddly = [
    "blush",
    "hug",
    "love",
    "pet",
    "kiss",
    "celebrate",
    "hide",
  ].includes(expression);
  const worried =
    expression === "sad" || expression === "stress" || expression === "cry";
  const confused = expression === "confused" || expression === "mixed";
  return (
    <svg
      className={`mochi pink-mochi mochi--${expression} ${className}`}
      viewBox="0 0 330 408"
      role="img"
      aria-label={
        superhero
          ? "Super Pink Mochi, kelinci pahlawan kecil"
          : "Pink Mochi, kelinci cream dan pink"
      }
      data-mascot="pink-bunny"
      data-expression={expression}
      data-outfit={accessory}
    >
      <defs>
        <linearGradient id={cream} x1="0" y1="0" x2="1" y2=".7">
          <stop stopColor="#fffdf8" />
          <stop offset="1" stopColor="#f6e9de" />
        </linearGradient>
        <clipPath id={silhouette}>
          <path d={body} />
        </clipPath>
      </defs>
      <ellipse cx="165" cy="399" rx="100" ry="7" fill="#926a65" opacity=".09" />
      {superhero && (
        <path
          d="M74 205Q23 305 18 391Q97 358 165 397Q242 362 315 391Q307 284 259 205Z"
          fill="#d994ab"
          stroke="#b87995"
          strokeWidth="2"
        />
      )}
      <g className="mochi__body-group">
        <path d={body} fill="#f6e2d7" stroke="#e8d1c4" strokeWidth="1.5" />
        <g clipPath={`url(#${silhouette})`}>
          <path
            d={body}
            transform="translate(-18 -12)"
            fill={`url(#${cream})`}
          />
        </g>
        <Ear side="left" />
        <Ear side="right" />
        <ellipse
          cx="85.5"
          cy="265"
          rx={cuddly ? 27 : 23.5}
          ry={cuddly ? 12 : 10}
          fill="#edb3bb"
          opacity={cuddly ? 0.85 : 0.62}
          className="mochi__blush"
        />
        <ellipse
          cx="244.5"
          cy="265"
          rx={cuddly ? 27 : 23.5}
          ry={cuddly ? 12 : 10}
          fill="#edb3bb"
          opacity={cuddly ? 0.85 : 0.62}
          className="mochi__blush"
        />
        {sleeping || cuddly ? (
          <g
            fill="none"
            stroke="#694d49"
            strokeWidth="3.5"
            strokeLinecap="round"
          >
            <path
              d={
                sleeping
                  ? "M101 233Q111 239 121 233M209 233Q219 239 229 233"
                  : "M101 235Q111 222 121 235M209 235Q219 222 229 235"
              }
            />
          </g>
        ) : (
          <g className="mochi__eyes">
            <ellipse
              className="mochi__eye"
              cx="111"
              cy="231.5"
              rx="6"
              ry="9.5"
              fill="#694d49"
            />
            <ellipse
              className="mochi__eye"
              cx="219"
              cy="231.5"
              rx="6"
              ry="9.5"
              fill="#694d49"
            />
          </g>
        )}
        {expression === "angry" && (
          <g stroke="#694d49" strokeWidth="3" strokeLinecap="round">
            <path d="M99 215L121 221M209 221L231 215" />
          </g>
        )}
        {worried && (
          <g>
            <path
              d="M100 215L120 209M209 209L230 215"
              stroke="#99746a"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path d="M239 276Q251 293 240 296Q228 292 239 276" fill="#b8dce8" />
          </g>
        )}
        {confused && (
          <path
            d="M210 214Q221 204 230 211"
            stroke="#99746a"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        )}
        {expression === "kiss" ? (
          <path
            className="mochi__kiss-mouth"
            d="M158 267Q177 267 164 274Q181 283 157 283"
            fill="none"
            stroke="#694d49"
            strokeWidth="3"
            strokeLinecap="round"
          />
        ) : expression === "eating" ? (
          <>
            <ellipse cx="165" cy="274" rx="11" ry="9" fill="#bd7e82" />
            <path
              d="M156 269Q165 264 174 269"
              stroke="#fffaf5"
              strokeWidth="3"
              fill="none"
            />
          </>
        ) : (
          <text
            x="165"
            y="281"
            textAnchor="middle"
            fontFamily="Georgia, serif"
            fontSize="30"
            fill="#694d49"
            className="mochi__mouth"
          >
            ω
          </text>
        )}

        {expression === "hug" && (
          <g fill="#fff4ea" stroke="#e7cfc1" strokeWidth="1.5">
            <ellipse
              cx="118"
              cy="311"
              rx="23"
              ry="13"
              transform="rotate(24 118 311)"
            />
            <ellipse
              cx="206"
              cy="311"
              rx="23"
              ry="13"
              transform="rotate(-24 206 311)"
            />
          </g>
        )}
        <Outfit accessory={accessory} />
        <g className="mochi__heart-badge">
          <ellipse cx="161" cy="336.5" rx="21" ry="15.5" fill="#d18b9d" />
          <path
            d="M161 333C157 326 151 331 155 336L161 343L167 336C172 330 165 326 161 333Z"
            fill="#fff9f6"
          />
        </g>
      </g>
      {sleeping && (
        <g className="mochi__zzz" fill="#aa82a7" fontFamily="Georgia, serif">
          <text x="273" y="187" fontSize="20">
            z
          </text>
          <text x="289" y="160" fontSize="27">
            z
          </text>
          <text x="303" y="130" fontSize="33">
            Z
          </text>
        </g>
      )}
      {cuddly && (
        <g className="mochi__love-spark" fill="#d39aab">
          <path d="M39 170C30 157 17 168 27 179L39 190L51 179C60 167 47 156 39 170Z" />
          <path d="M289 180C283 170 271 180 280 190L289 199L300 189C308 179 297 171 289 180Z" />
        </g>
      )}
      {expression === "angry" && (
        <path
          className="mochi__puff"
          d="M277 210Q293 194 303 204Q314 197 319 209Q330 219 314 226Q299 233 286 222"
          fill="#f0d4dc"
        />
      )}
      {confused && (
        <text
          x="279"
          y="193"
          fontFamily="Georgia, serif"
          fontSize="31"
          fill="#b08baf"
        >
          ?
        </text>
      )}
      {expression === "cry" && (
        <g className="mochi__dramatic-tears" fill="#a9d5e6" opacity=".8">
          <path d="M89 254Q70 276 81 292Q97 305 101 283Z" />
          <path d="M244 254Q262 276 252 292Q235 305 232 283Z" />
        </g>
      )}
      {expression === "kiss" && (
        <g className="mochi__kiss-heart" fill="#d69bad">
          <path d="M276 242C263 226 247 244 276 264C305 244 290 226 276 242Z" />
          <path
            d="M304 211C295 198 282 212 304 227C326 212 313 198 304 211Z"
            opacity=".6"
          />
        </g>
      )}
      {expression === "celebrate" && (
        <g className="mochi__party" strokeWidth="4" strokeLinecap="round">
          <path d="M20 130L27 142M310 117L303 130" stroke="#d89db3" />
          <path d="M13 191L24 184M313 180L321 189" stroke="#b3c89d" />
          <path d="M39 95L44 107M285 78L282 94" stroke="#c0abd5" />
          <circle cx="20" cy="163" r="5" fill="#e8ca85" />
          <circle cx="305" cy="148" r="5" fill="#e8ca85" />
        </g>
      )}
    </svg>
  );
}

export const PinkMochi = memo(PinkMochiView);
