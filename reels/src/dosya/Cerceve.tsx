import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from "remotion";
import {Kelime, kare} from "../ortak/stil";
import {Kagit} from "./Kagit";
import {D, GUV, SANS, VERI} from "./tema";

// Nokta silme geçişi: iri daire ızgarası çapraz gecikmeyle büyür (tam örter), sahne değişir, küçülür (13 kare)
export const NoktaSilme: React.FC<{an: number; renk: string}> = ({an, renk}) => {
  const f = useCurrentFrame();
  const d = f - an;
  if (d < -7 || d > 7) return null;
  const A = 120, sat = Math.ceil(1920 / A) + 1, sut = Math.ceil(1080 / A) + 1;
  const tam = A * 0.75;
  return (
    <svg width="1080" height="1920" style={{position: "absolute", inset: 0}}>
      {Array.from({length: sat * sut}).map((_, i) => {
        const x = (i % sut) * A, y = Math.floor(i / sut) * A;
        const gec = ((i % sut) + Math.floor(i / sut)) / (sat + sut) * 3;
        const p = d < 0 ? interpolate(d + 7 - gec, [0, 4], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}) : interpolate(d - gec, [0, 4], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
        return <circle key={i} cx={x + A / 2} cy={y + A / 2} r={tam * p} fill={renk} />;
      })}
    </svg>
  );
};

// Sarsıntı (karesel sönüm) + flaş (en fazla 0,5)
export const sarsinti = (f: number, anlar: {an: number; guc: number}[]) => {
  let x = 0, y = 0;
  for (const {an, guc} of anlar) {
    const d = f - an;
    if (d >= 0 && d < 12) { const g = guc * (1 - d / 12) ** 2; x += Math.sin(d * 2.9) * g; y += Math.cos(d * 3.7) * g; }
  }
  return `${x}px ${y}px`;
};
const Flas: React.FC<{anlar: number[]}> = ({anlar}) => {
  const f = useCurrentFrame();
  const o = Math.max(0, ...anlar.map((a) => interpolate(f - a, [0, 1, 6], [0, 0.5, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})));
  return <AbsoluteFill style={{background: "#fff", opacity: o}} />;
};

// HUD: sol üst dosya no + bölüm çipi, sağ üst REC + tarih (güvenli bölge içinde)
const HUD: React.FC<{dosya: string; bolumler: {an: number; ad: string}[]}> = ({dosya, bolumler}) => {
  const f = useCurrentFrame();
  const b = [...bolumler].reverse().find((x) => f >= x.an);
  return (
    <>
      <div style={{position: "absolute", top: GUV.ust - 60, left: GUV.sol, display: "flex", gap: 12, fontFamily: VERI, fontWeight: 800, fontSize: 24, letterSpacing: 2}}>
        <span style={{color: D.murekkep, border: `3px solid ${D.murekkep}`, padding: "4px 12px", borderRadius: 6}}>DOSYA {dosya}</span>
        {b && <span style={{color: D.kagitAcik, background: D.murekkep, padding: "7px 12px", borderRadius: 6}}>{b.ad}</span>}
      </div>
      <div style={{position: "absolute", top: GUV.ust - 54, right: GUV.sag, display: "flex", alignItems: "center", gap: 10, fontFamily: VERI, fontWeight: 800, fontSize: 24, color: D.murekkep}}>
        <span style={{width: 16, height: 16, borderRadius: 8, background: D.alarm, opacity: Math.floor(f / 15) % 2 ? 0.25 : 1}} />REC
      </div>
    </>
  );
};

// Altyazı bandı: koyu mürekkep hap, kobalt kayık gölge, kâğıt rengi yazı, anahtar kelime sarı. İfade bazlı, en fazla 4 kelime.
const Bant: React.FC<{kelimeler: Kelime[]; anahtar: string[]}> = ({kelimeler, anahtar}) => {
  const f = useCurrentFrame();
  const g: Kelime[][] = []; let c: Kelime[] = [];
  for (const k of kelimeler) { c.push(k); if (c.length === 4 || /[.,!?;:]$/.test(k.kelime)) { g.push(c); c = []; } }
  if (c.length) g.push(c);
  const gi = g.findIndex((x, i) => f >= kare(x[0].baslangic) - 2 && f < (i + 1 < g.length ? kare(g[i + 1][0].baslangic) - 2 : kare(x[x.length - 1].bitis) + 20));
  if (gi < 0) return null;
  const grup = g[gi];
  const d = f - kare(grup[0].baslangic) + 2;
  const p = interpolate(d, [0, 6], [0, 1], {extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) * Math.cos(t * 4)});
  return (
    <div style={{position: "absolute", left: GUV.sol, right: GUV.sag - 80, bottom: GUV.alt, display: "flex", justifyContent: "center"}}>
      <div style={{position: "relative", scale: `${0.7 + p * 0.3}`, opacity: Math.min(1, p * 2)}}>
        <div style={{position: "absolute", inset: 0, translate: "8px 8px", background: D.golge, borderRadius: 999, mixBlendMode: "multiply"}} />
        <div style={{position: "relative", background: D.murekkep, borderRadius: 999, padding: "16px 34px 20px", display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", maxWidth: 900}}>
          {grup.map((k, i) => {
            const t = k.kelime.replace(/[.,!?;:]/g, "");
            const vur = anahtar.includes(t.toLocaleLowerCase("tr"));
            const soyledi = f >= kare(k.baslangic);
            return <span key={i} style={{fontFamily: SANS, fontWeight: 800, fontSize: 54, color: vur ? D.vurgu : D.kagitAcik, opacity: soyledi ? 1 : 0.45}}>{t}</span>;
          })}
        </div>
      </div>
    </div>
  );
};

export const DosyaVideo: React.FC<{
  sahneler: {S: React.FC<{o: number}>; bas: number}[]; sure: number;
  silmeler: {an: number; renk: string}[]; sertKesmeler?: number[];
  muhurler: number[]; kelimeler: Kelime[]; anahtar: string[]; dosya: string;
  bolumler: {an: number; ad: string}[]; klasor: string; children?: React.ReactNode;
}> = ({sahneler, sure, silmeler, sertKesmeler = [], muhurler, kelimeler, anahtar, dosya, bolumler, klasor, children}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{translate: sarsinti(f, [...muhurler.map((an) => ({an, guc: 22})), ...sertKesmeler.map((an) => ({an, guc: 8}))])}}>
        <Kagit />
        {sahneler.map(({S, bas}, i) => {
          const son = i + 1 < sahneler.length ? sahneler[i + 1].bas : sure;
          return <Sequence key={i} from={bas} durationInFrames={son - bas} layout="none"><S o={bas} /></Sequence>;
        })}
      </AbsoluteFill>
      {silmeler.map((s, i) => <NoktaSilme key={i} an={s.an} renk={s.renk} />)}
      <Flas anlar={[...muhurler, ...sertKesmeler]} />
      <HUD dosya={dosya} bolumler={bolumler} />
      <Bant kelimeler={kelimeler} anahtar={anahtar} />
      <Audio src={staticFile(`${klasor}/ses.mp3`)} />
      <Audio src={staticFile(`${klasor}/muzik.wav`)} volume={0.13} />
      <Audio src={staticFile(`${klasor}/ambiyans.wav`)} volume={0.015} />
      {children}
    </AbsoluteFill>
  );
};

export const Efekt: React.FC<{ad: string; an: number; ses?: number}> = ({ad, an, ses = 0.25}) => (
  <Sequence from={Math.max(0, an)} layout="none"><Audio src={staticFile(`sfx_dosya/${ad}.wav`)} volume={ses} /></Sequence>
);
