// ZAMANLAMA SİSTEMİ — gerçek kelime zamanları (Whisper) → kare
import {interpolate} from "remotion";
import {EGRI} from "./marka";
export type Kelime = {kelime: string; baslangic: number; bitis: number};
export const FPS = 30;
export const kare = (sn: number) => Math.round(sn * FPS);
export const zamanlayici = (K: Kelime[]) => {
  const t = (k: string, sira = 0) => {
    const b = K.filter((w) => w.kelime.replace(/[.,!?]/g, "").toLocaleLowerCase("tr") === k.toLocaleLowerCase("tr"))[sira];
    if (!b) throw new Error(`Kelime yok: ${k}#${sira}`);
    return kare(b.baslangic);
  };
  return t;
};
// 0→1 ilerleme yardımcı
export const ilerle = (f: number, a: number, sure: number, egri = EGRI.expo) =>
  interpolate(f, [a, a + sure], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: egri});
