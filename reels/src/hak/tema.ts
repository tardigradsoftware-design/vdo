import "@fontsource/anton/400.css";
import "@fontsource/montserrat/800.css";
import "@fontsource/montserrat/900.css";
import {Bank, Briefcase, Car, CreditCard, FirstAid, House, Airplane, Scales, ShieldWarning, ShoppingCart, UsersThree, type Icon} from "@phosphor-icons/react";

export const COLORS = {
  bg: "#0B1022", bg2: "#141B3A", ink: "#0B1022", paper: "#FFFFFF", paperSoft: "#EEF1FA",
  yellow: "#FFD60A", green: "#22E28A", red: "#FF3B5C", blue: "#4DA3FF",
  orange: "#FF8A1F", orange2: "#E86A00", // yalnızca maskot
};
export const SPRING = {
  POP: {damping: 12, stiffness: 220, mass: 0.6},
  SLAM: {damping: 9, stiffness: 320, mass: 0.5},
  SNAP: {damping: 200},
  SOFT: {damping: 18, stiffness: 120},
};
export const ANTON = "'Anton', sans-serif";
export const MONT = "'Montserrat', sans-serif";
export const up = (s: string) => s.toLocaleUpperCase("tr-TR");
export const low = (s: string) => s.toLocaleLowerCase("tr-TR").replace(/[.,!?;:"“”]/g, "");
export const CARD_SHADOW = "0 14px 0 rgba(0,0,0,0.35)";

export const KATEGORI: Record<string, Icon> = {
  "TÜKETİCİ HAKKI": ShoppingCart, "KİRACI HAKKI": House, "İŞÇİ HAKKI": Briefcase, "PARA VE BANKA": CreditCard,
  "DOLANDIRICILIK UYARISI": ShieldWarning, "SAĞLIK HAKKI": FirstAid, "HUKUK VE İCRA": Scales, "TRAFİK VE ARAÇ": Car,
  "SEYAHAT": Airplane, "DEVLET DESTEĞİ": Bank, "AİLE VE EĞİTİM": UsersThree,
};
export type Ton = "firsat" | "uyari" | "hak";
export const TON: Record<Ton, {parilti: string; hookPoz: Poz; acilis: string}> = {
  firsat: {parilti: COLORS.green, hookPoz: "saskin", acilis: "acilis_para"},
  uyari: {parilti: COLORS.red, hookPoz: "endiseli", acilis: "acilis_alarm"},
  hak: {parilti: COLORS.yellow, hookPoz: "itiraz", acilis: "acilis_tokmak"},
};
export type Poz = "saskin" | "endiseli" | "itiraz" | "isaret" | "ciddi" | "mutlu" | "yorum" | "kutlama";
