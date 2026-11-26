import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {Kelime, kare} from "../ortak/stil";
import {C, GUVENLI, MONO, SANS} from "../ciddi/tema";
import {CZemin} from "../ciddi/Zemin";
import {CSfx} from "../ciddi/Video";
import {KonusanMaskot} from "./Maskot";

// Işık huzmesinde süzülen toz/bokeh parçacıkları (derinlik)
const Toz: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: "none"}}>
      {Array.from({length: 26}).map((_, i) => {
        const z = (i % 3) + 1;
        const x = ((i * 397) % 1080 + f * (0.2 * z)) % 1080;
        const y = ((i * 613) % 1920 - f * (0.5 * z) + 1920 * 3) % 1920;
        const r = 3 + z * 3;
        return <div key={i} style={{position: "absolute", left: x, top: y, width: r, height: r, borderRadius: "50%", background: i % 5 === 0 ? C.kirmizi : C.soluk, opacity: 0.05 + z * 0.04, filter: `blur(${z === 3 ? 2 : 0}px)`}} />;
      })}
    </AbsoluteFill>
  );
};

// Bölümlü ilerleme (hikâye tarzı) + aktif bölüm etiketi
const Bolumler: React.FC<{sinir: number[]; adlar: string[]}> = ({sinir, adlar}) => {
  const f = useCurrentFrame();
  const ai = sinir.findIndex((s, i) => f >= s && f < sinir[i + 1]);
  return (
    <>
      <div style={{position: "absolute", top: GUVENLI.ust - 70, left: GUVENLI.sol, right: GUVENLI.sag, display: "flex", gap: 10}}>
        {adlar.map((_, i) => {
          const p = interpolate(f, [sinir[i], sinir[i + 1]], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
          return <div key={i} style={{flex: sinir[i + 1] - sinir[i], height: 6, borderRadius: 3, background: "#14161A14", overflow: "hidden"}}><div style={{width: `${p * 100}%`, height: "100%", background: i === ai ? C.kirmizi : C.yazi}} /></div>;
        })}
      </div>
      {ai >= 0 && (
        <div style={{position: "absolute", top: GUVENLI.ust - 50, right: GUVENLI.sag, fontFamily: MONO, fontWeight: 700, fontSize: 26, letterSpacing: 5, color: C.soluk, opacity: interpolate(f - sinir[ai], [0, 8], [0, 1], {extrapolateRight: "clamp"})}}>
          <span style={{color: C.kirmizi}}>{String(ai + 1).padStart(2, "0")}</span> / {adlar[ai]}
        </div>
      )}
    </>
  );
};

// Geçiş: içinden geçen zoom + kromatik sapma + kısa ışık patlaması (7 kare)
const PSahne: React.FC<{sure: number; son: boolean; children: React.ReactNode}> = ({sure, son, children}) => {
  const f = useCurrentFrame();
  const G = 7;
  const gir = interpolate(f, [0, G], [1, 0], {extrapolateRight: "clamp"});
  const cik = son ? interpolate(f, [sure - G, sure], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}) : 0;
  const k = Math.max(gir, cik);
  const olcek = (1 - gir * 0.18) * (1 + cik * 0.35) * (1 + f * 0.0003);
  return (
    <AbsoluteFill style={{transformOrigin: "50% 0%", transform: `translateY(${GUVENLI.ust - 150 * 0.84}px) scale(${0.84 * olcek})`, opacity: 1 - k * 0.9, filter: `blur(${k * 14}px) drop-shadow(${k * 18}px 0 0 rgba(229,56,59,${k * 0.7})) drop-shadow(${-k * 18}px 0 0 rgba(60,200,255,${k * 0.5}))`}}>
      {children}
    </AbsoluteFill>
  );
};
const Flas: React.FC<{sinir: number[]}> = ({sinir}) => {
  const f = useCurrentFrame();
  const o = Math.max(0, ...sinir.slice(1, -1).map((s) => interpolate(f - s, [-2, 0, 5], [0, 0.22, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})));
  return <AbsoluteFill style={{background: C.kirmizi, opacity: o * 0.5, mixBlendMode: "multiply"}} />;
};

