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

export { PinkMochi as Mochi } from "./PinkMochi";

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
