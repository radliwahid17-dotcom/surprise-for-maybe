import { useRef, useState } from "react";
import {
  Check,
  ChevronRight,
  Heart,
  LockKeyhole,
  Moon,
  Music2,
  PawPrint,
  Sparkles,
  Sun,
  Utensils,
} from "lucide-react";
import { Mochi, Daisy } from "./Mochi";
import { useCompanion } from "./Companion";
import {
  accessories,
  hiddenEndingLetter,
  snacks,
  type CareAction,
} from "./mochi-data";
import { readSaved, save } from "./storage";

type RoomProps = {
  onSound: () => void;
  onHiddenEnding: () => void;
  onWish: () => void;
  discoveries: string[];
};
const tabs = [
  { id: "care", label: "A little care", icon: Heart },
  { id: "closet", label: "Tiny closet", icon: Sparkles },
  { id: "keepsakes", label: "Our scrapbook", icon: PawPrint },
] as const;
type RoomTab = (typeof tabs)[number]["id"];
const actionInfo = [
  { action: "pet", label: "Elus Mochi", icon: PawPrint },
  { action: "hug", label: "Peluk Mochi", icon: Heart },
  { action: "dance", label: "Happy dance", icon: Music2 },
  { action: "sleep", label: "Tidur sebentar", icon: Moon },
  { action: "tickle", label: "Gelitik dikit", icon: Sparkles },
  { action: "talk", label: "Mochi, cerita dong", icon: Sun },
] as const;

