import { useState } from "react";
import { Check, Lock, Sparkles } from "lucide-react";
import { useUniverse } from "./Universe";
import { eggs, stickers } from "./data";
import { StickerArt } from "./Illustrations";
import { ExperienceFrame } from "./Shared";
export function StickerAlbum() {
  const world = useUniverse();
  const [tab, setTab] = useState<"stickers" | "secrets">("stickers");
  const [selected, setSelected] = useState(stickers[0].id);
  const [hints, setHints] = useState(false);
  const item = stickers.find((s) => s.id === selected)!;
  const owned = world.progress.stickers.includes(item.id);
  return (
    <ExperienceFrame
      title="Maybe’s little collection book"
      kicker="SMALL MOMENTS, KEPT FOREVER"
      description="Stiker original, pencapaian kecil, dan rahasia yang kamu temukan. Semuanya tetap tersimpan di perangkat ini."
      className="album-experience"
    >
      <div className="album-tabs">
        <button
          className="secondary-button"
          aria-pressed={tab === "stickers"}
          onClick={() => setTab("stickers")}
        >
          Stickers · {world.progress.stickers.length}/{stickers.length}
        </button>
        <button
          className="secondary-button"
          aria-pressed={tab === "secrets"}
          onClick={() => setTab("secrets")}
        >
          Little secrets · {world.progress.eggs.length}/{eggs.length}
        </button>
      </div>
      {tab === "stickers" ? (
        <>
          <div className="sticker-grid">
            {stickers.map((s) => {
              const found = world.progress.stickers.includes(s.id);
              return (
                <button
                  key={s.id}
                  className={
                    "sticker-card " +
                    (found ? "owned" : "locked") +
                    (selected === s.id ? " selected" : "")
                  }
                  aria-label={
                    s.name + (found ? ", collected" : ", belum dikoleksi")
                  }
                  aria-pressed={selected === s.id}
                  onClick={() => setSelected(s.id)}
                >
                  <StickerArt kind={s.kind} color={s.color} />
                  <span>{s.name}</span>
                  {found ? (
                    <Check className="sticker-check" size={14} />
                  ) : (
                    <Lock className="sticker-lock" size={12} />
                  )}
                </button>
              );
            })}
          </div>
          <article className="sticker-description" role="status">
            <Sparkles size={18} />
            <div>
              <h3>{item.name}</h3>
              <p>{owned ? item.description : item.hint}</p>
              <small>
                {owned
                  ? "Kept in Maybe’s little collection."
                  : "Stiker ini bisa didapat lewat aktivitas atau kapsul gratis."}
              </small>
            </div>
          </article>
        </>
      ) : (
        <>
          <div className="secret-map-heading">
            <p>
              Rahasia nggak punya batas waktu. Petunjuknya boleh dibaca kalau
              kamu mau.
            </p>
            <button
              className="text-button"
              onClick={() => setHints((v) => !v)}
              aria-expanded={hints}
            >
              {hints ? "Sembunyikan petunjuk" : "Tunjukkan petunjuk kecil"}
            </button>
          </div>
          <ul className="secret-map">
            {eggs.map((e) => {
              const found = world.progress.eggs.includes(e.id);
              return (
                <li key={e.id} className={found ? "found" : ""}>
                  <span className="secret-map-symbol">
                    {found ? <Check size={15} /> : <Lock size={13} />}
                  </span>
                  <div>
                    <h3>{e.name}</h3>
                    <small>
                      {found
                        ? "A little secret, discovered."
                        : "Somewhere in our little universe…"}
                    </small>
                    {hints && <p>{e.hint}</p>}
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </ExperienceFrame>
  );
}
export function WorldSettings({
  soundOn,
  onSound,
}: {
  soundOn: boolean;
  onSound: () => void;
}) {
  const world = useUniverse();
  const choices = [
    {
      name: "Suara kecil",
      description: "Pop, sparkle, dan suara kelinci. Default-nya mati.",
      value: soundOn,
      action: onSound,
    },
    {
      name: "Efek dan gerakan ekstra",
      description:
        "Matikan untuk suasana tenang. Preferensi reduced motion perangkatmu tetap dihormati.",
      value: world.progress.effects,
      action: () => world.setting("effects", !world.progress.effects),
    },
    {
      name: "Kejutan otomatis sesekali",
      description:
        "Maksimal satu per kunjungan, setelah jeda panjang dan saat tidak ada popup lain.",
      value: world.progress.autoPopups,
      action: () => world.setting("autoPopups", !world.progress.autoPopups),
    },
    {
      name: "Lampu malam",
      description: "Tambahkan suasana lavender yang lembut.",
      value: world.progress.night,
      action: () => world.setting("night", !world.progress.night),
    },
  ];
  return (
    <ExperienceFrame
      title="Make yourself comfortable"
      kicker="YOUR LITTLE WORLD, YOUR PACE"
      description="Suara, gerakan, dan kejutan bisa diatur. Semua interaksi tetap bekerja saat efek dimatikan."
      className="settings-experience"
    >
      <div className="world-settings">
        {choices.map((c) => (
          <button
            key={c.name}
            role="switch"
            aria-checked={c.value}
            className="setting-row"
            onClick={c.action}
          >
            <span>
              <b>{c.name}</b>
              <small>{c.description}</small>
            </span>
            <i className={c.value ? "on" : ""}>
              <span />
            </i>
          </button>
        ))}
      </div>
      <p className="settings-note">
        Tidak ada akun atau kunjungan wajib. Tamanmu tidak layu, hadiah selalu
        gratis, dan dunia ini tetap siap saat kamu kembali.
      </p>
    </ExperienceFrame>
  );
}
