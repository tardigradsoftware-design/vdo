import {useAudioData, visualizeAudio} from "@remotion/media-utils";
import {spring, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {MASKOTLAR, MaskotKart} from "../videolar/Maskotlar";

// Sese göre konuşan maskot: ses yüksekliğiyle zıplar/esner, yavaşça süzülür
export const KonusanMaskot: React.FC<{no: number; ses: string; giris?: number}> = ({no, ses, giris = 6}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const veri = useAudioData(staticFile(ses));
  let g = 0;
  if (veri) {
    const v = visualizeAudio({fps, frame: f, audioData: veri, numberOfSamples: 16});
    g = Math.min(1, (v.slice(0, 8).reduce((a, b) => a + b, 0) / 8) * 6);
  }
  const s = spring({frame: f - giris, fps, config: {damping: 12, stiffness: 120}});
  const m = MASKOTLAR[no - 1];
  return (
    <div style={{position: "absolute", right: -40, bottom: 300, width: 500, height: 500, transformOrigin: "bottom center", transform: `translateY(${(1 - s) * 500 + Math.sin(f / 18) * 8 - g * 22}px) scale(${0.62 * (1 + g * 0.07)}, ${0.62 * (1 - g * 0.04)}) rotate(${Math.sin(f / 23) * 3}deg)`, filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.6))"}}>
      <MaskotKart m={m} sade />
    </div>
  );
};
