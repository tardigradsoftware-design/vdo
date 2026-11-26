import {spring, useCurrentFrame, useVideoConfig} from "remotion";
import {FONT, Kelime, R, kare} from "./stil";

// Alt-orta, iki kelime iki kelime, konuşulan kelime turuncu vurgulu
export const Altyazi: React.FC<{kelimeler: Kelime[]; vurgu?: string[]}> = ({kelimeler, vurgu = []}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const gruplar: Kelime[][] = [];
  for (let i = 0; i < kelimeler.length; i += 2) gruplar.push(kelimeler.slice(i, i + 2));
  const gi = gruplar.findIndex((g, i) => {
    const bas = kare(g[0].baslangic);
    const son = i + 1 < gruplar.length ? kare(gruplar[i + 1][0].baslangic) : kare(g[g.length - 1].bitis) + 15;
    return f >= bas && f < son;
  });
  if (gi < 0) return null;
  const g = gruplar[gi];
  const s = spring({frame: f - kare(g[0].baslangic), fps, config: {damping: 14, stiffness: 220}});
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        bottom: 250,
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: 22,
        transform: `scale(${0.85 + s * 0.15})`,
      }}
    >
      {g.map((k, i) => {
        const aktif = f >= kare(k.baslangic) - 1;
        const temiz = k.kelime.replace(/[.,!?;:]/g, "");
        const ozel = vurgu.some((v) => temiz.toLocaleUpperCase("tr") === v.toLocaleUpperCase("tr"));
        return (
          <span
            key={i}
            style={{
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 78,
              letterSpacing: -2,
              color: aktif ? (ozel ? R.siyah : R.zemin) : R.siyah,
              background: aktif ? (ozel ? R.sari : R.turuncu) : R.zemin,
              border: `6px solid ${R.siyah}`,
              borderRadius: 18,
              padding: "6px 22px 12px",
              boxShadow: `8px 8px 0 ${R.siyah}`,
            }}
          >
            {temiz.toLocaleUpperCase("tr")}
          </span>
        );
      })}
    </div>
  );
};
