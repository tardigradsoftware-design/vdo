import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from "remotion";
import {Kelime} from "../ortak/stil";
import {DosyaVideo, Efekt} from "./Cerceve";
import {Cip, Daktilo, Govde, Kart, Karartma, Manset, Muhur} from "./Parcalar";
import {D, RAKAM, VERI} from "./tema";
import {Yarimton, parmakIzi, radyal} from "./Yarimton";

// ---- Veri tabanlı dava dosyası şablonu: her vuruş = bir sahne ----
type Renk = "murekkep" | "alarm" | "golge";
export type DVurus = {
  an: number; bolum?: string; silme?: Renk | "vurgu";
  satirlar?: {metin: string; an?: number; renk?: Renk; boyut?: number}[];
  ek?: string; rakam?: string; parmak?: boolean;
  belge?: {baslik: string; ust?: string; alanlar: {etiket: string; an: number; deger?: string; kirmizi?: boolean}[]};
  maddeler?: {metin: string; an: number}[];
  sayi?: {deger: string; an: number; alt?: string};
  muhur?: {metin: string; an: number; alt?: string; renk?: Renk};
  cta?: {kelime: string; yazAn: number; adimlar: {metin: string; an: number}[]};
};
const renk = (r?: Renk) => (r ? D[r] : D.murekkep);
const sigdir = (m: string, b: number) => Math.min(b, 840 / (m.length * 0.66));

const DevRakam: React.FC<{r: string; id: string}> = ({r, id}) => (
  <div style={{position: "absolute", right: -40, top: 640, width: 600, height: 800, opacity: 0.85, rotate: "6deg"}}>
    <svg width="600" height="800" style={{position: "absolute", overflow: "visible"}}>
      <defs><clipPath id={id}><text x="0" y="690" fontFamily={RAKAM} fontSize="800">{r}</text></clipPath></defs>
      <text x="0" y="690" fontFamily={RAKAM} fontSize="800" fill={D.vurgu}>{r}</text>
    </svg>
    <div style={{position: "absolute", inset: 0, clipPath: `url(#${id})`}}><Yarimton w={600} h={800} adim={20} aci={45} renk={D.golge} yogunluk={radyal(0.3, 0.3, 1.1, 0.95)} /></div>
  </div>
);

const Sahne: React.FC<{v: DVurus; o: number; sure: number; i: number}> = ({v, o, sure, i}) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, sure], [1, 1.05]);
  const acil = interpolate(f, [0, 14], [0, 75], {extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1)});
  return (
    <AbsoluteFill style={{scale: `${z}`, transformOrigin: "50% 45%"}}>
      {v.rakam && <DevRakam r={v.rakam} id={`rk${i}`} />}
      {v.parmak && <div style={{position: "absolute", right: 150, top: 720}}>
        <div style={{position: "absolute", left: -140, top: -80}}><Yarimton w={720} h={720} adim={22} aci={45} renk={D.golge} yogunluk={radyal(0.5, 0.5, 0.5, 0.7)} /></div>
        <div style={{width: 440, height: 560, clipPath: `circle(${acil}% at 50% 55%)`}}><Yarimton w={440} h={560} adim={14} aci={15} renk={D.murekkep} yogunluk={parmakIzi} /></div>
      </div>}
      <div style={{position: "absolute", left: 90, right: 160, top: 310, bottom: 500, display: "flex", flexDirection: "column", justifyContent: v.rakam || v.parmak ? "flex-start" : "center", gap: 30}}>
        {v.satirlar?.map((s, j) => <Manset key={j} metin={s.metin} an={(s.an ?? v.an) - o} boyut={sigdir(s.metin, s.boyut ?? 120)} renk={renk(s.renk)} golge={s.renk === "golge" ? D.vurgu : D.golge} aralik={1.2} />)}
        {v.ek && <div><Cip an={4}>{v.ek}</Cip></div>}
        {v.belge && (
          <Kart an={2} w={840} aci={-2} style={{padding: "38px 44px"}}>
            {v.belge.ust && <div style={{fontFamily: VERI, fontWeight: 800, fontSize: 24, color: D.murekkep}}>{v.belge.ust}</div>}
            <div style={{fontFamily: RAKAM, fontSize: 54, color: D.murekkep, marginTop: 8}}>{v.belge.baslik}</div>
            <div style={{height: 5, background: D.murekkep, margin: "12px 0 14px"}} />
            {v.belge.alanlar.map((a, j) => (
              <div key={j} style={{fontFamily: VERI, fontWeight: 800, fontSize: 38, color: D.murekkep, marginTop: 14}}>
                {a.etiket}{a.deger ? <> <Daktilo an={a.an - o} metin={a.deger} style={{color: a.kirmizi ? D.alarm : D.golge}} /></> : <Karartma an={a.an - o} en={300} yuk={34} />}
              </div>
            ))}
          </Kart>
        )}
        {v.maddeler?.map((m, j) => {
          const p = interpolate(f - (m.an - o), [0, 10], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.8))});
          return (
            <div key={j} style={{display: "flex", alignItems: "center", gap: 26, opacity: f >= m.an - o ? 1 : 0, translate: `${(1 - p) * -80}px 0`}}>
              <div style={{width: 110, height: 110, borderRadius: 55, background: D.golge, border: `6px solid ${D.murekkep}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: RAKAM, fontSize: 58, color: D.kagitAcik, scale: `${p}`, flexShrink: 0}}>{j + 1}</div>
              <div style={{background: D.kagitAcik, border: `5px solid ${D.murekkep}`, borderRadius: 14, boxShadow: `10px 10px 0 ${D.golge}`, padding: "12px 26px"}}><Govde boyut={62}>{m.metin}</Govde></div>
            </div>
          );
        })}
        {v.sayi && (
          <div style={{position: "relative"}}>
            <Manset metin={v.sayi.deger} an={v.sayi.an - o} boyut={sigdir(v.sayi.deger, 260)} renk={D.alarm} />
            {v.sayi.alt && <div style={{marginTop: 10}}><Cip an={v.sayi.an - o + 8} zemin={D.vurgu} renk={D.murekkep} style={{fontSize: 40}}>{v.sayi.alt}</Cip></div>}
          </div>
        )}
        {v.cta && (
          <>
            <Kart an={0} w={840} yon="olcek" style={{padding: "26px 36px"}}>
              <Cip an={2}>YORUMLARA YAZ</Cip>
              <div style={{marginTop: 16, background: D.vurgu, border: `7px solid ${D.murekkep}`, borderRadius: 16, padding: "6px 30px", fontFamily: VERI, fontWeight: 800, fontSize: sigdir(v.cta.kelime, 130) * 1.1, color: D.murekkep, height: 160}}>
                <Daktilo an={v.cta.yazAn - o} metin={v.cta.kelime} hiz={2} />
              </div>
            </Kart>
            {v.cta.adimlar.map((m, j) => (
              <div key={j} style={{display: "flex", alignItems: "center", gap: 22, opacity: f >= m.an - o ? 1 : 0}}>
                <div style={{width: 80, height: 80, borderRadius: 40, background: D.golge, border: `5px solid ${D.murekkep}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: RAKAM, fontSize: 42, color: D.kagitAcik}}>{j + 1}</div>
                <Govde boyut={56}>{m.metin}</Govde>
              </div>
            ))}
          </>
        )}
      </div>
      {v.muhur && <Muhur metin={v.muhur.metin} alt={v.muhur.alt} an={v.muhur.an - o} renk={renk(v.muhur.renk ?? "alarm")} boyut={Math.min(150, 900 / (v.muhur.metin.length * 0.74))} aci={-9} style={{left: 80, top: 980}} />}
    </AbsoluteFill>
  );
};

