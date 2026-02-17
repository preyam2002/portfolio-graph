import { useCallback, useRef, useEffect } from "react";
import { useStore } from "@/store";

export const useSound = () => {
  const audioContext = useRef<AudioContext | null>(null);
  const masterGain = useRef<GainNode | null>(null);
  const { isMuted } = useStore();

  useEffect(() => {
    // Initialize AudioContext on first user interaction or mount
    const initAudio = () => {
      if (!audioContext.current) {
        audioContext.current = new (
          window.AudioContext || (window as any).webkitAudioContext
        )();
        masterGain.current = audioContext.current.createGain();
        masterGain.current.gain.value = 0.2; // Master volume
        masterGain.current.connect(audioContext.current.destination);
      }
      if (audioContext.current.state === "suspended") {
        audioContext.current.resume();
      }
    };

    const handleInteraction = () => {
      initAudio();
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
    };

    window.addEventListener("click", handleInteraction);
    window.addEventListener("keydown", handleInteraction);

    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
    };
  }, []);

  const playOscillator = useCallback(
    (freq: number, type: OscillatorType, duration: number, vol: number = 1) => {
      if (isMuted || !audioContext.current || !masterGain.current) return;

      const osc = audioContext.current.createOscillator();
      const gain = audioContext.current.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioContext.current.currentTime);

      gain.gain.setValueAtTime(vol, audioContext.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.current.currentTime + duration,
      );

      osc.connect(gain);
      gain.connect(masterGain.current);

      osc.start();
      osc.stop(audioContext.current.currentTime + duration);
    },
    [isMuted],
  );

  const playHover = useCallback(() => {
    if (isMuted) return;
    // High tech chirp
    playOscillator(2000, "sine", 0.05, 0.3);
    setTimeout(() => playOscillator(3000, "sine", 0.05, 0.1), 30);
  }, [playOscillator, isMuted]);

  const playClick = useCallback(() => {
    if (isMuted) return;
    // Deeper confirm sound
    playOscillator(800, "square", 0.1, 0.4);
    playOscillator(400, "sine", 0.2, 0.5);
  }, [playOscillator, isMuted]);

  const playType = useCallback(() => {
    if (isMuted) return;
    // Mechanical click
    playOscillator(1200 + Math.random() * 400, "triangle", 0.03, 0.2);
  }, [playOscillator, isMuted]);

  const playBoot = useCallback(() => {
    if (isMuted || !audioContext.current || !masterGain.current) return;

    // Rising tone
    const osc = audioContext.current.createOscillator();
    const gain = audioContext.current.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(100, audioContext.current.currentTime);
    osc.frequency.exponentialRampToValueAtTime(
      800,
      audioContext.current.currentTime + 2,
    );

    gain.gain.setValueAtTime(0, audioContext.current.currentTime);
    gain.gain.linearRampToValueAtTime(
      0.4,
      audioContext.current.currentTime + 1,
    );
    gain.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.current.currentTime + 3,
    );

    osc.connect(gain);
    gain.connect(masterGain.current);

    osc.start();
    osc.stop(audioContext.current.currentTime + 3);
  }, [isMuted]);

  return { playHover, playClick, playType, playBoot };
};
