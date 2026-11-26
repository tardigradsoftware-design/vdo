// Tek kompozisyon: HakVideo. Video başına yalnızca ses, kelime zamanları ve sahne planı değişir.
import {getAudioDurationInSeconds} from "@remotion/media-utils";
import {noise2D} from "@remotion/noise";
import {AbsoluteFill, Audio, type CalculateMetadataFunction, Sequence, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {Altyazi} from "./Altyazi";
import {dogrula} from "./dogrula";
import {CTA, HookBalon, KartIcerik} from "./Kartlar";
import {Maskot, type Tepki} from "./Maskot";
import {ANTON, COLORS, KATEGORI, MONT, type Poz, SPRING, TON, low} from "./tema";
import type {HakProps, Plan, Word} from "./tipler";
import {beatZamanlari, kelimeKaresi, msKare} from "./zaman";
import {Zemin} from "./Zemin";

const GECISLER = ["kirbac", "pop", "maske", "zoom"] as const;
type Gecis = (typeof GECISLER)[number];

export const hakMetadata: CalculateMetadataFunction<HakProps> = async ({props}) => {
  const plan: Plan = await (await fetch(staticFile(`hak/${props.id}/plan.json`))).json();
  const words: Word[] = await (await fetch(staticFile(`hak/${props.id}/words.json`))).json();
  const audioSrc = staticFile(`hak/${props.id}/ses.mp3`);
  const sure = await getAudioDurationInSeconds(audioSrc);
  const durationInFrames = Math.ceil((sure + 0.5) * 30);
  dogrula(plan, words, durationInFrames, words.map((w) => w.text).join(" "));
  return {durationInFrames, props: {...props, plan, words, audioSrc}};
};

const Efekt: React.FC<{ad: string; an: number; ses: number}> = ({ad, an, ses}) => <Sequence from={Math.max(0, an)} layout="none"><Audio src={staticFile(`hak/sfx/${ad}.wav`)} volume={ses} /></Sequence>;

export const HakVideo: React.FC<HakProps> = ({id, plan, words, audioSrc, showSafeZones}) => {
  const f = useCurrentFrame();
  const {fps, durationInFrames: N} = useVideoConfig();
  if (!plan || !words || !audioSrc) return null;
  const bz = beatZamanlari(plan, words, N);
  const ci = bz.findIndex((b) => f >= b.bas && f < b.son);
  const b = plan.beats[ci], z = bz[ci];
  const ton = TON[plan.tone];
  const ctaI = plan.beats.length - 1, ctaBas = bz[ctaI].bas;
  // Geçiş seçimi: seed'li, art arda aynı değil
  const gecis: Gecis[] = [];
  plan.beats.forEach((_, i) => { let g = GECISLER[Math.floor(random(`${id}-${i}`) * 4)]; if (i > 0 && g === gecis[i - 1]) g = GECISLER[(GECISLER.indexOf(g) + 1) % 4]; gecis.push(g); });
  // --- Maskot konumu ---
  const hedef = (i: number) => {
    const t = plan.beats[i].card.type;
    if (t === "hook") return {x: 250, y: 1060, boy: 600, yon: "sag" as const};
    if (t === "cta") return {x: 190, y: 1060, boy: 440, yon: "sag" as const};
    const sol = Math.floor((i - 1) / 2) % 2 === 0;
    return {x: sol ? 215 : 800, y: 1060, boy: 340, yon: (sol ? "sag" : "sol") as "sag" | "sol"};
  };
  const h1 = hedef(ci), h0 = ci > 0 ? hedef(ci - 1) : h1;
  const gs = spring({frame: f - z.bas, fps, config: SPRING.SOFT});
  const mx = h0.x + (h1.x - h0.x) * gs, my = h0.y + (h1.y - h0.y) * gs, mboy = h0.boy + (h1.boy - h0.boy) * gs;
  const gonder = kelimeKaresi(words, "göndereyim.", 0) >= 0 ? kelimeKaresi(words, "göndereyim.", 0) : N - 20;
  const poz: Poz = ci === ctaI && f >= gonder ? "kutlama" : b.pose;
  const pozDegisim = ci === ctaI && f >= gonder ? gonder : z.bas;
  // ağız: kelime süresince 3 açık / 2 kapalı; 120 ms'den uzun boşlukta kapalı
  const ms = (f / fps) * 1000;
  const wi = words.findIndex((w, i) => ms >= w.startMs && (ms < w.endMs || (i + 1 < words.length && ms < words[i + 1].startMs && words[i + 1].startMs - w.endMs < 120)));
  const konusuyor = wi >= 0;
  const agizAcik = konusuyor && (f - msKare(words[wi].startMs)) % 5 < 3;
  const tepkiler: Tepki[] = plan.beats.flatMap((x, i): Tepki[] => x.card.type === "stamp" || x.card.type === "alert" ? [{an: bz[i].hit, isaret: "!" as const}] : x.card.type === "money" ? [{an: bz[i].hit, isaret: "yildiz" as const}] : []);
  // --- Kamera: kart boyunca 1.00→1.04; vurgu punch-in (en fazla 2 sn'de bir); stamp/alert sarsıntısı ---
  const yakin = interpolate(f, [z.bas, z.son], [1, 1.04]);
  const vurgular: number[] = [];
  plan.emphasis.forEach((e) => { const k = words.findIndex((w) => low(w.text) === low(e.word)); if (k >= 0) { const a = msKare(words[k].startMs) - 2; if (!vurgular.some((v) => Math.abs(v - a) < 60)) vurgular.push(a); } });
  const pu = vurgular.reduce((m, a) => m + (f >= a && f < a + 15 ? (f - a < 3 ? (f - a) / 3 : 1 - (f - a - 3) / 12) * 0.08 : 0), 0);
  const sars = plan.beats.reduce((m, x, i) => (x.card.type === "stamp" || x.card.type === "alert") && f >= bz[i].hit && f < bz[i].hit + 6 ? 8 : m, 0);
  const sx = sars ? noise2D(`${id}-sx`, f / 2, 0) * sars : 0, sy = sars ? noise2D(`${id}-sy`, 0, f / 2) * sars : 0;
  // --- Kart katmanı (geçişli) ---
  const kartGoster = (i: number, mod: "giris" | "cikis", g: Gecis) => {
    const c = plan.beats[i].card;
    if (c.type === "hook" || c.type === "cta") return null;
    const yerel = f - bz[i].bas;
    const yon = i % 2 ? 1 : -1;
    let st: React.CSSProperties = {};
    if (mod === "giris") {
      const s = spring({frame: yerel, fps, config: SPRING.POP});
      if (g === "kirbac" && i > 1) { const q = interpolate(yerel, [0, 7], [1, 0], {extrapolateRight: "clamp"}); st = {translate: `${q * 1080 * -yon}px 0`, filter: `blur(${q > 0.4 ? 8 : 0}px)`}; }
      else if (g === "maske" && i > 1) { const q = interpolate(yerel, [0, 8], [0, 150], {extrapolateRight: "clamp"}); st = {clipPath: `polygon(0 0, ${q}% 0, ${q - 50}% 100%, 0 100%)`}; }
      else if (g === "zoom" && i > 1) st = {scale: `${0.8 + 0.2 * s}`, opacity: Math.min(1, yerel / 4)};
      else st = {scale: `${0.6 + 0.4 * s}`, rotate: `${(1 - s) * 4 * yon}deg`};
    } else {
      const yerelSonraki = f - bz[i + 1].bas;
      if (g === "kirbac") st = {translate: `${interpolate(yerelSonraki, [0, 7], [0, 1080 * yon], {extrapolateRight: "clamp"})}px 0`, filter: "blur(8px)"};
      else if (g === "pop") st = {scale: `${interpolate(yerelSonraki, [0, 4], [1, 0.8], {extrapolateRight: "clamp"})}`, opacity: interpolate(yerelSonraki, [0, 4], [1, 0], {extrapolateRight: "clamp"})};
      else if (g === "maske") { const q = interpolate(yerelSonraki, [0, 8], [0, 150], {extrapolateRight: "clamp"}); st = {clipPath: `polygon(${q}% 0, 100% 0, 100% 100%, ${q - 50}% 100%)`}; }
      else st = {scale: `${interpolate(yerelSonraki, [0, 8], [1, 1.4], {extrapolateRight: "clamp"})}`, filter: `blur(${interpolate(yerelSonraki, [0, 8], [0, 12], {extrapolateRight: "clamp"})}px)`, opacity: interpolate(yerelSonraki, [0, 8], [1, 0], {extrapolateRight: "clamp"})};
    }
    return (
      <div key={`${i}-${mod}`} style={{position: "absolute", left: 140, top: 430, width: 800, ...st}}>
        <Sequence from={bz[i].bas} layout="none"><KartIcerik card={c} hit={bz[i].hit - bz[i].bas} /></Sequence>
      </div>
    );
  };
  const parilti = f >= ctaBas - 15 ? COLORS.yellow : ton.parilti;
  const Ikon = KATEGORI[plan.category];
  const muzikNo = 1 + Math.floor(random(id) * 3);
  // --- Ses olayları (en az 0,5 sn arayla; tuş sesleri hariç) ---
  const olaylar: {ad: string; an: number; ses: number}[] = [{ad: ton.acilis, an: 0, ses: 0.6}];
  plan.beats.forEach((x, i) => {
    if (i === 0) return;
    if (x.card.type !== "cta") olaylar.push({ad: i === 1 ? "pop" : "whoosh", an: bz[i].bas, ses: i === 1 ? 0.35 : 0.4});
    const h = bz[i].hit;
    const m: Record<string, [string, number]> = {stamp: ["damga", 0.6], money: ["para", 0.45], alert: ["alarm", 0.45], deadline: ["saat", 0.35], mythFact: ["buzzer", 0.45], stat: ["pop", 0.35]};
    if (m[x.card.type] && h - bz[i].bas >= 4) olaylar.push({ad: m[x.card.type][0], an: h, ses: m[x.card.type][1]});
    else if (m[x.card.type]) olaylar[olaylar.length - 1] = {ad: m[x.card.type][0], an: h, ses: m[x.card.type][1]};
    if (x.card.type === "mythFact") olaylar.push({ad: "ding", an: h + 16, ses: 0.45});
  });
  olaylar.push({ad: "riser", an: ctaBas - 15, ses: 0.5});
  olaylar.push({ad: "bildirim", an: gonder, ses: 0.5});
  const temiz = olaylar.sort((a, c) => a.an - c.an).filter((o, i, a) => i === 0 || o.an - a.slice(0, i).reduce((s, p) => Math.max(s, p.an), -99) >= 15 || o.ad === "bildirim");
  const yazAn = kelimeKaresi(words, plan.ctaKeyword, 0);
  return (
    <AbsoluteFill lang="tr" style={{background: COLORS.bg}}>
      <Zemin parilti={parilti} px={(yakin + pu - 1) * -200} py={0} id={id} />
      <AbsoluteFill style={{scale: `${yakin + pu}`, translate: `${sx}px ${sy}px`, transformOrigin: "540px 760px"}}>
        {ci >= 1 && ci < ctaI && kartGoster(ci, "giris", gecis[ci])}
        {ci >= 2 && ci <= ctaI && f - z.bas < 8 && kartGoster(ci - 1, "cikis", gecis[ci])}
        {ci === 0 && <HookBalon baslik={plan.hookTitle} kapanis={bz[1].bas - 6} />}
        {ci === ctaI && <Sequence from={ctaBas} layout="none"><CTA kelime={plan.ctaKeyword} yaz={yazAn - ctaBas} gonder={gonder - ctaBas} /></Sequence>}
        <Maskot x={mx} y={my} boy={mboy} poz={poz} yon={h1.yon} agizAcik={agizAcik} konusuyor={konusuyor} pozDegisim={pozDegisim} tepkiler={tepkiler} id={id} />
      </AbsoluteFill>
      {f >= ctaBas - 15 && f < ctaBas + 10 && <AbsoluteFill style={{boxShadow: `inset 0 0 160px ${COLORS.yellow}55`, opacity: interpolate(f, [ctaBas - 15, ctaBas, ctaBas + 10], [0, 1, 0])}} />}
      {plan.beats.map((x, i) => x.card.type === "alert" && f >= bz[i].hit && f < bz[i].hit + 12 ? <AbsoluteFill key={i} style={{boxShadow: `inset 0 0 200px ${COLORS.red}`, opacity: 1 - (f - bz[i].hit) / 12}} /> : null)}
      <Altyazi words={words} plan={plan} />
      {/* Üst bant */}
      <div style={{position: "absolute", left: 140, top: 262, display: "flex", alignItems: "center", gap: 12, background: COLORS.paper, border: `5px solid ${COLORS.ink}`, borderRadius: 999, padding: "10px 24px 10px 18px", boxShadow: "0 8px 0 rgba(0,0,0,0.35)"}}>
        <Ikon size={42} weight="fill" color={COLORS.ink} />
        <span style={{fontFamily: MONT, fontWeight: 800, fontSize: 34, letterSpacing: "0.04em", color: COLORS.ink}}>{plan.category}</span>
      </div>
      {f >= N * 0.6 && <div style={{position: "absolute", right: 140, top: 262, background: COLORS.yellow, border: `5px solid ${COLORS.ink}`, borderRadius: 26, padding: "8px 22px", fontFamily: ANTON, fontSize: 44, color: COLORS.ink, scale: `${1 + 0.04 * Math.sin(f / 5)}`}}>{plan.ctaKeyword}</div>}
      <div style={{position: "absolute", top: 0, left: 0, height: 8, width: `${(f / N) * 100}%`, background: COLORS.yellow}} />
      {showSafeZones && <AbsoluteFill style={{pointerEvents: "none"}}>
        <div style={{position: "absolute", left: 0, right: 0, top: 0, height: 230, background: "#ff000055"}} />
        <div style={{position: "absolute", left: 0, right: 0, top: 1480, bottom: 0, background: "#ff000055"}} />
        <div style={{position: "absolute", left: 940, right: 0, top: 800, height: 950, background: "#ff000055"}} />
        <div style={{position: "absolute", left: 140, width: 800, top: 240, height: 1160, border: "4px dashed #00ffaa"}} />
      </AbsoluteFill>}
      <Audio src={audioSrc} />
      <Audio src={staticFile(`hak/muzik/${muzikNo}.wav`)} volume={(x) => 0.1 * interpolate(x, [N - 10, N], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})} />
      {temiz.map((o, i) => <Efekt key={i} {...o} />)}
      {Array.from({length: plan.ctaKeyword.length}).map((_, i) => <Efekt key={`t${i}`} ad="tus" an={yazAn + i * 2} ses={0.35} />)}
    </AbsoluteFill>
  );
};
