import { Check } from "lucide-react";
import { Daisy } from "./Mochi";
import { moods } from "./data";
export function MoodSection({
  mood,
  onSelect,
}: {
  mood: string | null;
  onSelect: (item: (typeof moods)[number]) => void;
}) {
  const selectedMood = moods.find((item) => item.id === mood);
  return (
    <section
      id="mood"
      className="mood-section section-wrap"
      aria-labelledby="mood-title"
    >
      <div className="section-title-row">
        <div>
          <span className="eyebrow">FIRST, A LITTLE HEART CHECK</span>
          <h2 id="mood-title">
            How’s my Maybe today?{" "}
            <span className="small-script">be honest ♡</span>
          </h2>
          <p>
            Hey, May! How’s your little heart today? 🥹 Semua perasaan boleh
            mampir di sini.
          </p>
        </div>
        <div className="mood-doodle">
          <Daisy />
        </div>
      </div>
      <div className="mood-options">
        {moods.map((item) => (
          <button
            key={item.id}
            className={`mood-card ${item.color} ${mood === item.id ? "selected" : ""}`}
            aria-pressed={mood === item.id}
            aria-label={item.label}
            onClick={() => onSelect(item)}
          >
            <span className="mood-emoji">{item.emoji}</span>
            <span>{item.label}</span>
            {mood === item.id && (
              <span className="selected-check">
                <Check size={11} />
              </span>
            )}
          </button>
        ))}
      </div>
      <p className="mood-footnote">
        {selectedMood
          ? `Mood terakhir: ${selectedMood.label}. Berubah pikiran? Boleh pilih lagi kapan aja. ♡`
          : "Nggak perlu dijelasin. Pilih aja yang paling terasa kayak kamu."}
      </p>
    </section>
  );
}
