import {AbsoluteFill, useCurrentFrame} from "remotion";
import {C} from "./tema";

// Koyu zemin + sürüklenen ışık + film greni + vinyet
export const CZemin: React.FC = () => {
  const f = useCurrentFrame();
  const x = 50 + Math.sin(f / 90) * 25;
  const y = 30 + Math.cos(f / 110) * 15;
  return (
    <AbsoluteFill style={{background: C.zemin}}>
      <AbsoluteFill style={{background: `radial-gradient(circle at ${x}% ${y}%, #1E2A3A 0%, transparent 55%)`}} />
      <AbsoluteFill style={{backgroundImage: `linear-gradient(${C.cizgi}22 1px, transparent 1px), linear-gradient(90deg, ${C.cizgi}22 1px, transparent 1px)`, backgroundSize: "90px 90px", opacity: 0.5}} />
      <svg width="100%" height="100%" style={{position: "absolute", opacity: 0.09, mixBlendMode: "screen"}}>
        <filter id="gren"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={f % 12} /></filter>
        <rect width="100%" height="100%" filter="url(#gren)" />
      </svg>
      <AbsoluteFill style={{background: "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.75) 100%)"}} />
    </AbsoluteFill>
  );
};
