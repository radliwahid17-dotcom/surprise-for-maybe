import { useCallback, useEffect, useRef, useState } from "react";
import { readSaved, save } from "./storage";
export type SoundKind =
  | "pop"
  | "bubble"
  | "sparkle"
  | "note"
  | "squeak"
  | "notification"
  | "reveal";
export function useSound() {
  const [soundOn, setSoundOn] = useState(
    () => readSaved<boolean>("sound", false) === true,
  );
  const audio = useRef<AudioContext | null>(null);
  const play = useCallback(
    (kind: SoundKind = "sparkle", force = false) => {
      if (!soundOn && !force) return;
      try {
        const Constructor =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext;
        if (!Constructor) return;
        audio.current ??= new Constructor();
        const context = audio.current;
        if (context.state === "suspended")
          void context.resume().catch(() => {});
        const tones: Record<SoundKind, number[]> = {
          pop: [600, 400],
          bubble: [480, 710],
          sparkle: [659.25, 880, 1046.5],
          note: [523.25, 659.25, 783.99],
          squeak: [980, 1210, 920],
          notification: [740, 880],
          reveal: [392, 523.25, 659.25, 783.99, 1046.5],
        };
        const now = context.currentTime;
        tones[kind].forEach((frequency, index) => {
          const oscillator = context.createOscillator();
          const gain = context.createGain();
          const start = now + index * 0.075;
          oscillator.type = kind === "squeak" ? "triangle" : "sine";
          oscillator.frequency.setValueAtTime(frequency, start);
          gain.gain.setValueAtTime(0, start);
          gain.gain.linearRampToValueAtTime(0.045, start + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.19);
          oscillator.connect(gain);
          gain.connect(context.destination);
          oscillator.start(start);
          oscillator.stop(start + 0.2);
          oscillator.onended = () => {
            oscillator.disconnect();
            gain.disconnect();
          };
        });
      } catch {
        /* Every interaction also works without audio. */
      }
    },
    [soundOn],
  );
  const toggle = useCallback(() => {
    const next = !soundOn;
    setSoundOn(next);
    save("sound", next);
    if (next) play("sparkle", true);
    else void audio.current?.suspend().catch(() => {});
  }, [soundOn, play]);
  useEffect(
    () => () => {
      void audio.current?.close().catch(() => {});
      audio.current = null;
    },
    [],
  );
  return { soundOn, play, toggle };
}
