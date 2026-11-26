import {Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from "remotion";

// Fluent Emoji 3D ikon: yaylı belirir, hafif süzülür/sallanır
export const Ikon: React.FC<{
  ad: string;
  giris: number;
  boyut?: number;
  style?: React.CSSProperties;
  salla?: boolean;
  don?: number; // derece/kare
}> = ({ad, giris, boyut = 200, style, salla = true, don = 0}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - giris, fps, config: {damping: 10, stiffness: 180, mass: 0.7}});
  const d = f - giris;
  const y = salla ? Math.sin(d / 14) * 10 : 0;
  const r = salla ? Math.sin(d / 19) * 6 + d * don : d * don;
  return (
    <Img
      src={staticFile(`ikon/${ad}.png`)}
      style={{
        width: boyut,
        height: boyut,
        objectFit: "contain",
        transform: `translateY(${y}px) rotate(${r}deg) scale(${s})`,
        opacity: f < giris ? 0 : 1,
        filter: "drop-shadow(10px 12px 0 rgba(14,14,16,0.18))",
        ...style,
      }}
    />
  );
};

// Yukarıdan dökülen ikonlar (para yağmuru vb.)
export const Yagmur: React.FC<{ad: string; bas: number; adet?: number; boyut?: number; sure?: number}> = ({ad, bas, adet = 10, boyut = 110, sure = 60}) => {
  const f = useCurrentFrame();
  return (
    <>
      {Array.from({length: adet}).map((_, i) => {
        const gecikme = (i * 37) % 30;
        const d = f - bas - gecikme;
        if (d < 0 || d > sure) return null;
        const x = ((i * 211) % 1000) + 40;
        const y = interpolate(d, [0, sure], [-200, 2100]);
        return (
          <Img
            key={i}
            src={staticFile(`ikon/${ad}.png`)}
            style={{position: "absolute", left: x - boyut / 2, top: y, width: boyut, height: boyut, transform: `rotate(${d * (i % 2 ? 7 : -6)}deg)`, opacity: 0.95}}
          />
        );
      })}
    </>
  );
};
