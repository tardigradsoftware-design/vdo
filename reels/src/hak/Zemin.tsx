import {AbsoluteFill, random, useCurrentFrame} from "remotion";
import {COLORS} from "./tema";
// Zemin: radyal gradyan + %3 gren + %6 kayan ızgara + soluk parçacıklar + ton parıltısı + alta doğru koyulaşma
export const Zemin: React.FC<{parilti: string; px: number; py: number; id: string}> = ({parilti, px, py, id}) => {
  const f = useCurrentFrame();
  const kay = (f / 30) * 10;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 38%, ${COLORS.bg2} 0%, ${COLORS.bg} 70%)`}} />
      <AbsoluteFill style={{translate: `${px * 0.3}px ${py * 0.3}px`}}>
        <div style={{position: "absolute", left: 90, top: 190, width: 900, height: 900, borderRadius: "50%", background: `radial-gradient(circle, ${parilti} 0%, transparent 68%)`, opacity: 0.22}} />
        <div style={{position: "absolute", inset: -120, opacity: 0.06, backgroundImage: "linear-gradient(#fff 2px, transparent 2px), linear-gradient(90deg, #fff 2px, transparent 2px)", backgroundSize: "90px 90px", backgroundPosition: `0 ${-kay}px`}} />
        <svg width={1080} height={1920} style={{position: "absolute", inset: 0}}>
          {Array.from({length: 8}).map((_, i) => {
            const x = random(`${id}-px-${i}`) * 1080, y0 = random(`${id}-py-${i}`) * 1920, r = 3 + random(`${id}-pr-${i}`) * 5;
            return <circle key={i} cx={x + Math.sin(f / 60 + i) * 20} cy={(y0 - f * (0.4 + i * 0.05) + 1920 * 4) % 1920} r={r} fill="#fff" opacity={0.12} />;
          })}
        </svg>
      </AbsoluteFill>
      <svg width={1080} height={1920} style={{position: "absolute", inset: 0, opacity: 0.03, mixBlendMode: "screen"}}>
        <filter id="gren"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed={f % 10} /></filter>
        <rect width={1080} height={1920} filter="url(#gren)" />
      </svg>
      <AbsoluteFill style={{background: "linear-gradient(180deg, transparent 0%, transparent 76%, rgba(0,0,0,0.55) 100%)"}} />
    </AbsoluteFill>
  );
};
