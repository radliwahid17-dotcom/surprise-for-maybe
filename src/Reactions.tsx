import { Heart } from "lucide-react";
import type { CSSProperties } from "react";
import { Cat, Mochi } from "./Mochi";
import { useCompanion } from "./Companion";
import type { Effect } from "./data";
export type Celebration = { type: Effect; id: number };
export function Effects({ celebration }: { celebration: Celebration | null }) {
  if (!celebration) return null;
  const tokens =
    celebration.type === "hearts" || celebration.type === "hug"
      ? ["♥", "♡", "♥"]
      : celebration.type === "meteor" || celebration.type === "stars"
        ? ["✦", "★", "✧"]
        : celebration.type === "cat"
          ? ["♡", "✦", "🐾"]
          : ["●", "✦", "♥", "▰"];
  return (
    <div
      className={`effects effect-${celebration.type}`}
      key={celebration.id}
      aria-hidden="true"
    >
      {Array.from({ length: 32 }, (_, index) => (
        <span
          className="particle"
          key={index}
          style={
            {
              "--x": `${(index * 37 + 11) % 100}%`,
              "--drift": `${((index * 41) % 240) - 120}px`,
              "--delay": `${(index % 9) * 0.09}s`,
              "--rotation": `${index * 23}deg`,
              "--color": [
                "#ee91a5",
                "#e1ba63",
                "#a799ca",
                "#96bfa8",
                "#edbb97",
              ][index % 5],
            } as CSSProperties
          }
        >
          {tokens[index % tokens.length]}
        </span>
      ))}
    </div>
  );
}

export function ReactionArt({
  effect,
  expression,
}: {
  effect: Effect;
  expression?: string;
}) {
  const mochi = useCompanion();
  if (effect === "cat") return <Cat />;
  if (effect === "hug")
    return (
      <div className="hug-art">
        <Mochi expression="hug" accessory={mochi.profile.accessory} />
        <Mochi className="mochi-friend" expression="hug" accessory="ribbon" />
        <Heart className="hug-heart" fill="currentColor" />
      </div>
    );
  return (
    <Mochi
      className={effect === "dance" ? "dancing" : "bob"}
      expression={expression}
      superhero={effect === "meteor"}
      accessory={mochi.profile.accessory}
    />
  );
}
