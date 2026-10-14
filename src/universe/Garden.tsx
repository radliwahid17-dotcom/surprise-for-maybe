import { useEffect, useRef, useState } from "react";
import { Droplets, Flower2, Moon, Sparkles } from "lucide-react";
import { Cat, Mochi } from "../Mochi";
import { useCompanion } from "../Companion";
import { useUniverse, type PlantKind } from "./Universe";
import { PlantIllustration } from "./Illustrations";
import { ExperienceFrame, StarFragment } from "./Shared";
import type { ExperienceActions } from "./Treats";
const species: { id: PlantKind; name: string }[] = [
  { id: "tulip", name: "Strawberry tulip" },
  { id: "daisy", name: "Vanilla daisy" },
  { id: "lavender", name: "Little lavender" },
  { id: "sunflower", name: "Butter sunflower" },
  { id: "moonflower", name: "Mint moonflower" },
];
const stages = [
  "a tiny seed",
  "a little sprout",
  "almost blooming",
  "a soft little bloom",
];
export function LittleGarden({ sound, celebrate }: ExperienceActions) {
  const world = useUniverse();
  const companion = useCompanion();
  const [kind, setKind] = useState<PlantKind>("tulip");
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [rename, setRename] = useState("");
  const [note, setNote] = useState(
    "Bunga di sini nggak layu kalau kamu sibuk. Kita tumbuh tanpa rasa bersalah.",
  );
  const [cat, setCat] = useState(false);
  const [foundBunny, setFoundBunny] = useState(false);
  const petalTaps = useRef(0);
  const plant =
    world.progress.plants.find((p) => p.id === selected) ||
    world.progress.plants[0];
  useEffect(() => {
    setRename(plant?.name || "");
  }, [plant?.id, plant?.name]);
  function water() {
    if (!plant) return;
    world.water(plant.id);
    sound("bubble");
    setNote(
      plant.stage < 3
        ? [
            "Satu tetes kecil. Ada harapan yang mulai tumbuh.",
            "Lihat, daunnya berani membuka sedikit lagi.",
            "Bunganya mekar. Pelan-pelan ternyata tetap sampai.",
          ][plant.stage]
        : "Sudah mekar dan tetap senang ditemani. Nggak perlu menyiram terus, kok.",
    );
    if (plant.stage === 2) celebrate();
  }
  function petPetals() {
    if (!plant || plant.stage < 3) return;
    petalTaps.current++;
    if (petalTaps.current % 3 === 0) {
      setCat(true);
      world.egg("flower-cat");
      sound("squeak");
      setNote(
        "Miaw? Ternyata ada tamu kecil numpang wangi bunga. Mochi pura-pura nggak cemburu.",
      );
    } else {
      sound("pop");
      setNote(
        "Bunganya goyang pelan. Sepertinya ada yang bersembunyi di sela kelopak…",
      );
    }
  }
  return (
    <ExperienceFrame
      title="Maybe’s little garden"
      kicker="GROW AT YOUR OWN LITTLE PACE"
      description="Tanam, kasih nama, siram tiga kali, lalu lihat bunga kecilmu mekar."
      className="garden-experience"
    >
      <div className="garden-scene">
        <div className="garden-sun" />
        <div className="garden-cloud cloud" />
        <div className="garden-picket" aria-hidden="true" />
        <div className="garden-plots">
          {world.progress.plants.map((p) => (
            <button
              key={p.id}
              className={
                "garden-plot " + (plant?.id === p.id ? "selected" : "")
              }
              onClick={() => {
                setSelected(p.id);
                sound("pop");
              }}
              aria-label={"Pilih tanaman " + p.name}
              aria-pressed={plant?.id === p.id}
            >
              <PlantIllustration kind={p.kind} stage={p.stage} />
              <span>
                {p.name}
                <small>{stages[p.stage]}</small>
              </span>
            </button>
          ))}
          {world.progress.plants.length === 0 && (
            <div className="empty-garden">
              <Flower2 size={36} />
              <p>One little seed can make a home.</p>
            </div>
          )}
        </div>
        <div className="garden-bench" aria-hidden="true" />
        <button
          className={"garden-hidden-bunny " + (foundBunny ? "found" : "")}
          aria-label="Kelinci kecil di bawah bangku"
          onClick={() => {
            setFoundBunny(true);
            world.egg("garden-nap");
            companion.care("wake");
            sound("squeak");
            setNote(
              "Ketemu Mochi mungil! Dia bilang: taman Maybe adalah tempat tidur siang bintang lima.",
            );
          }}
        >
          <Mochi expression={foundBunny ? "jump" : "sleeping"} />
        </button>
        {cat && (
          <div className="garden-cat">
            <Cat />
            <button className="text-button" onClick={() => setCat(false)}>
              Dadah, tamu kecil
            </button>
          </div>
        )}
      </div>
      <form
        className="garden-plant-form"
        onSubmit={(e) => {
          e.preventDefault();
          world.plant(kind, name);
          setName("");
          sound("sparkle");
          setNote(
            "Benih ditanam. Nama kecil, harapan besar. Kamu bisa memilih potnya untuk merawat.",
          );
        }}
      >
        <label>
          Jenis bunga
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value as PlantKind)}
          >
            {species.map((s) => (
              <option
                key={s.id}
                value={s.id}
                disabled={s.id === "moonflower" && world.progress.visits < 3}
              >
                {s.name}
                {s.id === "moonflower" && world.progress.visits < 3
                  ? " — kunjungan ke-3"
                  : ""}
              </option>
            ))}
          </select>
        </label>
        <label>
          Nama kecilnya
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={24}
            placeholder="Contoh: Little Hope"
            autoComplete="off"
          />
        </label>
        <button
          className="primary-button"
          disabled={world.progress.plants.length >= 6}
        >
          <Flower2 size={16} />
          Tanam bunga
        </button>
      </form>
      {world.progress.plants.length >= 6 && (
        <p className="garden-full">
          Enam pot kecil sudah terisi. Mereka tetap bisa dirawat, diberi nama
          baru, dan mendapat sentuhan bintang.
        </p>
      )}
      {plant && (
        <div className="garden-care">
          <div className="garden-selected">
            <span className="eyebrow">
              YOUR LITTLE{" "}
              {species.find((s) => s.id === plant.kind)?.name.toUpperCase()}
            </span>
            <h3>{plant.name}</h3>
            <progress
              aria-label={"Pertumbuhan " + plant.name}
              value={plant.stage}
              max={3}
            />
            <small>
              {stages[plant.stage]} · {plant.water} little drops
            </small>
          </div>
          <div className="garden-care-buttons">
            <button className="primary-button" onClick={water}>
              <Droplets size={16} />
              Siram {plant.name}
            </button>
            {plant.stage === 3 && (
              <button className="secondary-button" onClick={petPetals}>
                <Flower2 size={16} />
                Sentuh kelopaknya
              </button>
            )}
          </div>
          <form
            className="garden-rename"
            onSubmit={(e) => {
              e.preventDefault();
              world.rename(plant.id, rename);
              sound("pop");
              setNote("Nama barunya disimpan. Bunganya kelihatan bangga.");
            }}
          >
            <label htmlFor="plant-new-name">Ganti nama tanaman</label>
            <div>
              <input
                id="plant-new-name"
                value={rename}
                onChange={(e) => setRename(e.target.value)}
                maxLength={24}
              />
              <button className="secondary-button" disabled={!rename.trim()}>
                Simpan nama
              </button>
            </div>
          </form>
          {world.progress.visits >= 3 && (
            <button
              className="text-button"
              onClick={() => {
                world.graft(plant.id);
                sound("reveal");
                celebrate();
                setNote(
                  "Mint moonflower muncul! Namanya dan pertumbuhannya tetap ikut tumbuh bersama kamu.",
                );
              }}
            >
              <Sparkles size={16} />
              Beri sentuhan moonflower
            </button>
          )}
        </div>
      )}
      <p className="garden-note" role="status">
        {note}
      </p>
      <div className="moonflower-unlock">
        <Moon size={17} />
        {world.progress.visits >= 3
          ? "Mint moonflower unlocked — a little thank-you for coming home."
          : "Mochi menyiapkan moonflower untuk kunjungan ketiga. Tidak perlu datang setiap hari."}
      </div>
      {world.progress.plants.some((p) => p.stage === 3) && (
        <StarFragment id="garden" />
      )}
    </ExperienceFrame>
  );
}
