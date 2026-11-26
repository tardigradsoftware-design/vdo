// Sahne kartları kütüphanesi (12 tip). Kart bölgesi: x 140–940, y 420–820. Asıl hareket `hit` karesine kilitli.
import {fitText} from "@remotion/layout-utils";
import {Bank, Car, Check, Coins, CreditCard, DeviceMobile, EyeSlash, FileText, FirstAid, Gavel, House, type Icon, MagnifyingGlass, PiggyBank, Shield, Timer, Wallet, Warning, X} from "@phosphor-icons/react";
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {ANTON, CARD_SHADOW, COLORS, MONT, SPRING, up} from "./tema";
import type {Card} from "./tipler";

export const IKON: Record<string, Icon> = {FirstAid, PiggyBank, EyeSlash, Wallet, Warning, FileText, Shield, Bank, Coins, DeviceMobile, Gavel, House, Car, CreditCard, Timer, MagnifyingGlass};
const renk = (c?: string) => (c === "green" ? COLORS.green : c === "red" ? COLORS.red : COLORS.yellow);
const Kutu: React.FC<{children: React.ReactNode; h?: number; style?: React.CSSProperties}> = ({children, h = 320, style}) => (
  <div style={{width: 800, height: h, background: COLORS.paper, borderRadius: 40, border: `6px solid ${COLORS.ink}`, boxShadow: CARD_SHADOW, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, padding: 30, boxSizing: "border-box", position: "relative", overflow: "hidden", ...style}}>{children}</div>
);
const Etiket: React.FC<{t: string; c?: string}> = ({t, c = COLORS.ink}) => {
  const s = Math.min(48, fitText({text: up(t), withinWidth: 700, fontFamily: "Montserrat", fontWeight: 800}).fontSize);
  return <div style={{fontFamily: MONT, fontWeight: 800, fontSize: Math.max(40, s), color: c, textAlign: "center", lineHeight: 1.1}}>{up(t)}</div>;
};
const p = (f: number, a: number, d: number, e = Easing.out(Easing.cubic)) => interpolate(f, [a, a + d], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e});

