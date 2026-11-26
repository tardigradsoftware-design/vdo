import {spring, useCurrentFrame, useVideoConfig} from "remotion";
import {R} from "./stil";

// Beyaz kart, 7px siyah kontur, 30px köşe, 14px düz gölge. Yaylı girer, hafif nefes alır.
export const Kart: React.FC<{
  giris: number; // kare
  children: React.ReactNode;
  style?: React.CSSProperties;
  renk?: string;
  yon?: "alt" | "sol" | "sag" | "olcek";
}> = ({giris, children, style, renk = R.zemin, yon = "alt"}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - giris, fps, config: {damping: 13, stiffness: 140, mass: 0.8}});
  const nefes = Math.sin((f - giris) / 22) * 6;
  const t =
    yon === "alt" ? `translateY(${(1 - s) * 500 + nefes}px)` :
    yon === "sol" ? `translateX(${(1 - s) * -1100}px) translateY(${nefes}px)` :
    yon === "sag" ? `translateX(${(1 - s) * 1100}px) translateY(${nefes}px)` :
    `scale(${s}) translateY(${nefes}px)`;
  return (
    <div
      style={{
        background: renk,
        border: `7px solid ${R.siyah}`,
        borderRadius: 30,
        boxShadow: `14px 14px 0 ${R.siyah}`,
        transform: t,
        opacity: f < giris ? 0 : 1,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
