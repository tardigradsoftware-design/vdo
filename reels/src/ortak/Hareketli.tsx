import {Lottie, LottieAnimationData} from "@remotion/lottie";
import {useEffect, useState} from "react";
import {cancelRender, continueRender, delayRender, spring, staticFile, useCurrentFrame, useVideoConfig} from "remotion";

// Noto Animated Emoji (Lottie). Yaylı belirir, kendi animasyonunu döngüde oynatır.
export const Hareketli: React.FC<{ad: string; giris: number; boyut?: number; style?: React.CSSProperties; hiz?: number}> = ({ad, giris, boyut = 220, style, hiz = 1}) => {
  const [veri, setVeri] = useState<LottieAnimationData | null>(null);
  const [h] = useState(() => delayRender(`lottie ${ad}`));
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  useEffect(() => {
    fetch(staticFile(`lottie/${ad}.json`))
      .then((r) => r.json())
      .then((j) => { setVeri(j); continueRender(h); })
      .catch((e) => cancelRender(e));
  }, [ad, h]);
  const s = spring({frame: f - giris, fps, config: {damping: 10, stiffness: 180, mass: 0.7}});
  if (!veri) return null;
  return (
    <div style={{width: boyut, height: boyut, transform: `scale(${s})`, opacity: f < giris ? 0 : 1, ...style}}>
      <Lottie animationData={veri} loop playbackRate={hiz} style={{width: "100%", height: "100%"}} />
    </div>
  );
};