export const DosyaSablon: React.FC<{V: DVurus[]; K: Kelime[]; sure: number; klasor: string; dosya: string; anahtar: string[]}> = ({V, K, sure, klasor, dosya, anahtar}) => {
  const sahneler = V.map((v, i) => {
    const son = i + 1 < V.length ? V[i + 1].an : sure;
    const S: React.FC<{o: number}> = ({o}) => <Sahne v={v} o={o} sure={son - v.an} i={i} />;
    return {S, bas: v.an};
  });
  const silmeler = V.filter((v) => v.silme).map((v) => ({an: v.an, renk: D[v.silme!]}));
  const sert = V.filter((v, i) => i > 0 && !v.silme).map((v) => v.an);
  const muhurler = V.filter((v) => v.muhur).map((v) => v.muhur!.an);
  let son = "";
  const bolumler = V.map((v) => ({an: v.an, ad: (son = v.bolum ?? son)}));
  return (
    <DosyaVideo sahneler={sahneler} sure={sure} silmeler={silmeler} sertKesmeler={sert} muhurler={muhurler} kelimeler={K} anahtar={anahtar} dosya={dosya} bolumler={bolumler} klasor={klasor}>
      {V.map((v, i) => <Efekt key={`g${i}`} ad={v.silme ? "vuus" : "kagit"} an={v.an - (v.silme ? 9 : 2)} ses={0.22} />)}
      {V.flatMap((v) => (v.satirlar ?? []).map((s, j) => <Efekt key={`p${v.an}${j}`} ad="pop" an={s.an ?? v.an} ses={0.12} />))}
      {V.flatMap((v) => (v.belge?.alanlar ?? []).map((a, j) => <Efekt key={`b${v.an}${j}`} ad={a.deger ? "daktilo" : "zip"} an={a.an} ses={0.18} />))}
      {V.flatMap((v) => [...(v.maddeler ?? []), ...(v.cta?.adimlar ?? [])].map((m, j) => <Efekt key={`m${v.an}${j}`} ad="tik" an={m.an} ses={0.18} />))}
      {V.filter((v) => v.sayi).map((v) => <Efekt key={`s${v.an}`} ad="pop" an={v.sayi!.an} ses={0.25} />)}
      {muhurler.map((a) => <Efekt key={`mh${a}`} ad="muhur" an={a} ses={0.5} />)}
      {V.filter((v) => v.cta).flatMap((v) => [0, 2, 4, 6, 8, 10, 12].map((d) => <Efekt key={`c${d}`} ad="daktilo" an={v.cta!.yazAn + d} ses={0.18} />))}
    </DosyaVideo>
  );
};
