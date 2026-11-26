import {useMemo} from "react";

// Yarım ton: döndürülmüş ızgarada daireler; yarıçap = yoğunluk × adım × k. Gradyan yok, ton nokta boyutundan.
export const Yarimton: React.FC<{
  w: number; h: number; adim?: number; aci?: number; renk: string; k?: number;
  yogunluk: (u: number, v: number) => number; // u,v: 0..1
  style?: React.CSSProperties; carp?: boolean;
}> = ({w, h, adim = 18, aci = 15, renk, k = 0.68, yogunluk, style, carp = true}) => {
  const yol = useMemo(() => {
    const a = (aci * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
    const R = Math.hypot(w, h);
    let d = "";
    for (let gy = -R; gy < R; gy += adim) {
      for (let gx = -R; gx < R; gx += adim) {
        const x = w / 2 + gx * c - gy * s, y = h / 2 + gx * s + gy * c;
        if (x < -adim || y < -adim || x > w + adim || y > h + adim) continue;
        const dn = Math.max(0, Math.min(1, yogunluk(x / w, y / h)));
        const r = dn * adim * k;
        if (r < 0.6) continue;
        d += `M${(x - r).toFixed(1)},${y.toFixed(1)}a${r.toFixed(1)},${r.toFixed(1)} 0 1,0 ${(2 * r).toFixed(1)},0a${r.toFixed(1)},${r.toFixed(1)} 0 1,0 ${(-2 * r).toFixed(1)},0`;
      }
    }
    return d;
  }, [w, h, adim, aci, k, yogunluk]);
  return (
    <svg width={w} height={h} style={{overflow: "visible", mixBlendMode: carp ? "multiply" : "normal", ...style}}>
      <path d={yol} fill={renk} />
    </svg>
  );
};

// Hazır yoğunluk alanları
export const radyal = (cx = 0.5, cy = 0.5, yaricap = 0.5, guc = 1) => (u: number, v: number) => Math.max(0, 1 - Math.hypot(u - cx, v - cy) / yaricap) * guc;
export const kenar = (guc = 1, kalinlik = 0.18) => (u: number, v: number) => {
  const d = Math.min(u, v, 1 - u, 1 - v);
  return Math.max(0, 1 - d / kalinlik) * guc;
};
export const dogrusal = (guc = 1) => (u: number, v: number) => (u * 0.4 + v * 0.6) * guc;
// Parmak izi: çarpık eş merkezli sırtlar, elips maskesi
export const parmakIzi = (u: number, v: number) => {
  const x = (u - 0.5) * 2, y = (v - 0.52) * 2;
  const r = Math.hypot(x, y * 0.82);
  const a = Math.atan2(y, x);
  const sirt = 0.5 + 0.5 * Math.sin(r * 34 + 2.2 * Math.sin(a * 2 + r * 3) + 1.4 * Math.sin(y * 4));
  const maske = Math.max(0, Math.min(1, (1 - r) / 0.12));
  return Math.pow(sirt, 1.6) * maske * 0.95;
};
