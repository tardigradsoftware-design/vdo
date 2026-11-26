import {AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import "@fontsource/archivo-black/400.css";
import "@fontsource/inter/800.css";
import {Kelime, kare} from "../ortak/stil";

// ---- Yüksek tempo şablonu: her "vuruş" tam ekran bir kart, sert kesme + punch-in + flaş ----
export const H = {mavi: "#2869F5", lacivert: "#14143A", beyaz: "#F7F6F1", kirmizi: "#FF3B30", sari: "#FFD60A"};
const YAZI = "'Archivo Black', sans-serif";
const GOVDE = "'Inter', sans-serif";
type Zemin = keyof typeof H;
export type Vurus =
  | {an: number; tip: "manset"; satirlar: string[]; zemin: Zemin; ikon?: string}
  | {an: number; tip: "liste"; baslik: string; maddeler: {metin: string; an: number; ikon?: string}[]; zemin: Zemin}
  | {an: number; tip: "yasak"; satirlar: string[]; zemin: Zemin}
  | {an: number; tip: "sayi"; ust: string; sayi: string; zemin: Zemin; ikon?: string}
  | {an: number; tip: "cta"; kelime: string; yazAn: number; zemin: Zemin};

const yazi = (z: Zemin) => (z === "beyaz" || z === "sari" ? H.lacivert : H.beyaz);
const vurgu = (z: Zemin) => (z === "sari" ? H.kirmizi : z === "beyaz" ? H.mavi : H.sari);

// Çarpma girişi: büyükten oturur, bulanıklık ve hafif dönüşle
const Carp: React.FC<{an: number; children: React.ReactNode; gecikme?: number; style?: React.CSSProperties}> = ({an, children, gecikme = 0, style}) => {
  const f = useCurrentFrame();
  const d = f - an - gecikme;
  const p = interpolate(d, [0, 5], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
  return <div style={{opacity: d < 0 ? 0 : 1, scale: `${1.7 - p * 0.7}`, filter: `blur(${(1 - p) * 14}px)`, rotate: `${(1 - p) * -6}deg`, ...style}}>{children}</div>;
};
const Ikon: React.FC<{ad: string; an: number; boyut: number; style?: React.CSSProperties}> = ({ad, an, boyut, style}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - an, fps, config: {damping: 9, stiffness: 220, mass: 0.6}});
  return <Img src={staticFile(`ikon/${ad}.png`)} style={{width: boyut, height: boyut, scale: `${s}`, rotate: `${(1 - s) * 40 + Math.sin(f / 6) * 4}deg`, filter: "drop-shadow(0 24px 30px rgba(0,0,0,0.3))", ...style}} />;
};
const Satirlar: React.FC<{satirlar: string[]; an: number; z: Zemin; boyut?: number}> = ({satirlar, an, z, boyut = 150}) => (
  <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 6}}>
    {satirlar.map((s, i) => {
      const v = s.startsWith("*");
      return <Carp key={i} an={an} gecikme={i * 3}><div style={{fontFamily: YAZI, fontSize: Math.min(boyut, 820 / ((v ? s.length - 1 : s.length) * 0.8)), lineHeight: 1, color: v ? vurgu(z) : yazi(z), textAlign: "center", letterSpacing: -2, textShadow: "0 10px 0 rgba(0,0,0,0.12)"}}>{v ? s.slice(1) : s}</div></Carp>;
    })}
  </div>
);

