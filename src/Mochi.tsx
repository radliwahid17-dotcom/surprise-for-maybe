import { useId } from "react";

export function LogoStar({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 44 44" aria-hidden="true">
      {Array.from({ length: 8 }, (_, index) => (
        <path
          key={index}
          d="M22 5V15"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          transform={`rotate(${index * 45} 22 22)`}
        />
      ))}
      <circle cx="22" cy="22" r="3" fill="currentColor" />
    </svg>
  );
}

export function Mochi({
  className = "",
  expression = "happy",
  superhero = false,
}: {
  className?: string;
  expression?: string;
  superhero?: boolean;
}) {
  const id = useId();
  return (
    <svg
      className={`mochi ${className}`}
      viewBox="0 0 240 235"
      role="img"
      aria-label={
        superhero
          ? "Super Mochi, bintang pahlawan kecil"
          : "Mochi, si bintang puding lucu"
      }
    >
      <defs>
        <linearGradient id={id} x1="0" x2="0.4" y1="0" y2="1">
          <stop stopColor="#fff3b6" />
          <stop offset="1" stopColor="#ffd397" />
        </linearGradient>
      </defs>
      {superhero && (
        <path
          d="M82 118 Q38 140 32 220 Q110 200 203 220 Q187 148 155 118Z"
          fill="#e77787"
          stroke="#b9556b"
          strokeWidth="3"
        />
      )}
      <ellipse cx="120" cy="220" rx="66" ry="9" fill="#9c7751" opacity=".1" />
      <path
        d="M87 183 Q82 213 96 213 Q109 210 109 188 M137 189 Q135 211 150 213 Q163 211 155 181"
        fill="#ffd398"
        stroke="#d7a66e"
        strokeWidth="2.5"
      />
      <path
        d="M120 27 C137 27 141 69 155 79 C170 87 208 79 212 96 C217 112 179 126 173 141 C168 159 187 192 172 202 C156 213 137 182 120 182 C103 182 83 213 68 202 C52 192 72 160 67 141 C62 126 25 112 28 96 C32 78 70 88 85 79 C99 69 104 27 120 27Z"
        fill={`url(#${id})`}
        stroke="#dab174"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M103 44 Q114 32 120 35"
        fill="none"
        stroke="#fffce1"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M65 134 Q46 144 52 155 Q59 163 74 149 M175 134 Q194 143 188 154 Q181 162 168 149"
        fill="#ffe2a5"
        stroke="#d7a66e"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <ellipse cx="91" cy="136" rx="14" ry="8" fill="#f3a496" opacity=".66" />
      <ellipse cx="151" cy="136" rx="14" ry="8" fill="#f3a496" opacity=".66" />
      {superhero && (
        <path
          d="M88 109 Q119 99 155 109 L151 132 Q120 120 92 131Z"
          fill="#a690c3"
        />
      )}
      {expression === "tired" ? (
        <>
          <path
            d="M94 121 Q101 128 108 121 M133 121 Q140 128 147 121"
            stroke="#705243"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          <ellipse cx="122" cy="145" rx="4" ry="5" fill="#705243" />
        </>
      ) : (
        <>
          {expression === "angry" && (
            <path
              d="M94 112 L108 118 M134 118 L148 112"
              stroke="#705243"
              strokeWidth="3"
              strokeLinecap="round"
            />
          )}
          <ellipse cx="102" cy="122" rx="4" ry="6" fill="#705243" />
          <ellipse cx="140" cy="122" rx="4" ry="6" fill="#705243" />
          <circle cx="103" cy="120" r="1.3" fill="white" />
          <circle cx="141" cy="120" r="1.3" fill="white" />
          {expression === "sad" ? (
            <>
              <path
                d="M113 145 Q121 136 130 145"
                fill="none"
                stroke="#705243"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M148 130 Q158 143 148 145 Q140 143 148 130"
                fill="#a9d5e6"
              />
            </>
          ) : (
            <path
              d="M112 137 Q121 151 130 137"
              fill="#c67968"
              stroke="#705243"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}
        </>
      )}
      {superhero && (
        <path
          d="M120 152 L123 159 L131 159 L125 164 L127 172 L120 168 L113 172 L115 164 L109 159 L117 159Z"
          fill="#b08bb8"
        />
      )}
    </svg>
  );
}

export function Daisy({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      {Array.from({ length: 8 }, (_, i) => (
        <ellipse
          key={i}
          cx="50"
          cy="24"
          rx="10"
          ry="19"
          fill="#fffdf4"
          stroke="#eddcbb"
          strokeWidth="1"
          transform={`rotate(${i * 45} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="17" fill="#f6ce70" />
      <circle cx="45" cy="49" r="1.5" fill="#876644" />
      <circle cx="55" cy="49" r="1.5" fill="#876644" />
      <path
        d="M46 55 Q50 59 54 55"
        fill="none"
        stroke="#876644"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Cat() {
  return (
    <svg
      className="cat"
      viewBox="0 0 220 180"
      role="img"
      aria-label="Kucing lucu menyapa Maybe"
    >
      <path
        d="M58 90 L49 28 Q50 15 80 44 Q110 27 140 44 Q173 14 173 29 L165 92"
        fill="#eec9ab"
        stroke="#b78e75"
        strokeWidth="3"
      />
      <path d="M58 35 L63 67 L77 49 M161 35 L155 66 L142 49" fill="#eaa8a5" />
      <ellipse
        cx="111"
        cy="103"
        rx="66"
        ry="53"
        fill="#f6dbc2"
        stroke="#b78e75"
        strokeWidth="3"
      />
      <path
        d="M109 57 L109 73 M99 57 L97 70 M121 58 L125 69"
        stroke="#c69b7a"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M77 102 Q85 94 93 102 M130 102 Q138 94 145 102"
        fill="none"
        stroke="#735544"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M106 110 L115 110 L110 115Z" fill="#d68887" />
      <path
        d="M110 115 Q110 125 101 123 M110 115 Q111 125 120 123"
        stroke="#735544"
        strokeWidth="2"
        fill="none"
      />
      <ellipse cx="78" cy="115" rx="11" ry="6" fill="#edada3" />
      <ellipse cx="145" cy="115" rx="11" ry="6" fill="#edada3" />
      <path
        d="M66 108 L26 99 M65 117 L24 120 M156 108 L194 100 M156 118 L199 122"
        stroke="#b78e75"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <ellipse
        cx="83"
        cy="155"
        rx="20"
        ry="14"
        fill="#f6dbc2"
        stroke="#b78e75"
        strokeWidth="3"
      />
      <ellipse
        cx="140"
        cy="155"
        rx="20"
        ry="14"
        fill="#f6dbc2"
        stroke="#b78e75"
        strokeWidth="3"
      />
    </svg>
  );
}
