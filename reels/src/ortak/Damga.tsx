import {interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {FONT, R} from "./stil";

// Damga gibi düşen etiket
export const Damga: React.FC<{
  giris: number;
  metin: string;
  renk?: string;
  yaziRengi?: string;
  aci?: number;
  boyut?: number;
  style?: React.CSSProperties;
}> = ({giris, metin, renk = R.turuncu, yaziRengi = "#fff", aci = -6, boyut = 64, style}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - giris, fps, config: {damping: 9, stiffness: 260, mass: 0.6}});
  const olcek = interpolate(s, [0, 1], [2.6, 1]);
  return (
    <div
      style={{
        position: "absolute",
        background: renk,
        color: yaziRengi,
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: boyut,
        letterSpacing: -1.5,
        padding: "16px 34px",
        border: `7px solid ${R.siyah}`,
        borderRadius: 22,
        boxShadow: `10px 10px 0 ${R.siyah}`,
        transform: `rotate(${aci}deg) scale(${olcek})`,
        opacity: f < giris ? 0 : interpolate(f - giris, [0, 3], [0, 1], {extrapolateRight: "clamp"}),
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {metin}
    </div>
  );
};

// Damga anında hafif ekran sarsıntısı (piksel ofseti)
export const sarsinti = (f: number, anlar: number[]) => {
  let x = 0, y = 0;
  for (const a of anlar) {
    const d = f - a;
    if (d >= 0 && d < 10) {
      const g = (1 - d / 10) * 14;
      x += Math.sin(d * 2.7) * g;
      y += Math.cos(d * 3.1) * g;
    }
  }
  return `translate(${x}px, ${y}px)`;
};
