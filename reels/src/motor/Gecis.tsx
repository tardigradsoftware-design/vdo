// GEÇİŞ SİSTEMİ — markanın imza geçişi (çapraz panel süpürme) + iris + flaş
import {AbsoluteFill, interpolate, useCurrentFrame} from "remotion";
import {EGRI, R} from "./marka";

export type Gecis = {an: number; tip: "panel" | "iris" | "flas"; x?: number; y?: number; renk?: string};
// Panel: sahne değişimi tam `an` karesinde, panel ekranı örterken olur (±6 kare)
const Panel: React.FC<{an: number; renk: string}> = ({an, renk}) => {
  const f = useCurrentFrame();
  const d = f - an;
  if (d < -7 || d > 7) return null;
  const p = interpolate(d, [-7, 0, 7], [-1, 0, 1], {easing: EGRI.yumusak});
  const yer = p * 2600;
  return (
    <AbsoluteFill style={{pointerEvents: "none"}}>
      <div style={{position: "absolute", left: -700 + yer, top: -400, width: 2200, height: 2800, background: renk, rotate: "18deg", filter: `blur(${Math.abs(p) * 8}px)`}} />
      <div style={{position: "absolute", left: -980 + yer * 1.08, top: -400, width: 220, height: 2800, background: R.vurgu, rotate: "18deg"}} />
    </AbsoluteFill>
  );
};
// İris: bir noktadan açılan daire (yeni sahne içeriden açılır)
const Iris: React.FC<{an: number; x: number; y: number; renk: string}> = ({an, x, y, renk}) => {
  const f = useCurrentFrame();
  const d = f - an;
  if (d < -8 || d > 8) return null;
  const r = d < 0 ? interpolate(d, [-8, 0], [0, 2300], {easing: EGRI.ivme}) : interpolate(d, [0, 8], [2300, 0], {easing: EGRI.expo});
  return <svg width={1080} height={1920} style={{position: "absolute", inset: 0}}><circle cx={x} cy={y} r={r} fill={renk} /></svg>;
};
const Flas: React.FC<{an: number}> = ({an}) => {
  const f = useCurrentFrame();
  const o = interpolate(f - an, [-1, 0, 5], [0, 0.6, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return <AbsoluteFill style={{background: "#fff", opacity: o, pointerEvents: "none"}} />;
};
export const Gecisler: React.FC<{liste: Gecis[]}> = ({liste}) => (
  <>
    {liste.map((g, i) => g.tip === "panel" ? <Panel key={i} an={g.an} renk={g.renk ?? R.marka} /> : g.tip === "iris" ? <Iris key={i} an={g.an} x={g.x ?? 540} y={g.y ?? 960} renk={g.renk ?? R.murekkep} /> : <Flas key={i} an={g.an} />)}
  </>
);
