import {AbsoluteFill, random, useCurrentFrame} from "remotion";
import {D} from "./tema";

// Kâğıt katmanı: düşük frekanslı lekeler, ılık gren, vinyet, ortada hafif kat izi. Üstüne her 2 karede yeniden ekilen toz.
export const Kagit: React.FC<{zemin?: string}> = ({zemin = D.kagit}) => {
  const f = useCurrentFrame();
  const tohum = Math.floor(f / 2);
  return (
    <AbsoluteFill style={{background: zemin}}>
      <svg width="1080" height="1920" style={{position: "absolute", mixBlendMode: "multiply", opacity: 0.55}}>
        <filter id="leke"><feTurbulence type="fractalNoise" baseFrequency="0.006" numOctaves="4" seed="7" /><feColorMatrix type="matrix" values="0 0 0 0 0.86  0 0 0 0 0.80  0 0 0 0 0.68  0 0 0 0.6 0.25" /></filter>
        <rect width="1080" height="1920" filter="url(#leke)" />
        <filter id="lif"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="2" /><feColorMatrix type="matrix" values="0 0 0 0 0.7  0 0 0 0 0.6  0 0 0 0 0.45  0 0 0 0.35 0" /></filter>
        <rect width="1080" height="1920" filter="url(#lif)" opacity="0.5" />
      </svg>
      <AbsoluteFill style={{background: "linear-gradient(90deg, transparent 49.6%, rgba(90,70,40,0.10) 50%, rgba(255,255,255,0.18) 50.4%, transparent 51%)"}} />
      <AbsoluteFill style={{background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(80,55,20,0.28) 100%)"}} />
      <svg width="1080" height="1920" style={{position: "absolute"}}>
        {Array.from({length: 220}).map((_, i) => {
          const x = random(`x${tohum}-${i}`) * 1080, y = random(`y${tohum}-${i}`) * 1920, r = 0.6 + random(`r${tohum}-${i}`) * 1.6;
          return <circle key={i} cx={x} cy={y} r={r} fill={i % 4 === 0 ? D.murekkep : D.kagitAcik} opacity={i % 4 === 0 ? 0.35 : 0.8} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};
