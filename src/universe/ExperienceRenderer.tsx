import { Mochi } from "../Mochi";
import { useCompanion } from "../Companion";
import { useUniverse } from "./Universe";
import { StickerAlbum, WorldSettings } from "./Album";
import { LittleGarden } from "./Garden";
import { MakeMochiHappy } from "./HappyGame";
import { LittleNightSky, SecretChapter } from "./NightSky";
import {
  CapsuleMachine,
  FortuneCookie,
  HugMachine,
  MessageBottle,
  SurpriseDelivery,
  type ExperienceActions,
} from "./Treats";
import { ExperienceFrame } from "./Shared";
import type { ExperienceId } from "./Hub";
type Props = ExperienceActions & {
  id: ExperienceId;
  soundOn: boolean;
  onSound: () => void;
  onClose: () => void;
};
export function ExperienceRenderer({
  id,
  sound,
  celebrate,
  soundOn,
  onSound,
  onClose,
}: Props) {
  const mochi = useCompanion();
  const world = useUniverse();
  const actions = { sound, celebrate };
  switch (id) {
    case "fortune":
      return <FortuneCookie {...actions} />;
    case "hug":
      return <HugMachine {...actions} />;
    case "garden":
      return <LittleGarden {...actions} />;
    case "capsule":
      return <CapsuleMachine {...actions} />;
    case "bottle":
      return <MessageBottle {...actions} />;
    case "happy":
      return <MakeMochiHappy {...actions} />;
    case "sky":
      return <LittleNightSky {...actions} />;
    case "album":
      return <StickerAlbum />;
    case "settings":
      return <WorldSettings soundOn={soundOn} onSound={onSound} />;
    case "chapter":
      return <SecretChapter sound={sound} onBack={onClose} />;
    case "delivery":
      return <SurpriseDelivery {...actions} />;
    case "giant":
      return (
        <ExperienceFrame
          title="MOCHI BERUKURAN PELUKAN!"
          kicker="THE LOGO HAD A VERY BIG SECRET"
          description="Kelinci ini terlalu besar untuk pura-pura cool. Tetap bulet, tetap di pihak Maybe."
          className="giant-experience"
        >
          <Mochi expression="celebrate" accessory={mochi.profile.accessory} />
          <button
            className="primary-button"
            onClick={() => {
              mochi.care("hug");
              world.award("hug");
              celebrate();
              sound("squeak");
            }}
          >
            Peluk kelinci raksasa
          </button>
        </ExperienceFrame>
      );
  }
}
