// MARKA SİSTEMİ — renkler anlam taşır, fontlar Türkçe tam destekli
import "@fontsource/bricolage-grotesque/700.css";
import "@fontsource/bricolage-grotesque/800.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/800.css";
import "@fontsource/jetbrains-mono/800.css";
import {Easing} from "remotion";

export const R = {
  zemin: "#F4F2EC", // nötr kâğıt beyazı
  zemin2: "#E8E5DB",
  murekkep: "#0E1A3A", // ana metin / resmi
  marka: "#2F5BFF", // marka mavisi: önemli bilgi, maskot
  para: "#12A866", // para / kazanç / başarı
  risk: "#FF4A3D", // risk / uyarı / yasak
  vurgu: "#FFC53D", // dikkat / işaretleyici
  gri: "#8A8FA3",
  beyaz: "#FFFFFF",
};
export const FONT = {baslik: "'Bricolage Grotesque', sans-serif", govde: "'Inter', sans-serif", sayi: "'JetBrains Mono', monospace"};

// Güvenli alan (Reels + TikTok + Shorts kesişimi)
export const GA = {ust: 260, alt: 470, sol: 72, sag: 150, w: 1080, h: 1920};
export const GA_ICI = {x: GA.sol, y: GA.ust, w: 1080 - GA.sol - GA.sag, h: 1920 - GA.ust - GA.alt};

// Hareket eğrileri: her hareket aynı eğriyi kullanmaz
export const EGRI = {
  snap: Easing.bezier(0.2, 0.9, 0.1, 1), // hızlı otur
  yumusak: Easing.bezier(0.45, 0, 0.25, 1), // kamera
  expo: Easing.bezier(0.16, 1, 0.3, 1), // reveal
  geri: Easing.out(Easing.back(1.7)), // pop
  ivme: Easing.bezier(0.7, 0, 0.84, 0), // çıkış
};
