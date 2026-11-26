import {KATEGORI, low} from "./tema";
import type {Plan, Word} from "./tipler";
import {beatZamanlari} from "./zaman";
// Render öncesi plan doğrulama (rehberdeki kurallar)
export const dogrula = (plan: Plan, words: Word[], toplam: number, tts: string) => {
  const h: string[] = [];
  const bz = beatZamanlari(plan, words, toplam);
  if (plan.beats[0].card.type !== "hook") h.push("İlk beat hook olmalı");
  if (plan.beats[plan.beats.length - 1].card.type !== "cta") h.push("Son beat cta olmalı");
  plan.beats.forEach((b, i) => {
    const sn = (bz[i].son - bz[i].bas) / 30;
    if (b.card.type !== "cta" && b.card.type !== "hook" && (sn < 1.2 || sn > 3.05)) h.push(`Beat ${i} süresi ${sn.toFixed(2)} sn (1,2–3,0)`);
    if (i > 0 && plan.beats[i - 1].card.type === b.card.type) h.push(`Beat ${i}: aynı kart tipi art arda (${b.card.type})`);
    const c = b.card as {label?: string};
    if (c.label && c.label.split(" ").length > 5) h.push(`Beat ${i}: etiket 5 kelimeden uzun`);
  });
  if (plan.beats.filter((b) => b.card.type === "stamp").length > 2) h.push("En fazla 2 stamp");
  if (plan.beats.filter((b) => b.card.type === "alert").length > 1) h.push("En fazla 1 alert");
  const hw = plan.hookTitle.split(" ").length; if (hw < 3 || hw > 6) h.push("Hook başlığı 3–6 kelime olmalı");
  const m = tts.match(/Yorumlara\s+(\S+)\s+yaz/); if (!m || m[1] !== plan.ctaKeyword) h.push(`ctaKeyword metindekiyle aynı değil (${m?.[1]})`);
  if (!KATEGORI[plan.category]) h.push(`Bilinmeyen kategori: ${plan.category}`);
  // Kartlardaki sayılar metinde geçmeli
  const metin = low(tts);
  plan.beats.forEach((b, i) => { const v = (b.card as {value?: number | string}).value; if (v !== undefined && !metin.includes(String(v))) h.push(`Beat ${i}: ${v} metinde yok`); });
  if (h.length) throw new Error("PLAN DOĞRULANAMADI:\n- " + h.join("\n- "));
  return bz;
};
