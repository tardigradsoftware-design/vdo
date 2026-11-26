import {interpolate, useCurrentFrame} from "remotion";
import {Kelime, kare} from "../ortak/stil";
import {C, SANS} from "./tema";

// Sade altyazı: 3 kelimelik gruplar, konuşulan kelimenin altı kırmızı çizilir
export const CAltyazi: React.FC<{kelimeler: Kelime[]; vurgu?: string[]}> = ({kelimeler, vurgu = []}) => {
  const f = useCurrentFrame();
  const g: Kelime[][] = [];
  // En fazla 3 kelime; cümle/virgül sonunda grup biter (sahne sınırını aşmaz)
  let cur: Kelime[] = [];
  for (const k of kelimeler) {
    cur.push(k);
    if (cur.length === 3 || /[.,!?;:]$/.test(k.kelime)) { g.push(cur); cur = []; }
  }
  if (cur.length) g.push(cur);
  const gi = g.findIndex((x, i) => f >= kare(x[0].baslangic) && f < (i + 1 < g.length ? kare(g[i + 1][0].baslangic) : kare(x[x.length - 1].bitis) + 15));
  if (gi < 0) return null;
  const grup = g[gi];
  const o = interpolate(f - kare(grup[0].baslangic), [0, 4], [0, 1], {extrapolateRight: "clamp"});
  return (
    <div style={{position: "absolute", left: 60, right: 60, bottom: 230, display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap", opacity: o}}>
      {grup.map((k, i) => {
        const aktif = f >= kare(k.baslangic) && f < kare(k.bitis) + 3;
        const gecti = f >= kare(k.baslangic);
        const temiz = k.kelime.replace(/[.,!?;:]/g, "");
        const ozel = vurgu.includes(temiz.toLocaleUpperCase("tr"));
        return (
          <span key={i} style={{position: "relative", fontFamily: SANS, fontWeight: 800, fontSize: 64, color: ozel ? C.kirmizi : gecti ? C.yazi : `${C.yazi}66`, textShadow: "0 4px 18px rgba(0,0,0,0.8)"}}>
            {temiz}
            <span style={{position: "absolute", left: 0, right: 0, bottom: -8, height: 7, background: C.kirmizi, transformOrigin: "left", transform: `scaleX(${aktif ? 1 : 0})`}} />
          </span>
        );
      })}
    </div>
  );
};
