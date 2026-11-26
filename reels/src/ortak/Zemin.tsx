import {AbsoluteFill, useCurrentFrame} from "remotion";
import {R} from "./stil";

// Beyaz kâğıt + çok hafif, yavaş kayan nokta deseni
export const Zemin: React.FC = () => {
  const f = useCurrentFrame();
  const o = (f * 0.4) % 40;
  return (
    <AbsoluteFill
      style={{
        backgroundColor: R.zemin,
        backgroundImage: `radial-gradient(${R.siyah}14 2.4px, transparent 2.6px)`,
        backgroundSize: "40px 40px",
        backgroundPosition: `${o}px ${o}px`,
      }}
    />
  );
};
