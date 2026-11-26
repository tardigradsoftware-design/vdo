// MASKOT SİSTEMİ — nesne maskot (kalkan-rozet), insan/hayvan değil. Görünüş sabit, pozlar değişir.
// Kullanıcının kendi maskotu geldiğinde yalnızca <Govde> değiştirilir; poz/aksiyon API'si aynı kalır.
import {spring, useCurrentFrame, useVideoConfig} from "remotion";
import {R} from "./marka";

export type Poz = "bekle" | "isaret" | "sasir" | "uyari" | "onay" | "dusun" | "incele" | "tut" | "selam";
export type Giris = "alt" | "sol" | "sag" | "olcek" | "yok";

const Govde: React.FC<{goz: [number, number]; kirp: number; ifade: Poz; uyari: boolean}> = ({goz, kirp, ifade, uyari}) => {
  const buyuk = ifade === "sasir" || ifade === "uyari";
  const gr = buyuk ? 17 : 13;
  return (
    <g>
      <ellipse cx={0} cy={170} rx={90} ry={16} fill="#000" opacity={0.10} />
      <path d="M0 -130 C 60 -130 105 -112 112 -96 C 116 10 80 90 0 135 C -80 90 -116 10 -112 -96 C -105 -112 -60 -130 0 -130 Z" fill={uyari ? R.risk : R.marka} />
      <path d="M0 -104 C 46 -104 82 -92 88 -80 C 90 4 62 70 0 106 C -62 70 -90 4 -88 -80 C -82 -92 -46 -104 0 -104 Z" fill="none" stroke="#ffffff" strokeOpacity={0.35} strokeWidth={6} />
      {/* terazi amblemi */}
      <g transform="translate(0 52) scale(0.9)" stroke="#ffffff" strokeOpacity={0.55} strokeWidth={5} fill="none" strokeLinecap="round">
        <path d="M0 -26 L0 22 M-30 -16 L30 -16 M-30 -16 L-40 4 L-20 4 Z M30 -16 L20 4 L40 4 Z M-14 22 L14 22" />
      </g>
      {/* gözler */}
      {[-32, 32].map((x) => (
        <g key={x} transform={`translate(${x} -40)`}>
          <ellipse rx={gr + 9} ry={(gr + 11) * kirp} fill="#fff" />
          <circle cx={goz[0] * 7} cy={goz[1] * 7 * kirp} r={gr * 0.62} fill={R.murekkep} />
          <circle cx={goz[0] * 7 + 4} cy={goz[1] * 7 * kirp - 5} r={3.5} fill="#fff" />
        </g>
      ))}
      {/* kaşlar ifadeye göre */}
      <path d={ifade === "uyari" ? "M-56 -82 L-14 -70 M56 -82 L14 -70" : ifade === "dusun" ? "M-54 -76 L-14 -84 M54 -84 L14 -80" : buyuk ? "M-54 -92 Q-34 -104 -12 -94 M54 -92 Q34 -104 12 -94" : "M-52 -78 Q-32 -86 -12 -78 M52 -78 Q32 -86 12 -78"} stroke={R.murekkep} strokeWidth={8} strokeLinecap="round" fill="none" />
      {/* ağız */}
      <path d={buyuk ? "M-10 0 a 10 12 0 1 0 20 0 a 10 12 0 1 0 -20 0" : ifade === "dusun" ? "M-14 4 L14 0" : "M-20 -2 Q0 16 20 -2"} stroke={R.murekkep} strokeWidth={7} strokeLinecap="round" fill={buyuk ? R.murekkep : "none"} />
    </g>
  );
};

const El: React.FC<{x: number; y: number; r?: number; parmak?: boolean}> = ({x, y, r = 0, parmak}) => (
  <g transform={`translate(${x} ${y}) rotate(${r})`}>
    <circle r={30} fill="#fff" stroke={R.murekkep} strokeWidth={6} />
    {parmak && <rect x={18} y={-9} width={42} height={18} rx={9} fill="#fff" stroke={R.murekkep} strokeWidth={6} />}
  </g>
);

