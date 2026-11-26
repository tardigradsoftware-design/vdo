import type {Poz, Ton} from "./tema";
export type Word = {text: string; startMs: number; endMs: number};
export type Card =
  | {type: "hook"}
  | {type: "stat"; value: number; unit?: string; label: string; color?: "green" | "red" | "yellow"}
  | {type: "deadline"; value: string; unit: string; label?: string}
  | {type: "mythFact"; wrong: string; right: string}
  | {type: "stamp"; text: string; color?: "green" | "red"}
  | {type: "law"; title: string}
  | {type: "phone"; query: string; action?: "toggle" | "button"; label?: string}
  | {type: "money"; label: string; amount?: number}
  | {type: "alert"; label: string}
  | {type: "steps"; count: number; label: string}
  | {type: "icon"; icons: string[]; label: string}
  | {type: "cta"};
export type Beat = {anchor: string; hit?: string; card: Card; pose: Poz};
export type Plan = {id: string; category: string; tone: Ton; hookTitle: string; ctaKeyword: string; beats: Beat[]; emphasis: {word: string; kind: "money" | "danger" | "number" | "key"}[]};
export type HakProps = {id: string; plan?: Plan; words?: Word[]; audioSrc?: string; showSafeZones?: boolean};