export function MochiBedroom({
  onSound,
  onHiddenEnding,
  onWish,
  discoveries,
}: RoomProps) {
  const mochi = useCompanion();
  const [tab, setTab] = useState<RoomTab>("care");
  const [lampOn, setLampOn] = useState(
    () => readSaved<boolean>("room-lamp", true) !== false,
  );
  const [roomNote, setRoomNote] = useState(
    "A little room, with a very big heart.",
  );
  const starsTapped = useRef(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const night = mochi.sleeping || !lampOn;
  const careStamps = [
    { name: "Elus", count: mochi.profile.pets, icon: PawPrint },
    { name: "Camilan", count: mochi.profile.feeds, icon: Utensils },
    { name: "Istirahat", count: mochi.profile.naps, icon: Moon },
    { name: "Peluk", count: mochi.profile.hugs, icon: Heart },
    { name: "Dance", count: mochi.profile.dances, icon: Music2 },
  ];
  const stamps = careStamps.filter((stamp) => stamp.count > 0).length;
  function care(action: CareAction) {
    onSound();
    mochi.care(action);
  }
  return (
    <section
      id="mochi-room"
      className="mochi-room section-wrap"
      aria-labelledby="room-title"
    >
      <div className="section-title-row">
        <div>
          <span className="eyebrow">WELCOME TO YOUR SOFTEST LITTLE CORNER</span>
          <h2 id="room-title">
            Mochi’s little room. <em>Yours, too.</em>
          </h2>
          <p>
            Elus sebentar. Bagi camilan. Atau cuma duduk bareng. Nggak ada yang
            perlu dikejar di sini.
          </p>
        </div>
        <span className="room-number">
          ROOM 01 <Heart size={14} />
        </span>
      </div>
      <div className={`bedroom-shell ${night ? "room-night" : ""}`}>
        <div className="bedroom-stage">
          <div className="room-wallpaper" aria-hidden="true" />
          <div className="room-floor" aria-hidden="true" />
          <div className="room-hello">
            {mochi.returning
              ? "welcome back, my Maybe ♡"
              : "a little home for your heart ♡"}
          </div>
          <button
            className="room-window"
            aria-label="Lihat bintang di jendela"
            onClick={() => {
              onSound();
              starsTapped.current++;
              if (starsTapped.current % 3 === 0) onWish();
              else
                setRoomNote(
                  "Ada bintang kecil yang kayaknya nyimpen sesuatu… ✧",
                );
            }}
          >
            <span className="window-sky">
              <span className="window-moon">{night ? "☾" : "☀"}</span>
              <span className="window-star">✧</span>
              <span className="window-cloud" />
            </span>
            <i />
            <i />
            <span className="window-sill" />
          </button>
          <button
            className="room-lamp"
            aria-label={lampOn ? "Matikan lampu kamar" : "Nyalakan lampu kamar"}
            aria-pressed={lampOn}
            onClick={() => {
              const next = !lampOn;
              setLampOn(next);
              save("room-lamp", next);
              onSound();
              setRoomNote(
                next
                  ? "Lampunya hangat lagi. May, kamu juga bikin kamar ini hangat."
                  : "Sedikit lebih redup. Sedikit lebih tenang. Ada Mochi di sini.",
              );
            }}
          >
            <span className="lamp-glow" />
            <span className="lamp-shade" />
            <span className="lamp-stand" />
            <span className="lamp-pull">♡</span>
          </button>
          <div className="room-flower" aria-hidden="true">
            <Daisy />
            <span />
          </div>
          <div className="room-speech" role="status" aria-live="polite">
            <span>{mochi.speech}</span>
            <Heart size={12} fill="currentColor" />
          </div>
          <div className="mochi-bed" aria-hidden="true">
            <div className="bed-pillow">♡</div>
            <div className="bed-quilt">
              <span>✿</span>
              <span>♡</span>
              <span>✿</span>
              <span>♡</span>
            </div>
            <div className="bed-feet" />
          </div>
          <button
            className="room-mochi"
            aria-label={
              mochi.sleeping
                ? "Bangunkan Pink Mochi di kamar"
                : "Elus Pink Mochi di kamar"
            }
            onClick={() => care(mochi.sleeping ? "wake" : "pet")}
          >
            <Mochi
              expression={mochi.expression}
              accessory={mochi.profile.accessory}
            />
            {mochi.snack && (
              <span className="floating-snack" aria-hidden="true">
                {mochi.snack}
              </span>
            )}
          </button>
          <span className="room-pet-hint">
            {mochi.sleeping
              ? "a very sleepy little bunny…"
              : "psst… Mochi likes head pats ♡"}
          </span>
          <div className="room-caption" role="status">
            {roomNote}
          </div>
        </div>
        <div className="bedroom-controls">
          <div className="room-status-bar">
            <span>
              <i className={mochi.sleeping ? "sleeping-dot" : ""} />
              {mochi.sleeping ? "Dreaming of Maybe" : "Very happy you’re here"}
            </span>
            <button
              className="closet-shortcut"
              onClick={() => setTab("closet")}
              aria-label="Lihat koleksi aksesori"
            >
              {mochi.profile.unlocked.length}/8 little treasures{" "}
              <ChevronRight size={13} />
            </button>
          </div>
          <div className="room-tabs" role="tablist" aria-label="Kamar Mochi">
            {tabs.map((item, index) => (
              <button
                key={item.id}
                ref={(element) => {
                  tabRefs.current[index] = element;
                }}
                role="tab"
                id={`room-tab-${item.id}`}
                aria-selected={tab === item.id}
                aria-controls={`room-panel-${item.id}`}
                tabIndex={tab === item.id ? 0 : -1}
                onClick={() => setTab(item.id)}
                onKeyDown={(event) => {
                  let next = index;
                  if (event.key === "ArrowRight")
                    next = (index + 1) % tabs.length;
                  else if (event.key === "ArrowLeft")
                    next = (index + tabs.length - 1) % tabs.length;
                  else if (event.key === "Home") next = 0;
                  else if (event.key === "End") next = tabs.length - 1;
                  else return;
                  event.preventDefault();
                  setTab(tabs[next].id);
                  tabRefs.current[next]?.focus();
                }}
              >
                <item.icon size={14} />
                {item.label}
              </button>
            ))}
          </div>
          <div
            className="room-panel"
            id={`room-panel-${tab}`}
            role="tabpanel"
            aria-labelledby={`room-tab-${tab}`}
            tabIndex={0}
          >
            {tab === "care" && (
              <>
                <div className="room-panel-title">
                  <span className="eyebrow">SMALL THINGS. BIG HAPPY.</span>
                  <h3>What shall we do, May?</h3>
                  <p>
                    {mochi.sleeping
                      ? "Ssst… si kecil lagi tidur. Bangunkan dengan lembut kalau kamu mau."
                      : "Mochi punya waktu buat kamu. Selalu."}
                  </p>
                </div>
                <div className="care-actions">
                  {actionInfo.map((item) => (
                    <button
                      key={item.action}
                      className={`care-action action-${item.action}`}
                      disabled={mochi.sleeping && item.action !== "sleep"}
                      onClick={() =>
                        care(
                          item.action === "sleep" && mochi.sleeping
                            ? "wake"
                            : item.action,
                        )
                      }
                    >
                      <item.icon size={17} />
                      <span>
                        {item.action === "sleep" && mochi.sleeping
                          ? "Bangunkan Mochi"
                          : item.label}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="snack-heading">
                  <span>SNACK TIME?</span>
                  <small>satu buat Mochi, satu buat May</small>
                </div>
                <div className="snack-tray">
                  {snacks.map((snack) => (
                    <button
                      key={snack.id}
                      aria-label={`Beri ${snack.name}`}
                      disabled={mochi.sleeping}
                      onClick={() => {
                        onSound();
                        mochi.care("feed", snack);
                      }}
                    >
                      <span>{snack.emoji}</span>
                      <small>{snack.name}</small>
                    </button>
                  ))}
                </div>
                <div className="love-meter">
                  <span>
                    <Heart size={12} fill="currentColor" /> Little love
                    collected
                  </span>
                  <div
                    role="progressbar"
                    aria-label="Little love collected"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={mochi.profile.love}
                  >
                    <i style={{ width: `${mochi.profile.love}%` }} />
                  </div>
                  <b>{mochi.profile.love}/100</b>
                </div>
                <span className="room-fineprint">
                  No chores. No guilt. Just a little love.
                </span>
              </>
            )}
            {tab === "closet" && (
              <>
                <div className="room-panel-title">
                  <span className="eyebrow">
                    TINY OUTFITS, SAME SWEET MOCHI
                  </span>
                  <h3>The tiniest dress-up party.</h3>
                  <p>
                    Koleksi camilan… eh, aksesori. Badge hati Mochi tetap di
                    tempatnya.
                  </p>
                </div>
                <div className="accessory-grid">
                  {accessories.map((item) => {
                    const unlocked = mochi.profile.unlocked.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        className={`accessory-card ${mochi.profile.accessory === item.id ? "wearing" : ""}`}
                        aria-label={`Pakai ${item.name}`}
                        aria-pressed={mochi.profile.accessory === item.id}
                        aria-describedby={`accessory-hint-${item.id}`}
                        disabled={!unlocked}
                        onClick={() => {
                          onSound();
                          mochi.dress(item.id);
                        }}
                      >
                        <Mochi accessory={item.id} />
                        <b>{item.name}</b>
                        <small id={`accessory-hint-${item.id}`}>
                          {unlocked
                            ? mochi.profile.accessory === item.id
                              ? "currently very cute"
                              : "tap to wear"
                            : item.hint}
                        </small>
                        {unlocked ? (
                          mochi.profile.accessory === item.id && (
                            <Check className="accessory-check" size={13} />
                          )
                        ) : (
                          <LockKeyhole className="accessory-lock" size={12} />
                        )}
                      </button>
                    );
                  })}
                </div>
                <p className="room-fineprint">
                  Semua koleksi tersimpan di perangkat ini. ♡
                </p>
              </>
            )}
            {tab === "keepsakes" && (
              <>
                <div className="room-panel-title">
                  <span className="eyebrow">LITTLE MOMENTS WE GET TO KEEP</span>
                  <h3>Our pink little scrapbook.</h3>
                  <p>Hal kecil yang bikin kamar ini terasa seperti rumah.</p>
                </div>
                <div className="care-stamps">
                  {careStamps.map((stamp) => (
                    <div
                      className={stamp.count > 0 ? "stamped" : ""}
                      key={stamp.name}
                    >
                      <stamp.icon size={18} />
                      <span>{stamp.name}</span>
                      {stamp.count > 0 && <Check size={10} />}
                    </div>
                  ))}
                </div>
                <div
                  className={`radli-drawer ${mochi.secretReady ? "unsealed" : ""}`}
                >
                  <span className="drawer-heart">♡</span>
                  <div>
                    <span className="eyebrow">A LITTLE DRAWER, FROM RADLI</span>
                    <h4>
                      {mochi.secretReady
                        ? "Ada sesuatu buat kamu, May."
                        : "Beberapa hal indah tumbuh pelan-pelan."}
                    </h4>
                    <p>
                      {mochi.secretReady
                        ? "Lima momen kecil. Satu rahasia yang menunggu."
                        : `${stamps}/5 momen kecil terkumpul. Elus, camilan, istirahat, peluk, dan dance.`}
                    </p>
                  </div>
                  <button
                    className="drawer-button"
                    disabled={!mochi.secretReady}
                    aria-label="Buka laci rahasia Radli"
                    onClick={onHiddenEnding}
                  >
                    {mochi.secretReady ? (
                      <ChevronRight size={19} />
                    ) : (
                      <LockKeyhole size={16} />
                    )}
                  </button>
                </div>
                <div className="scrapbook-stats">
                  <span>
                    <b>{mochi.profile.hugs}</b> tiny hugs
                  </span>
                  <span>
                    <b>{mochi.profile.bestCatch}</b> best heart catch
                  </span>
                  <span>
                    <b>{mochi.profile.unlocked.length}</b> accessories
                  </span>
                </div>
                <div className="secret-stamps" aria-label="Jejak Easter Egg">
                  {[
                    { id: "super-mochi", label: "Super bunny" },
                    { id: "ten-hearts", label: "Love overload" },
                    { id: "secret-letter", label: "Radli’s letter" },
                    { id: "meteor", label: "A little wish" },
                    { id: "forbidden-button", label: "Curious May" },
                    { id: "find-mochi", label: "Mochi detective" },
                    { id: "window-wish", label: "Window whisper" },
                    { id: "pink-ending", label: "A place to come home" },
                  ].map((secret, index) => (
                    <span
                      key={secret.id}
                      className={
                        discoveries.includes(secret.id) ? "secret-found" : ""
                      }
                      title={
                        discoveries.includes(secret.id)
                          ? secret.label
                          : "Masih ada cerita kecil tersembunyi"
                      }
                      aria-label={
                        discoveries.includes(secret.id)
                          ? `Ditemukan: ${secret.label}`
                          : `Rahasia ${index + 1} belum ditemukan`
                      }
                    >
                      {discoveries.includes(secret.id) ? (
                        <Heart size={12} fill="currentColor" />
                      ) : (
                        "·"
                      )}
                    </span>
                  ))}
                </div>
                <span className="room-fineprint">
                  Some secrets find you when you’re just being you.
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      {mochi.announcement && (
        <div className="mochi-unlock-toast" role="status">
          <Sparkles size={17} />
          <span>{mochi.announcement}</span>
          <button
            aria-label="Buka aksesori baru"
            onClick={() => setTab("closet")}
          >
            <ChevronRight size={17} />
          </button>
        </div>
      )}
    </section>
  );
}

export function PinkHiddenEnding({
  onHug,
  onClose,
}: {
  onHug: () => void;
  onClose: () => void;
}) {
  const [hugged, setHugged] = useState(false);
  const mochi = useCompanion();
  return (
    <article className="pink-ending">
      <span className="eyebrow">YOU FOUND THE SOFTEST LITTLE SECRET</span>
      <div className="ending-garden" aria-hidden="true">
        <span>✧</span>
        <Mochi accessory="flower" expression={hugged ? "hug" : "blush"} />
        <Daisy />
        <span>♡</span>
      </div>
      <h2 id="modal-title">
        A place to come home,
        <br />
        <em>just for Maybe.</em>
      </h2>
      <p className="ending-letter">{hiddenEndingLetter}</p>
      <div className={`ending-hug-pair ${hugged ? "together" : ""}`}>
        <Mochi
          expression={hugged ? "hug" : "happy"}
          accessory={mochi.profile.accessory}
        />
        <Mochi expression={hugged ? "hug" : "happy"} accessory="ribbon" />
      </div>
      <button
        className="primary-button"
        onClick={() => {
          setHugged(true);
          onHug();
        }}
      >
        Simpan satu peluk lagi <Heart size={16} fill="currentColor" />
      </button>
      <p className="ending-response" role="status">
        {hugged
          ? "Peluk tersimpan. Tempat ini selalu punya kamu, May. ♡"
          : "No ending, really. Just another reason to smile."}
      </p>
      <button className="text-button" onClick={onClose}>
        Pulang ke Mochi <ChevronRight size={14} />
      </button>
    </article>
  );
}