// Cam panel altyazı, aktif kelimede kayan kırmızı vurgu
const PAltyazi: React.FC<{kelimeler: Kelime[]; vurgu: string[]}> = ({kelimeler, vurgu}) => {
  const f = useCurrentFrame();
  const g: Kelime[][] = [];
  let cur: Kelime[] = [];
  for (const k of kelimeler) { cur.push(k); if (cur.length === 3 || /[.,!?;:]$/.test(k.kelime)) { g.push(cur); cur = []; } }
  if (cur.length) g.push(cur);
  const gi = g.findIndex((x, i) => f >= kare(x[0].baslangic) && f < (i + 1 < g.length ? kare(g[i + 1][0].baslangic) : kare(x[x.length - 1].bitis) + 15));
  if (gi < 0) return null;
  const grup = g[gi];
  const o = interpolate(f - kare(grup[0].baslangic), [0, 4], [0, 1], {extrapolateRight: "clamp"});
  return (
    <div style={{position: "absolute", left: 0, right: 0, bottom: GUVENLI.alt - 20, display: "flex", justifyContent: "center", opacity: o, transform: `translateY(${(1 - o) * 14}px)`}}>
      <div style={{display: "flex", gap: 8, padding: "14px 18px", borderRadius: 22, background: "rgba(255,255,255,0.78)", backdropFilter: "blur(14px)", border: `1px solid ${C.cizgi}`, boxShadow: "0 18px 40px rgba(40,30,10,0.18)"}}>
        {grup.map((k, i) => {
          const aktif = f >= kare(k.baslangic) && (i === grup.length - 1 || f < kare(grup[i + 1].baslangic));
          const temiz = k.kelime.replace(/[.,!?;:]/g, "");
          const ozel = vurgu.includes(temiz.toLocaleUpperCase("tr"));
          return <span key={i} style={{fontFamily: SANS, fontWeight: 800, fontSize: 60, padding: "4px 16px 8px", borderRadius: 14, color: aktif ? "#fff" : f >= kare(k.baslangic) ? C.yazi : `${C.yazi}55`, background: aktif ? (ozel ? C.altin : C.kirmizi) : "transparent", boxShadow: aktif ? `0 6px 18px ${C.kirmizi}55` : "none"}}>{temiz}</span>;
        })}
      </div>
    </div>
  );
};

const sars = (f: number, anlar: number[]) => {
  let x = 0, y = 0, r = 0;
  for (const a of anlar) { const d = f - a; if (d >= 0 && d < 14) { const g = (1 - d / 14) * 12; x += Math.sin(d * 2.3) * g; y += Math.cos(d * 2.9) * g; r += Math.sin(d * 1.7) * g * 0.05; } }
  return `translate(${x}px, ${y}px) rotate(${r}deg)`;
};

export const PVideo: React.FC<{sahneler: React.FC<{o: number}>[]; sinir: number[]; bolumler: string[]; darbeler: number[]; kelimeler: Kelime[]; ses: string; vurgu?: string[]; maskot?: number; children?: React.ReactNode}> = ({sahneler, sinir, bolumler, darbeler, kelimeler, ses, vurgu = [], maskot, children}) => {
  const f = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  return (
    <AbsoluteFill>
      <CZemin />
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 20% 0%, ${C.kirmizi}10, transparent 50%), radial-gradient(ellipse at 90% 100%, ${C.altin}10, transparent 55%)`}} />
      <Toz />
      <AbsoluteFill style={{transform: sars(f, darbeler)}}>
        {sahneler.map((S, i) => (
          <Sequence key={i} from={sinir[i]} durationInFrames={sinir[i + 1] - sinir[i]} layout="none">
            <PSahne sure={sinir[i + 1] - sinir[i]} son={i < sahneler.length - 1}><S o={sinir[i]} /></PSahne>
          </Sequence>
        ))}
        {maskot && <KonusanMaskot no={maskot} ses={ses} />}
      </AbsoluteFill>
      <Flas sinir={sinir} />
      <PAltyazi kelimeler={kelimeler} vurgu={vurgu} />
      <Bolumler sinir={sinir} adlar={bolumler} />
      <Audio src={staticFile(ses)} />
      <Audio src={staticFile("muzik/ciddi.wav")} loop volume={(x) => 0.16 * Math.min(1, x / 10) * Math.min(1, (durationInFrames - x) / 15)} />
      {sinir.slice(1, -1).map((s, i) => <CSfx key={i} ad="gecis" an={s - 10} ses={0.22} />)}
      {darbeler.map((d, i) => <CSfx key={`d${i}`} ad="darbe" an={d} ses={0.3} />)}
      {children}
    </AbsoluteFill>
  );
};
