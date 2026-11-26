import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from "remotion";
import {Kelime, kare} from "../ortak/stil";
import {F, GUV, YAZI, inout} from "./tema";

const G = 12; // geçiş örtüşmesi (kare)

// Yumuşak geçiş: giriş aşağıdan kayıp netleşir, çıkış yukarı kayıp bulanıklaşır
const Gecis: React.FC<{sure: number; ilk: boolean; son: boolean; children: React.ReactNode}> = ({sure, ilk, son, children}) => {
  const f = useCurrentFrame();
  const gir = ilk ? 1 : interpolate(f, [0, G], [0, 1], {extrapolateRight: "clamp", easing: inout});
  const cik = son ? 0 : interpolate(f, [sure - G, sure], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: inout});
  return (
    <AbsoluteFill style={{opacity: Math.min(gir, 1 - cik), translate: `0 ${(1 - gir) * 60 - cik * 60}px`, filter: `blur(${(1 - gir) * 10 + cik * 10}px)`, scale: `${1 + (1 - gir) * 0.04}`}}>
      {children}
    </AbsoluteFill>
  );
};

// Kinetik başlık: kelimeler sırayla aşağıdan maske içinden kayar
export const Baslik: React.FC<{metin: string; an: number; boyut?: number; renk?: string; vurgu?: string[]; style?: React.CSSProperties; hiza?: "left" | "center"}> = ({metin, an, boyut = 84, renk = F.lacivert, vurgu = [], style, hiza = "left"}) => {
  const f = useCurrentFrame();
  return (
    <div style={{display: "flex", flexWrap: "wrap", gap: `0 ${boyut * 0.28}px`, justifyContent: hiza === "center" ? "center" : "flex-start", ...style}}>
      {metin.split(" ").map((k, i) => {
        const p = interpolate(f - an - i * 3, [0, 14], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 4)});
        return (
          <span key={i} style={{overflow: "hidden", display: "inline-block", paddingBottom: boyut * 0.12}}>
            <span style={{display: "inline-block", fontFamily: YAZI, fontWeight: 800, fontSize: boyut, lineHeight: 1.05, letterSpacing: -2, color: vurgu.includes(k) ? F.mavi : renk, translate: `0 ${(1 - p) * 110}%`}}>{k}</span>
          </span>
        );
      })}
    </div>
  );
};

// Altyazı: beyaz yuvarlak kart, lacivert yazı, konuşulan kelime royal blue
const Altyazi: React.FC<{kelimeler: Kelime[]; vurgu: string[]}> = ({kelimeler, vurgu}) => {
  const f = useCurrentFrame();
  const g: Kelime[][] = []; let c: Kelime[] = [];
  for (const k of kelimeler) { c.push(k); if (c.length === 4 || /[.,!?;:]$/.test(k.kelime)) { g.push(c); c = []; } }
  if (c.length) g.push(c);
  const gi = g.findIndex((x, i) => f >= kare(x[0].baslangic) - 2 && f < (i + 1 < g.length ? kare(g[i + 1][0].baslangic) - 2 : kare(x[x.length - 1].bitis) + 20));
  if (gi < 0) return null;
  const grup = g[gi];
  const p = interpolate(f - kare(grup[0].baslangic) + 2, [0, 8], [0, 1], {extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3)});
  return (
    <div style={{position: "absolute", left: GUV.sol, right: GUV.sag - 80, bottom: GUV.alt, display: "flex", justifyContent: "center", opacity: p, translate: `0 ${(1 - p) * 20}px`}}>
      <div style={{background: F.beyaz, borderRadius: 28, padding: "16px 30px 20px", display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", boxShadow: "0 18px 40px rgba(69,66,118,0.18)", maxWidth: 900}}>
        {grup.map((k, i) => {
          const t = k.kelime.replace(/[.,!?;:]/g, "");
          const aktif = f >= kare(k.baslangic) && (i === grup.length - 1 || f < kare(grup[i + 1].baslangic));
          const ozel = vurgu.includes(t.toLocaleLowerCase("tr"));
          return <span key={i} style={{fontFamily: YAZI, fontWeight: 800, fontSize: 54, color: aktif || ozel ? F.mavi : F.lacivert, opacity: f >= kare(k.baslangic) ? 1 : 0.4}}>{t}</span>;
        })}
      </div>
    </div>
  );
};

export const Sfx: React.FC<{ad: string; an: number; ses?: number}> = ({ad, an, ses = 0.25}) => (
  <Sequence from={Math.max(0, an)} layout="none"><Audio src={staticFile(`sfx_flat/${ad}.wav`)} volume={ses} /></Sequence>
);

export const FlatVideo: React.FC<{sahneler: React.FC<{o: number}>[]; sinir: number[]; kelimeler: Kelime[]; vurgu: string[]; klasor: string; children?: React.ReactNode}> = ({sahneler, sinir, kelimeler, vurgu, klasor, children}) => {
  const sure = sinir[sinir.length - 1];
  return (
    <AbsoluteFill style={{background: F.pastel}}>
      {sahneler.map((S, i) => {
        const bas = i === 0 ? 0 : sinir[i] - G / 2;
        const bit = i === sahneler.length - 1 ? sure : sinir[i + 1] + G / 2;
        return (
          <Sequence key={i} from={bas} durationInFrames={bit - bas} layout="none">
            <Gecis sure={bit - bas} ilk={i === 0} son={i === sahneler.length - 1}><S o={bas} /></Gecis>
          </Sequence>
        );
      })}
      <Altyazi kelimeler={kelimeler} vurgu={vurgu} />
      <Audio src={staticFile(`${klasor}/ses.mp3`)} />
      <Audio src={staticFile(`${klasor}/muzik.wav`)} volume={0.13} />
      {sinir.slice(1, -1).map((s, i) => <Sfx key={i} ad="whoosh" an={s - 8} ses={0.22} />)}
      {children}
    </AbsoluteFill>
  );
};
