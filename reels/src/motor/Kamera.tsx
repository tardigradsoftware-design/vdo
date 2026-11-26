// KAMERA SİSTEMİ — anahtar kareli 2D kamera (konum, ölçek, dönüş) + derinlik (parallax) bağlamı
import {createContext, useContext} from "react";
import {AbsoluteFill, interpolate, useCurrentFrame} from "remotion";
import {EGRI} from "./marka";

export type Anahtar = {f: number; x?: number; y?: number; s?: number; r?: number; egri?: (t: number) => number};
type Durum = {x: number; y: number; s: number; r: number};
const Baglam = createContext<Durum>({x: 0, y: 0, s: 1, r: 0});

const coz = (f: number, A: Anahtar[]): Durum => {
  const d = {x: A[0].x ?? 0, y: A[0].y ?? 0, s: A[0].s ?? 1, r: A[0].r ?? 0};
  for (let i = 1; i < A.length; i++) {
    const a = A[i - 1], b = A[i];
    const p = interpolate(f, [a.f, b.f], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: b.egri ?? EGRI.yumusak});
    const ax = a.x ?? d.x, ay = a.y ?? d.y, as = a.s ?? d.s, ar = a.r ?? d.r;
    if (f >= a.f) { d.x = ax + ((b.x ?? ax) - ax) * p; d.y = ay + ((b.y ?? ay) - ay) * p; d.s = as + ((b.s ?? as) - as) * p; d.r = ar + ((b.r ?? ar) - ar) * p; }
  }
  return d;
};

// Kamera: içerik dünyası 1080x1920; (x,y) kameranın baktığı noktanın merkezden kayması
export const Kamera: React.FC<{anahtarlar: Anahtar[]; children: React.ReactNode}> = ({anahtarlar, children}) => {
  const f = useCurrentFrame();
  const d = coz(f, anahtarlar);
  return <Baglam.Provider value={d}><AbsoluteFill style={{overflow: "hidden"}}>{children}</AbsoluteFill></Baglam.Provider>;
};
// Katman: derinlik 0 = sonsuz uzak (sabit), 1 = sahne düzlemi, >1 = ön plan
export const Katman: React.FC<{derinlik?: number; children: React.ReactNode}> = ({derinlik = 1, children}) => {
  const d = useContext(Baglam);
  const s = 1 + (d.s - 1) * derinlik;
  return (
    <AbsoluteFill style={{transformOrigin: "540px 960px", transform: `rotate(${d.r * derinlik}deg) scale(${s}) translate(${-d.x * derinlik}px, ${-d.y * derinlik}px)`}}>
      {children}
    </AbsoluteFill>
  );
};