export const KartIcerik: React.FC<{card: Card; hit: number}> = ({card, hit}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = (a: number) => spring({frame: f - a, fps, config: SPRING.POP});
  const slam = (a: number) => spring({frame: f - a, fps, config: SPRING.SLAM});
  switch (card.type) {
    case "icon":
      return (
        <Kutu>
          <div style={{display: "flex", gap: 40}}>{card.icons.map((n, i) => { const I = IKON[n] ?? FileText; return <div key={i} style={{scale: `${pop(i * 3)}`}}><I size={140} weight="fill" color={COLORS.ink} /></div>; })}</div>
          <Etiket t={card.label} />
        </Kutu>
      );
    case "money": {
      const coins = [0, 1, 2, 3, 4].map((i) => {
        const q = p(f, hit + i * 3, 12, Easing.inOut(Easing.cubic));
        return <div key={i} style={{position: "absolute", left: 120 + q * 360, top: 150 - Math.sin(q * Math.PI) * 120, width: 70, height: 70, borderRadius: 35, background: COLORS.yellow, border: `5px solid ${COLORS.ink}`, fontFamily: ANTON, fontSize: 40, color: COLORS.ink, display: "flex", alignItems: "center", justifyContent: "center", opacity: f >= hit + i * 3 && q < 1 ? 1 : 0}}>₺</div>;
      });
      const dol = p(f, hit + 12, 8);
      return (
        <Kutu>
          {coins}
          <div style={{scale: `${1 + 0.08 * Math.sin(dol * Math.PI)}`}}><Wallet size={150} weight="fill" color={COLORS.green} /></div>
          {card.amount !== undefined && <div style={{fontFamily: ANTON, fontSize: 80, color: COLORS.green}}>{new Intl.NumberFormat("tr-TR").format(card.amount)} ₺</div>}
          <Etiket t={card.label} />
        </Kutu>
      );
    }
    case "alert":
      return (
        <Kutu>
          <div style={{scale: `${1 + 0.07 * Math.max(0, Math.sin((f - hit) / 3))}`}}><Warning size={160} weight="fill" color={COLORS.red} /></div>
          <Etiket t={card.label} c={COLORS.red} />
        </Kutu>
      );
    case "stamp": {
      const s = f < hit ? 0 : interpolate(f - hit, [0, 5], [2.2, 1], {extrapolateRight: "clamp", easing: Easing.in(Easing.quad)});
      const c = renk(card.color);
      const fs = Math.min(150, fitText({text: up(card.text), withinWidth: 560, fontFamily: "Anton", fontWeight: 400}).fontSize);
      return (
        <Kutu>
          <div style={{rotate: "-8deg", scale: `${s}`, opacity: f < hit ? 0 : 1, border: `10px solid ${c}`, outline: `4px solid ${c}`, outlineOffset: 8, borderRadius: 18, padding: "8px 34px", fontFamily: ANTON, fontSize: fs, color: c, lineHeight: 1.05, textAlign: "center"}}>{up(card.text)}</div>
        </Kutu>
      );
    }
    case "stat": {
      const c = renk(card.color);
      const v = card.value === 0 ? 0 : Math.round(interpolate(f, [hit, hit + 16], [0, card.value], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)}));
      const s = card.value === 0 ? slam(hit) : 1;
      return <Kutu><div style={{fontFamily: ANTON, fontSize: 260, color: c, lineHeight: 0.9, scale: `${s}`, WebkitTextStroke: `6px ${COLORS.ink}`}}>{new Intl.NumberFormat("tr-TR").format(v)}</div>{card.unit && <Etiket t={card.unit} />}<Etiket t={card.label} /></Kutu>;
    }
    case "deadline": {
      const q = p(f, hit, 24, Easing.linear);
      return (
        <Kutu>
          <div style={{position: "relative", width: 250, height: 250}}>
            <svg width={250} height={250}><circle cx={125} cy={125} r={105} stroke={COLORS.paperSoft} strokeWidth={22} fill="none" /><circle cx={125} cy={125} r={105} stroke={COLORS.red} strokeWidth={22} fill="none" strokeDasharray={660} strokeDashoffset={660 * q} transform="rotate(-90 125 125)" strokeLinecap="round" /></svg>
            <div style={{position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: ANTON, color: COLORS.red, lineHeight: 0.95}}><span style={{fontSize: 110}}>{card.value}</span><span style={{fontSize: 44}}>{up(card.unit)}</span></div>
          </div>
          {card.label && <Etiket t={card.label} />}
        </Kutu>
      );
    }
    case "mythFact": {
      const cz = p(f, hit - 10, 8), tk = pop(hit);
      return (
        <Kutu>
          <div style={{position: "relative", fontFamily: MONT, fontWeight: 800, fontSize: 44, color: COLORS.red, textAlign: "center"}}>
            “{up(card.wrong)}”<div style={{position: "absolute", left: -10, right: -10, top: "50%", height: 8, background: COLORS.red, transformOrigin: "left", scale: `${cz} 1`}} />
          </div>
          <X size={70} weight="bold" color={COLORS.red} style={{opacity: cz}} />
          <div style={{display: "flex", alignItems: "center", gap: 16, scale: `${tk}`}}><Check size={70} weight="bold" color={COLORS.green} /><span style={{fontFamily: MONT, fontWeight: 800, fontSize: 46, color: COLORS.ink}}>{up(card.right)}</span></div>
        </Kutu>
      );
    }
    case "law": {
      const q = p(f, hit, 10);
      return (
        <Kutu>
          <FileText size={140} weight="fill" color={COLORS.blue} />
          <div style={{position: "relative", fontFamily: MONT, fontWeight: 800, fontSize: 52, color: COLORS.ink}}>
            <div style={{position: "absolute", left: -8, right: -8, bottom: 2, height: 26, background: COLORS.yellow, transformOrigin: "left", scale: `${q} 1`}} />
            <span style={{position: "relative"}}>{up(card.title)}</span>
          </div>
        </Kutu>
      );
    }
    case "phone": {
      const n = Math.max(0, Math.min(card.query.length, Math.floor(f / 2)));
      const ac = p(f, hit, 6);
      return (
        <Kutu>
          <div style={{width: 300, height: 290, borderRadius: 40, border: `6px solid ${COLORS.ink}`, background: COLORS.paperSoft, padding: 22, boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 18}}>
            <div style={{display: "flex", alignItems: "center", gap: 8, background: "#fff", border: `4px solid ${COLORS.ink}`, borderRadius: 999, padding: "8px 14px", fontFamily: MONT, fontWeight: 800, fontSize: 26}}><MagnifyingGlass size={28} weight="bold" />{card.query.slice(0, n)}</div>
            <div style={{width: 120, height: 64, borderRadius: 32, background: ac > 0.5 ? COLORS.green : "#C8CEE0", border: `4px solid ${COLORS.ink}`, position: "relative", alignSelf: "center"}}><div style={{position: "absolute", top: 6, left: 6 + ac * 56, width: 44, height: 44, borderRadius: 22, background: "#fff", border: `4px solid ${COLORS.ink}`}} /></div>
          </div>
          {card.label && <Etiket t={card.label} />}
        </Kutu>
      );
    }
    case "steps":
      return (
        <Kutu>
          <div style={{display: "flex", alignItems: "center", gap: 30}}>
            <span style={{fontFamily: ANTON, fontSize: 200, color: COLORS.yellow, WebkitTextStroke: `6px ${COLORS.ink}`, lineHeight: 0.9}}>{card.count}</span>
            <div style={{display: "grid", gridTemplateColumns: "repeat(3, 70px)", gap: 14}}>{Array.from({length: card.count}).map((_, i) => <div key={i} style={{width: 70, height: 70, borderRadius: 16, border: `5px solid ${COLORS.ink}`, background: f >= hit + i * 6 ? COLORS.green : "#fff", display: "flex", alignItems: "center", justifyContent: "center"}}>{f >= hit + i * 6 && <Check size={44} weight="bold" color={COLORS.ink} />}</div>)}</div>
          </div>
          <Etiket t={card.label} />
        </Kutu>
      );
    default:
      return null;
  }
};

