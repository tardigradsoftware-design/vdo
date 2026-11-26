import "@fontsource/unbounded/900.css";
import "@fontsource/unbounded/700.css";
import "@fontsource/jetbrains-mono/700.css";

export const R = {
  zemin: "#FFFFFF",
  siyah: "#0E0E10",
  turuncu: "#FF4D2E",
  sari: "#FCC033",
  gri: "#8B8E95",
};
export const FONT = "'Unbounded', sans-serif";
export const MONO = "'JetBrains Mono', monospace";
export const FPS = 30;
export const W = 1080;
export const H = 1920;

export type Kelime = {kelime: string; baslangic: number; bitis: number};
export const kare = (sn: number) => Math.round(sn * FPS);
