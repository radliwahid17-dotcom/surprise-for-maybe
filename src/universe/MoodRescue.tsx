import { useState } from "react";
import { BookOpen, Heart, Moon, Music2, Sparkles } from "lucide-react";
import { useCompanion } from "../Companion";
import { useUniverse } from "./Universe";
const activities: Record<
  string,
  { name: string; steps: string[]; done: string }
> = {
  happy: {
    name: "A tiny celebration",
    steps: [
      "Rayakan satu hal kecil",
      "Satu goyangan telinga lagi",
      "Kirim happy ke Mochi",
    ],
    done: "Kamu nggak perlu alasan besar buat merayakan hal kecil.",
  },
  tired: {
    name: "A little resting place",
    steps: [
      "Lepaskan bahunya sebentar",
      "Ambil napas yang nyaman",
      "Berikan izin untuk istirahat",
    ],
    done: "Istirahat tidak perlu menunggu semua pekerjaan selesai.",
  },
  sad: {
    name: "A hug without questions",
    steps: [
      "Duduk dekat Mochi",
      "Peluk sedikit lebih lama",
      "Simpan satu kalimat lembut",
    ],
    done: "Perasaanmu boleh tetap ada. Kamu tetap ditemani.",
  },
  angry: {
    name: "The official pillow complaint desk",
    steps: [
      "Marahin bantal sedikit",
      "Bantalnya siap denger lagi",
      "Letakkan keluhannya dulu",
    ],
    done: "Kamu boleh kesal. Sekarang kita kasih hati satu jeda.",
  },
  stress: {
    name: "One thing at a time",
    steps: [
      "Letakkan buku besarnya dulu",
      "Pilih satu hal yang bisa dicicil",
      "Sisanya boleh tunggu sebentar",
    ],
    done: "Tugasnya boleh banyak. Sekarang cukup satu langkah yang mungkin.",
  },
  mixed: {
    name: "No feeling needs a label",
    steps: [
      "Pilih duduk tenang sebentar",
      "Kasih pikiran sedikit ruang",
      "Mochi tetap ada di sebelahmu",
    ],
    done: "Nggak harus tahu nama perasaannya buat pantas ditemani.",
  },
};
export function MoodRescue({
  mood,
  sound,
}: {
  mood: string;
  sound: () => void;
}) {
  const world = useUniverse();
  const mochi = useCompanion();
  const [step, setStep] = useState(0);
  const activity = activities[mood] || activities.mixed;
  function act() {
    const next = Math.min(3, step + 1);
    setStep(next);
    sound();
    world.award(mood === "stress" ? "overthinker" : "soft");
    if (next === 3)
      mochi.care(
        mood === "happy" ? "dance" : mood === "tired" ? "sleep" : "hug",
      );
  }
  return (
    <div
      className={
        "mood-rescue mood-rescue-" + mood + (step > 0 ? " rescue-started" : "")
      }
    >
      <span className="eyebrow">A LITTLE ACTIVITY, IF YOU WANT</span>
      <h3>{activity.name}</h3>
      <div className="mood-rescue-prop" aria-hidden="true">
        {mood === "stress" ? (
          <div className="mochi-big-book">
            <BookOpen size={100} />
            <span>one page at a time</span>
          </div>
        ) : mood === "angry" ? (
          <div className={"complaint-pillow pillow-step-" + step}>
            <Heart size={30} />
          </div>
        ) : mood === "tired" ? (
          <Moon size={46} />
        ) : mood === "happy" ? (
          <Music2 size={44} />
        ) : (
          <Heart size={44} />
        )}
      </div>
      {step < 3 ? (
        <button className="secondary-button" onClick={act}>
          {activity.steps[step]}
          <Sparkles size={14} />
        </button>
      ) : (
        <p className="mood-rescue-done" role="status">
          {activity.done}
        </p>
      )}
      <div
        className="rescue-step-dots"
        role="progressbar"
        aria-label="Langkah kecil mood rescue"
        aria-valuemin={0}
        aria-valuemax={3}
        aria-valuenow={step}
      >
        {[1, 2, 3].map((n) => (
          <i key={n} className={step >= n ? "done" : ""} />
        ))}
      </div>
    </div>
  );
}