// Hook konuşma balonu (sağ üst, kuyruk maskota)
export const HookBalon: React.FC<{baslik: string; kapanis: number}> = ({baslik, kapanis}) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [kapanis, kapanis + 6], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  if (k <= 0) return null;
  const metin = up(baslik);
  const kelimeler = metin.split(" ");
  // en fazla 3 satıra dengeli böl
  const satirSay = Math.min(3, Math.max(2, Math.ceil(metin.length / 12)));
  const satirlar: string[] = []; const per = Math.ceil(kelimeler.length / satirSay);
  for (let i = 0; i < kelimeler.length; i += per) satirlar.push(kelimeler.slice(i, i + per).join(" "));
  const fs = Math.max(80, Math.min(112, ...satirlar.map((s) => fitText({text: s, withinWidth: 420, fontFamily: "Anton", fontWeight: 400}).fontSize)));
  return (
    <div style={{position: "absolute", left: 480, top: 430, width: 460, scale: `${k}`, transformOrigin: "10% 100%"}}>
      <div style={{background: COLORS.paper, border: `6px solid ${COLORS.ink}`, borderRadius: 40, boxShadow: CARD_SHADOW, padding: "26px 16px", textAlign: "center"}}>
        {satirlar.map((s, i) => <div key={i} style={{fontFamily: ANTON, fontSize: fs, lineHeight: 1.05, color: i === satirlar.length - 1 ? "#E0A800" : COLORS.ink}}>{s}</div>)}
      </div>
      <svg width={120} height={90} style={{position: "absolute", left: 30, bottom: -82}}><path d="M10 0 L80 0 L0 86 Z" fill={COLORS.paper} stroke={COLORS.ink} strokeWidth={6} strokeLinejoin="round" /><rect x={14} y={-8} width={62} height={12} fill={COLORS.paper} /></svg>
    </div>
  );
};

// CTA: jenerik yorum kutusu + dev anahtar kelime + gönder
export const CTA: React.FC<{kelime: string; yaz: number; gonder: number}> = ({kelime, yaz, gonder}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const g = spring({frame: f, fps, config: SPRING.POP});
  const n = Math.max(0, Math.min(kelime.length, Math.floor((f - yaz) / 2) + 1));
  const yazili = f >= yaz ? kelime.slice(0, n) : "";
  const fs = Math.min(240, fitText({text: kelime, withinWidth: 800, fontFamily: "Anton", fontWeight: 400}).fontSize);
  const nabiz = 1 + 0.025 * (1 + Math.sin(((f - yaz) / fps) * Math.PI * 4));
  const ucak = interpolate(f, [gonder, gonder + 14], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad)});
  const dokun = f >= gonder && f < gonder + 5 ? 0.88 : 1;
  return (
    <>
      <div style={{position: "absolute", left: 140, width: 800, top: 430, display: "flex", justifyContent: "center", opacity: f >= yaz ? 1 : 0, scale: `${(f >= yaz ? spring({frame: f - yaz, fps, config: SPRING.SLAM}) : 0) * nabiz}`}}>
        <span style={{fontFamily: ANTON, fontSize: fs, color: COLORS.yellow, WebkitTextStroke: `10px ${COLORS.ink}`, paintOrder: "stroke fill", lineHeight: 1}}>{kelime}</span>
      </div>
      <div style={{position: "absolute", left: 340, width: 600, top: 760, translate: `0 ${(1 - g) * 300}px`, opacity: g}}>
        <div style={{display: "flex", alignItems: "center", gap: 18, background: COLORS.paper, border: `6px solid ${COLORS.ink}`, borderRadius: 999, boxShadow: CARD_SHADOW, padding: "16px 18px"}}>
          <div style={{width: 76, height: 76, borderRadius: 38, background: COLORS.orange, border: `5px solid ${COLORS.ink}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 10}}>{[0, 1].map((i) => <div key={i} style={{width: 14, height: 18, borderRadius: 8, background: COLORS.ink}} />)}</div>
          <div style={{flex: 1, fontFamily: MONT, fontWeight: 800, fontSize: 44, color: yazili ? COLORS.ink : "#8A90A6"}}>{yazili || "Yorum ekle…"}{yazili && n < kelime.length ? "|" : ""}</div>
          <div style={{width: 84, height: 84, borderRadius: 42, background: COLORS.yellow, border: `5px solid ${COLORS.ink}`, display: "flex", alignItems: "center", justifyContent: "center", scale: `${dokun}`}}>
            <svg width={40} height={40} viewBox="0 0 40 40"><path d="M4 20 L36 4 L26 36 L19 23 Z" fill={COLORS.ink} /></svg>
          </div>
        </div>
      </div>
      {ucak > 0 && ucak < 1 && <svg width={1080} height={1920} style={{position: "absolute", inset: 0}}><g transform={`translate(${880 + ucak * 60} ${800 - ucak * 380}) rotate(-20) scale(${1 - ucak * 0.4})`}><path d="M0 0 L50 -22 L36 22 L24 8 Z" fill={COLORS.paper} stroke={COLORS.ink} strokeWidth={4} /></g></svg>}
    </>
  );
};
