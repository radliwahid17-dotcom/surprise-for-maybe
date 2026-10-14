import { Heart, Volume2, VolumeX } from "lucide-react";
import { LogoStar } from "./Mochi";
type Props = {
  final: boolean;
  soundOn: boolean;
  onSound: () => void;
  onHome: () => void;
  onHeart: () => void;
};
export function SiteHeader({
  final,
  soundOn,
  onSound,
  onHome,
  onHeart,
}: Props) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a
          href="#"
          className="brand"
          aria-label="MAYBEVERSE, halaman utama"
          onClick={onHome}
        >
          <LogoStar className="brand-star" />
          <span>
            MAYBEVERSE<small>a little world, just for you</small>
          </span>
        </a>
        {!final && (
          <nav aria-label="Navigasi utama">
            <a href="#mood">Your mood</a>
            <a href="#mochi-room">Mochi’s room</a>
            <a href="#explore">Explore</a>
            <a href="#letters">Love notes</a>
            <a href="#play">Little joys</a>
          </nav>
        )}
        <div className="header-actions">
          <button
            className={`sound-toggle ${soundOn ? "enabled" : ""}`}
            aria-pressed={soundOn}
            aria-label={soundOn ? "Matikan suara" : "Aktifkan suara"}
            onClick={onSound}
          >
            {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span>Sound {soundOn ? "on" : "off"}</span>
          </button>
          <button
            className="header-heart icon-button"
            aria-label="Kirim hati untuk Radli"
            onClick={onHeart}
          >
            <Heart size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
