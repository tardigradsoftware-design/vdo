import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {D, MANSET, RAKAM, SANS, VERI} from "./tema";

const id = (s: string) => s.replace(/[^a-zA-Z0-9]/g, "");

// Manşet: harf harf düşüp ezilerek oturur; kobalt kayık baskı gölgesi (+8/+8, multiply)
export const Manset: React.FC<{metin: string; an: number; boyut?: number; renk?: string; golge?: string; aralik?: number; style?: React.CSSProperties}> = ({metin, an, boyut = 120, renk = D.murekkep, golge = D.golge, aralik = 1.8, style}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const harfler = [...metin];
  const katman = (r: string, dx: number, carp: boolean) => (
    <div style={{position: dx ? "absolute" : "relative", left: dx, top: dx, display: "flex", fontFamily: MANSET, fontSize: boyut, lineHeight: 1, letterSpacing: -1, color: r, mixBlendMode: carp ? "multiply" : "normal", whiteSpace: "pre"}}>
      {harfler.map((h, i) => {
        const d = f - an - i * aralik;
        const s = spring({frame: d, fps, config: {damping: 9, stiffness: 260, mass: 0.6}});
        const ez = d > 0 && d < 14 ? 1 + Math.cos(d * 0.9) * Math.exp(-d * 0.35) * 0.22 : 1;
        return (
          <span key={i} style={{display: "inline-block", opacity: d < 0 ? 0 : 1, translate: `0 ${(1 - s) * -(40 + (i % 3) * 25)}px`, scale: `${1 / ez} ${ez}`, transformOrigin: "50% 100%"}}>{h}</span>
        );
      })}
    </div>
  );
  return <div style={{position: "relative", ...style}}>{katman(golge, 8, true)}{katman(renk, 0, false)}</div>;
};

// Mühür: çift yuvarlak çerçeve, pürüzlü mürekkep, ~3 karede 2,6× → 1× çarpar, sönümlü sekme
export const Muhur: React.FC<{metin: string; an: number; renk?: string; boyut?: number; aci?: number; alt?: string; style?: React.CSSProperties}> = ({metin, an, renk = D.alarm, boyut = 130, aci = -9, alt, style}) => {
  const f = useCurrentFrame();
  const d = f - an;
  if (d < 0) return null;
  const carp = interpolate(d, [0, 3], [2.6, 1], {extrapolateRight: "clamp", easing: Easing.in(Easing.quad)});
  const sek = d >= 3 ? 1 + Math.sin((d - 3) * 1.3) * Math.exp(-(d - 3) * 0.45) * 0.06 : 1;
  const fid = `pur${id(metin)}${an}`;
  const W = metin.length * boyut * 0.72 + 120, H = boyut * (alt ? 1.75 : 1.45);
  return (
    <div style={{position: "absolute", rotate: `${aci}deg`, scale: `${carp * sek}`, opacity: 0.93, ...style}}>
      <svg width={W} height={H} style={{overflow: "visible", mixBlendMode: "multiply"}}>
        <filter id={fid} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed={an % 9} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="6" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feTurbulence type="fractalNoise" baseFrequency="0.35" numOctaves="3" seed={(an + 3) % 11} result="n2" />
          <feColorMatrix in="n2" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -3 2.1" result="m" />
          <feComposite in="d" in2="m" operator="in" />
        </filter>
        <g filter={`url(#${fid})`} fill="none" stroke={renk}>
          <rect x="6" y="6" width={W - 12} height={H - 12} rx="22" strokeWidth="10" />
          <rect x="22" y="22" width={W - 44} height={H - 44} rx="14" strokeWidth="4" />
          <text x={W / 2} y={alt ? H * 0.58 : H * 0.68} textAnchor="middle" fill={renk} stroke="none" fontFamily={RAKAM} fontSize={boyut} letterSpacing="4">{metin}</text>
          {alt && <text x={W / 2} y={H * 0.84} textAnchor="middle" fill={renk} stroke="none" fontFamily={VERI} fontWeight="800" fontSize={boyut * 0.22} letterSpacing="6">{alt}</text>}
        </g>
      </svg>
    </div>
  );
};

// Kart: kâğıt beyazı, kalın mürekkep kontur, kobalt kayık gölge; geri yaylanarak (back ease) aşağıdan yükselir
export const Kart: React.FC<{an: number; children: React.ReactNode; aci?: number; w: number; style?: React.CSSProperties; yon?: "alt" | "olcek"}> = ({an, children, aci = 0, w, style, yon = "alt"}) => {
  const f = useCurrentFrame();
  const p = interpolate(f - an, [0, 12], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.6))});
  return (
    <div style={{width: w, background: D.kagitAcik, border: `6px solid ${D.murekkep}`, borderRadius: 18, boxShadow: `14px 14px 0 ${D.golge}`, padding: "34px 40px", opacity: f < an ? 0 : 1, translate: yon === "alt" ? `0 ${(1 - p) * 700}px` : undefined, scale: yon === "olcek" ? `${p}` : undefined, rotate: `${aci + (1 - p) * 8}deg`, ...style}}>
      {children}
    </div>
  );
};

// Karartma: siyah bant soldan basılır
export const Karartma: React.FC<{an: number; en: number; yuk?: number}> = ({an, en, yuk = 34}) => {
  const f = useCurrentFrame();
  const p = interpolate(f - an, [0, 5], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return <span style={{display: "inline-block", width: en * p, height: yuk, background: D.murekkep, verticalAlign: "middle", marginLeft: 12, borderRadius: 3}} />;
};

// Etiket (dosya çipi)
export const Cip: React.FC<{an: number; children: React.ReactNode; zemin?: string; renk?: string; style?: React.CSSProperties}> = ({an, children, zemin = D.murekkep, renk = D.kagitAcik, style}) => {
  const f = useCurrentFrame();
  const p = interpolate(f - an, [0, 9], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(2))});
  return <div style={{display: "inline-block", fontFamily: VERI, fontWeight: 800, fontSize: 30, letterSpacing: 3, color: renk, background: zemin, padding: "8px 18px", borderRadius: 8, scale: `${p}`, transformOrigin: "0 50%", ...style}}>{children}</div>;
};

// Daktilo yazısı
export const Daktilo: React.FC<{an: number; metin: string; hiz?: number; style?: React.CSSProperties}> = ({an, metin, hiz = 1.2, style}) => {
  const f = useCurrentFrame();
  const n = Math.max(0, Math.min(metin.length, Math.floor((f - an) / hiz)));
  return <span style={{fontFamily: VERI, fontWeight: 800, ...style}}>{f >= an ? metin.slice(0, n) : ""}</span>;
};

export const Govde: React.FC<{children: React.ReactNode; boyut?: number; style?: React.CSSProperties}> = ({children, boyut = 40, style}) => (
  <div style={{fontFamily: SANS, fontWeight: 800, fontSize: boyut, color: D.murekkep, lineHeight: 1.2, ...style}}>{children}</div>
);
