import {low} from "./tema";
import type {Plan, Word} from "./tipler";
export const FPS = 30;
export const msKare = (ms: number) => Math.round((ms / 1000) * FPS);
// Beat zamanları: anchor bir önceki beat'ten sonraki ilk eşleşme; hit anchor'dan sonraki ilk eşleşme. Görsel vuruş kelimeden 2 kare önce.
export type BeatZaman = {bas: number; son: number; hit: number; i: number};
export const beatZamanlari = (plan: Plan, words: Word[], toplam: number): BeatZaman[] => {
  let imlec = 0;
  const bul = (k: string, from: number) => {
    const i = words.findIndex((w, j) => j >= from && low(w.text) === low(k));
    if (i < 0) throw new Error(`Plan hatası: "${k}" kelimesi metinde bulunamadı`);
    return i;
  };
  const r = plan.beats.map((b, i) => {
    const ai = i === 0 ? 0 : bul(b.anchor, imlec); imlec = ai + 1;
    const hi = b.hit ? bul(b.hit, ai) : ai;
    return {bas: i === 0 ? 0 : Math.max(0, msKare(words[ai].startMs) - 2), hit: Math.max(0, msKare(words[hi].startMs) - 2), son: 0, i};
  });
  r.forEach((b, i) => (b.son = i + 1 < r.length ? r[i + 1].bas : toplam));
  return r;
};
export const kelimeKaresi = (words: Word[], k: string, from = 0) => {
  const i = words.findIndex((w, j) => j >= from && low(w.text) === low(k));
  return i < 0 ? -1 : msKare(words[i].startMs) - 2;
};
