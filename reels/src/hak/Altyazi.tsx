// Kelime senkronlu altyazı: ORİJİNAL TTS metni; 1–3 kelime, ≤18 harf; noktalama sayfayı bitirir; aktif kelime sarı ve büyük.
import {fitText} from "@remotion/layout-utils";
import {interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, MONT, SPRING, low, up} from "./tema";
import type {Plan, Word} from "./tipler";
import {msKare} from "./zaman";
export const sayfala = (words: Word[]) => {
  const s: Word[][] = []; let c: Word[] = [];
  const harf = (a: Word[]) => a.reduce((n, w) => n + w.text.replace(/[^\p{L}\p{N}]/gu, "").length, 0);
  for (const w of words) {
    if (c.length && (c.length === 3 || harf([...c, w]) > 18)) { s.push(c); c = []; }
    c.push(w);
    if (/[.,;!?]$/.test(w.text)) { s.push(c); c = []; }
  }
  if (c.length) s.push(c);
  return s;
};
export const Altyazi: React.FC<{words: Word[]; plan: Plan}> = ({words, plan}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const S = sayfala(words);
  const i = S.findIndex((p, j) => f >= msKare(p[0].startMs) - 2 && (j === S.length - 1 || f < msKare(S[j + 1][0].startMs) - 2));
  if (i < 0) return null;
  const p = S[i];
  const g = interpolate(f - (msKare(p[0].startMs) - 2), [0, 6], [0, 1], {extrapolateRight: "clamp"});
  const metin = up(p.map((w) => w.text).join(" "));
  const boyut = Math.max(60, Math.min(80, fitText({text: metin, withinWidth: 800, fontFamily: "Montserrat", fontWeight: 900}).fontSize));
  const renk = (w: Word) => {
    const e = plan.emphasis.find((x) => low(x.word) === low(w.text));
    return e ? (e.kind === "money" ? COLORS.green : e.kind === "danger" ? COLORS.red : COLORS.yellow) : COLORS.paper;
  };
  return (
    <div style={{position: "absolute", left: 140, width: 800, top: 1240, translate: `0 -50%`, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 22px", scale: `${0.85 + 0.15 * g}`, opacity: g > 0 ? 1 : 0}}>
      {p.map((w, k) => {
        const aktif = f >= msKare(w.startMs) - 2 && (k === p.length - 1 || f < msKare(p[k + 1].startMs) - 2);
        const a = aktif ? spring({frame: f - (msKare(w.startMs) - 2), fps, config: SPRING.POP}) : 0;
        const t = up(w.text);
        const st: React.CSSProperties = {fontFamily: MONT, fontWeight: 900, fontSize: boyut, lineHeight: 1.0, display: "inline-block"};
        return (
          <span key={k} style={{position: "relative", display: "inline-block", margin: "0 8px", scale: `${1 + 0.12 * a}`, translate: `0 ${(1 - g) * 16}px`}}>
            <span style={{...st, position: "absolute", inset: 0, color: COLORS.ink, WebkitTextStroke: `12px ${COLORS.ink}`, textShadow: "0 8px 0 rgba(0,0,0,0.35)"}}>{t}</span>
            <span style={{...st, position: "relative", color: aktif ? COLORS.yellow : renk(w)}}>{t}</span>
          </span>
        );
      })}
    </div>
  );
};