// Maskot: x,y sahne koordinatı (merkez); yon: işaret yönü (derece), esya: elde tutulan
export const Maskot: React.FC<{x: number; y: number; olcek?: number; poz?: Poz; an?: number; giris?: Giris; yon?: number; bakis?: [number, number]; esya?: React.ReactNode; ayna?: boolean}> = ({x, y, olcek = 1, poz = "bekle", an = 0, giris = "alt", yon = 0, bakis, esya, ayna}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const d = f - an;
  const s = spring({frame: d, fps, config: {damping: 11, stiffness: 170, mass: 0.8}});
  const tx = giris === "sol" ? (1 - s) * -700 : giris === "sag" ? (1 - s) * 700 : 0;
  const ty = giris === "alt" ? (1 - s) * 900 : 0;
  const sc = giris === "olcek" ? s : 1;
  const nefes = Math.sin(f / 14) * 6;
  const zipla = poz === "sasir" ? -Math.max(0, Math.sin(Math.min(d, 12) / 12 * Math.PI)) * 60 : poz === "onay" ? -Math.abs(Math.sin(d / 5)) * 14 * Math.exp(-Math.max(0, d) / 25) : 0;
  const sars = poz === "uyari" ? Math.sin(d * 2.1) * 6 * Math.exp(-Math.max(0, d) / 18) : 0;
  const kirp = (f + 13) % 87 < 4 ? 0.15 : 1;
  const egim = poz === "dusun" ? -8 : poz === "incele" ? 10 : Math.sin(f / 23) * 3;
  const rad = (yon * Math.PI) / 180;
  const goz: [number, number] = bakis ?? (poz === "isaret" || poz === "incele" ? [Math.cos(rad), Math.sin(rad)] : poz === "dusun" ? [0.6, -0.8] : [0, 0]);
  // eller
  const sallan = Math.sin(f / 4) * 30;
  const sag = poz === "isaret" ? {x: 120 + Math.cos(rad) * 40, y: 10 + Math.sin(rad) * 40, r: yon, p: true}
    : poz === "selam" ? {x: 150, y: -90, r: sallan, p: false}
    : poz === "onay" ? {x: 140, y: -70, r: -60, p: true}
    : poz === "uyari" ? {x: 150, y: -40, r: 0, p: false}
    : poz === "dusun" ? {x: 30, y: 40, r: -90, p: false}
    : poz === "tut" || poz === "incele" ? {x: 128, y: 10, r: 0, p: false}
    : {x: 128, y: 60 + nefes * 0.5, r: 0, p: false};
  const sol = poz === "uyari" || poz === "sasir" ? {x: -150, y: -40} : poz === "tut" ? {x: -128, y: 10} : {x: -128, y: 60 - nefes * 0.5};
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none"}}>
      <g transform={`translate(${x + tx + sars} ${y + ty + zipla + nefes}) scale(${(ayna ? -1 : 1) * olcek * sc} ${olcek * sc}) rotate(${egim})`} opacity={d < 0 ? 0 : 1}>
        <Govde goz={goz} kirp={kirp} ifade={poz} uyari={poz === "uyari"} />
        <El x={sol.x} y={sol.y} />
        <El x={sag.x} y={sag.y} r={sag.r} parmak={sag.p} />
        {esya && <g transform={`translate(${sag.x} ${sag.y - 10})`}>{esya}</g>}
        {poz === "incele" && <g transform={`translate(${sag.x + 20} ${sag.y - 30})`}><circle r={44} fill="#ffffff55" stroke={R.murekkep} strokeWidth={9} /><rect x={26} y={26} width={60} height={16} rx={8} transform="rotate(45 26 26)" fill={R.murekkep} /></g>}
      </g>
    </svg>
  );
};