const Kart: React.FC<{v: Vurus; sure: number}> = ({v, sure}) => {
  const f = useCurrentFrame();
  const punch = interpolate(f, [0, sure], [1.1, 1], {extrapolateRight: "clamp", easing: Easing.out(Easing.quad)});
  const z = v.zemin;
  const flas = interpolate(f, [0, 3], [0.55, 0], {extrapolateRight: "clamp"});
  const golge = z === "beyaz" ? "#00000010" : "#ffffff14";
  return (
    <AbsoluteFill style={{background: H[z]}}>
      <AbsoluteFill style={{backgroundImage: `radial-gradient(${golge} 3px, transparent 3.5px)`, backgroundSize: "44px 44px", translate: `${-f * 2}px ${-f * 2}px`, width: 1300, height: 2200}} />
      <AbsoluteFill style={{scale: `${punch}`, alignItems: "center", justifyContent: "center", paddingTop: 0, paddingBottom: 380, paddingLeft: 70, paddingRight: 150}}>
        {v.tip === "manset" && <>{v.ikon && <Ikon ad={v.ikon} an={2} boyut={360} style={{marginBottom: 20}} />}<Satirlar satirlar={v.satirlar} an={0} z={z} /></>}
        {v.tip === "yasak" && (
          <div style={{position: "relative", display: "flex", alignItems: "center", justifyContent: "center"}}>
            <Satirlar satirlar={v.satirlar} an={0} z={z} boyut={170} />
            <svg width="760" height="760" viewBox="0 0 100 100" style={{position: "absolute", opacity: 0.9}}>
              <path d="M15 15 L85 85 M85 15 L15 85" stroke={z === "kirmizi" ? H.beyaz : H.kirmizi} strokeWidth="9" strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={interpolate(f, [4, 10], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})} style={{mixBlendMode: "multiply"}} />
            </svg>
          </div>
        )}
        {v.tip === "sayi" && <>{v.ikon && <Ikon ad={v.ikon} an={2} boyut={300} />}<Carp an={0}><div style={{fontFamily: YAZI, fontSize: 90, color: yazi(z), textAlign: "center"}}>{v.ust}</div></Carp><Carp an={3}><div style={{fontFamily: YAZI, fontSize: 330, lineHeight: 1, color: vurgu(z), letterSpacing: -8}}>{v.sayi}</div></Carp></>}
        {v.tip === "liste" && (
          <div style={{width: "100%"}}>
            <Carp an={0}><div style={{fontFamily: YAZI, fontSize: 100, color: yazi(z), textAlign: "center", marginBottom: 40}}>{v.baslik}</div></Carp>
            {v.maddeler.map((m, i) => (
              <Carp key={i} an={m.an - v.an}><div style={{display: "flex", alignItems: "center", gap: 30, background: z === "beyaz" ? "#fff" : "#ffffff18", borderRadius: 34, padding: "22px 36px", marginTop: 22, boxShadow: "0 16px 30px rgba(0,0,0,0.12)"}}>
                {m.ikon ? <Img src={staticFile(`ikon/${m.ikon}.png`)} style={{width: 120, height: 120}} /> : <div style={{width: 90, height: 90, borderRadius: 45, background: vurgu(z), display: "flex", alignItems: "center", justifyContent: "center", fontFamily: YAZI, fontSize: 52, color: H.lacivert}}>{i + 1}</div>}
                <div style={{fontFamily: YAZI, fontSize: 84, color: yazi(z)}}>{m.metin}</div>
              </div></Carp>
            ))}
          </div>
        )}
        {v.tip === "cta" && (
          <>
            <Carp an={0}><div style={{fontFamily: YAZI, fontSize: 120, color: yazi(z), textAlign: "center", lineHeight: 1}}>YORUMLARA<br />YAZ</div></Carp>
            <Carp an={4}><div style={{marginTop: 40, background: H.sari, color: H.lacivert, fontFamily: YAZI, fontSize: 200, padding: "10px 60px", borderRadius: 40, minWidth: 560, textAlign: "center", boxShadow: "0 20px 0 rgba(0,0,0,0.2)", rotate: "-3deg"}}>
              {v.kelime.slice(0, Math.max(0, Math.min(v.kelime.length, Math.floor((f - (v.yazAn - v.an)) / 2) + 1)))}<span style={{opacity: Math.floor(f / 6) % 2 ? 0 : 1}}>|</span>
            </div></Carp>
          </>
        )}
      </AbsoluteFill>
      <AbsoluteFill style={{background: "#fff", opacity: flas}} />
    </AbsoluteFill>
  );
};

// Küçük akan altyazı (sesi kapalı izleyenler için), güvenli bölgede
const Alt: React.FC<{K: Kelime[]}> = ({K}) => {
  const f = useCurrentFrame();
  const i = K.findIndex((k, j) => f >= kare(k.baslangic) && (j === K.length - 1 || f < kare(K[j + 1].baslangic)));
  if (i < 0) return null;
  const grup = K.slice(Math.max(0, i - 1), i + 2);
  return (
    <div style={{position: "absolute", left: 70, right: 150, bottom: 470, display: "flex", justifyContent: "center"}}>
      <div style={{background: "rgba(10,10,30,0.82)", borderRadius: 999, padding: "12px 28px", display: "flex", gap: 12}}>
        {grup.map((k, j) => <span key={j} style={{fontFamily: GOVDE, fontWeight: 800, fontSize: 44, color: K.indexOf(k) === i ? H.sari : "#fff"}}>{k.kelime.replace(/[.,]/g, "")}</span>)}
      </div>
    </div>
  );
};
const Ilerleme: React.FC<{sure: number}> = ({sure}) => {
  const f = useCurrentFrame();
  return <div style={{position: "absolute", top: 230, left: 70, right: 150, height: 10, borderRadius: 5, background: "rgba(0,0,0,0.18)"}}><div style={{width: `${(f / sure) * 100}%`, height: "100%", borderRadius: 5, background: "#FFFFFF", boxShadow: "0 0 0 3px rgba(0,0,0,0.25)"}} /></div>;
};

export const Hizli: React.FC<{vuruslar: Vurus[]; K: Kelime[]; klasor: string; sure: number}> = ({vuruslar, K, klasor, sure}) => (
  <AbsoluteFill style={{background: H.lacivert}}>
    {vuruslar.map((v, i) => {
      const bas = v.an, son = i + 1 < vuruslar.length ? vuruslar[i + 1].an : sure;
      return <Sequence key={i} from={bas} durationInFrames={son - bas} layout="none"><Kart v={v} sure={son - bas} /></Sequence>;
    })}
    <Alt K={K} />
    <Ilerleme sure={sure} />
    <Audio src={staticFile(`${klasor}/ses.mp3`)} />
    <Audio src={staticFile(`${klasor}/muzik.wav`)} volume={0.16} />
    {vuruslar.map((v, i) => <Sequence key={`s${i}`} from={Math.max(0, v.an - 3)} layout="none"><Audio src={staticFile(`sfx_hizli/${v.tip === "yasak" ? "darbe" : i % 2 ? "vuus" : "vuus2"}.wav`)} volume={v.tip === "yasak" ? 0.35 : 0.22} /></Sequence>)}
    {vuruslar.flatMap((v) => (v.tip === "liste" ? v.maddeler.map((m, j) => <Sequence key={`m${v.an}${j}`} from={m.an} layout="none"><Audio src={staticFile("sfx_hizli/pop.wav")} volume={0.25} /></Sequence>) : []))}
  </AbsoluteFill>
);
