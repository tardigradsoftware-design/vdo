// ALTYAZI SİSTEMİ — kısa ifadeler (≤3 kelime), güvenli alanda; büyük tipografi olan aralıklarda gizlenir
import {interpolate, useCurrentFrame} from "remotion";
import {FONT, GA, R} from "./marka";
import {Kelime, kare} from "./zaman";
export const Altyazi: React.FC<{K: Kelime[]; anahtar: string[]; gizli?: [number, number][]}> = ({K, anahtar, gizli = []}) => {
  const f = useCurrentFrame();
  if (gizli.some(([a, b]) => f >= a && f < b)) return null;
  const g: Kelime[][] = []; let c: Kelime[] = [];
  for (const k of K) { c.push(k); if (c.length === 3 || /[.,!?]$/.test(k.kelime)) { g.push(c); c = []; } }
  if (c.length) g.push(c);
  const gi = g.findIndex((x, i) => f >= kare(x[0].baslangic) - 1 && f < (i + 1 < g.length ? kare(g[i + 1][0].baslangic) - 1 : kare(x[x.length - 1].bitis) + 12));
  if (gi < 0) return null;
  const grup = g[gi];
  const p = interpolate(f - kare(grup[0].baslangic) + 1, [0, 5], [0, 1], {extrapolateRight: "clamp"});
  return (
    <div style={{position: "absolute", left: GA.sol, right: GA.sag, bottom: GA.alt, display: "flex", justifyContent: "center", opacity: p, translate: `0 ${(1 - p) * 12}px`}}>
      <div style={{display: "flex", gap: 12, background: R.murekkep, borderRadius: 18, padding: "12px 24px 14px"}}>
        {grup.map((k, i) => {
          const t = k.kelime.replace(/[.,!?]/g, "");
          const on = anahtar.includes(t.toLocaleLowerCase("tr"));
          const aktif = f >= kare(k.baslangic);
          return <span key={i} style={{fontFamily: FONT.govde, fontWeight: 800, fontSize: 48, color: on ? R.vurgu : R.beyaz, opacity: aktif ? 1 : 0.45}}>{t}</span>;
        })}
      </div>
    </div>
  );
};
