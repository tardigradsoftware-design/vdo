import {AbsoluteFill, Img, staticFile} from "remotion";
import {C, MONO, SERIF} from "../ciddi/tema";

type Aks = {ad: string; x: number; y: number; b: number; r?: number}; // merkeze göre oran, b: boyut oranı
type M = {ad: string; rol: string; taban: string; renk: string; aks: Aks[]};
const sapka = (ad: string, y = -0.42, b = 0.55, r = -8): Aks => ({ad, x: 0.02, y, b, r});
const gozluk = (y = -0.04, b = 0.5): Aks => ({ad: "glasses", x: 0, y, b});
const kravat: Aks = {ad: "necktie", x: 0, y: 0.48, b: 0.3};
const sag = (ad: string, b = 0.46, r = 12): Aks => ({ad, x: 0.4, y: 0.3, b, r});
const sol = (ad: string, b = 0.46, r = -10): Aks => ({ad, x: -0.42, y: 0.3, b, r});

export const MASKOTLAR: M[] = [
  {ad: "Baykuş Hakim", rol: "Bilge yargıç", taban: "owl", renk: C.altin, aks: [sapka("graduation_cap"), sag("balance_scale")]},
  {ad: "Aslan Avukat", rol: "Güçlü savunma", taban: "lion", renk: C.kirmizi, aks: [kravat, sag("briefcase")]},
  {ad: "Kartal Savcı", rol: "Keskin göz", taban: "eagle", renk: "#4C7DFF", aks: [{ad: "glasses", x: -0.3, y: -0.1, b: 0.24, r: -6}, sag("scroll")]},
  {ad: "Tilki Dedektif", rol: "Tuzakları bulur", taban: "fox", renk: "#FF8A3D", aks: [sapka("top_hat", -0.45, 0.48), sag("magnifying_glass_tilted_right")]},
  {ad: "Ayı Koruyucu", rol: "Hakkını korur", taban: "bear", renk: "#8E6CFF", aks: [sol("shield", 0.5)]},
  {ad: "Kurt Müfettiş", rol: "Denetler", taban: "wolf", renk: "#7A8BA0", aks: [gozluk(0.0, 0.48), sag("magnifying_glass_tilted_right")]},
  {ad: "Robot Hukukçu", rol: "Mevzuat hafızası", taban: "robot", renk: "#2EC4B6", aks: [sag("balance_scale")]},
  {ad: "Köpek Bekçi", rol: "Sadık uyarıcı", taban: "dog_face", renk: "#E9C46A", aks: [sapka("military_helmet", -0.42, 0.5, 0), sol("shield", 0.44)]},
  {ad: "Kedi Noter", rol: "Belge ustası", taban: "cat_face", renk: "#F4A261", aks: [gozluk(0.02, 0.5), sag("scroll")]},
  {ad: "Kaplan Müdafi", rol: "Sert ve net", taban: "tiger_face", renk: "#E76F51", aks: [kravat, sag("hammer", 0.44, -20)]},
  {ad: "Penguen Kâtip", rol: "Kayıt tutar", taban: "penguin", renk: "#90A4B8", aks: [kravat, sag("scroll", 0.4)]},
  {ad: "Fil Arşiv", rol: "Hiçbir şeyi unutmaz", taban: "elephant", renk: "#A0AEC0", aks: [sapka("graduation_cap", -0.42, 0.5), sag("scroll")]},
  {ad: "Kunduz Usta", rol: "Adım adım çözer", taban: "beaver", renk: "#C08552", aks: [sag("hammer", 0.44, -20)]},
  {ad: "Kaplumbağa Bilge", rol: "Sabırlı danışman", taban: "turtle", renk: "#43AA8B", aks: [{ad: "glasses", x: -0.36, y: 0.0, b: 0.16}, {ad: "graduation_cap", x: -0.36, y: -0.13, b: 0.24, r: -10}]},
  {ad: "Bizon Kalkan", rol: "Geri adım atmaz", taban: "bison", renk: "#9C6644", aks: [sol("shield", 0.5)]},
  {ad: "Goril Güvenlik", rol: "Dolandırıcıya geçit yok", taban: "gorilla", renk: "#4A5568", aks: [sapka("military_helmet", -0.42, 0.5, 0), sag("shield", 0.44)]},
  {ad: "Ejder Muhafız", rol: "Hazineni korur", taban: "dragon", renk: "#38B000", aks: [sapka("crown", -0.45, 0.4, 6), sol("shield", 0.44)]},
  {ad: "Rakun Denetçi", rol: "Faturayı inceler", taban: "raccoon", renk: "#6C757D", aks: [sag("magnifying_glass_tilted_right"), sol("briefcase", 0.4)]},
  {ad: "Kirpi Uyarı", rol: "Dikkat, risk var", taban: "hedgehog", renk: "#D62828", aks: [{ad: "glasses", x: -0.27, y: 0.02, b: 0.26, r: -4}, sag("shield", 0.42)]},
  {ad: "Hakim Bey", rol: "İnsan anlatıcı", taban: "judge", renk: C.altin, aks: [sag("balance_scale", 0.42)]},
];

export const MaskotKart: React.FC<{m: M; boyut?: number; no?: number; sade?: boolean}> = ({m, boyut = 380, no, sade}) => (
  <div style={{width: 500, height: sade ? 500 : 620, background: sade ? "transparent" : C.panel, border: sade ? "none" : `2px solid ${C.cizgi}`, borderRadius: 32, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center"}}>
    {!sade && <div style={{position: "absolute", top: 40, width: 420, height: 420, borderRadius: "50%", background: `radial-gradient(circle, ${m.renk}55 0%, ${m.renk}00 70%)`}} />}
    {no !== undefined && <div style={{position: "absolute", top: 22, left: 26, fontFamily: MONO, fontWeight: 700, fontSize: 28, color: C.soluk}}>{String(no).padStart(2, "0")}</div>}
    <div style={{position: "relative", width: boyut, height: boyut, marginTop: 50}}>
      <Img src={staticFile(`ikon/${m.taban}.png`)} style={{width: boyut, height: boyut, objectFit: "contain", filter: "drop-shadow(0 24px 30px rgba(0,0,0,0.5))"}} />
      {m.aks.map((a, i) => (
        <Img key={i} src={staticFile(`ikon/${a.ad}.png`)} style={{position: "absolute", width: boyut * a.b, height: boyut * a.b, left: boyut / 2 + a.x * boyut - (boyut * a.b) / 2, top: boyut / 2 + a.y * boyut - (boyut * a.b) / 2, transform: `rotate(${a.r ?? 0}deg)`, objectFit: "contain", filter: "drop-shadow(0 10px 12px rgba(0,0,0,0.45))"}} />
      ))}
    </div>
    {!sade && <div style={{fontFamily: SERIF, fontWeight: 900, fontSize: 46, color: C.yazi, marginTop: 34}}>{m.ad}</div>}
    {!sade && <div style={{fontFamily: MONO, fontWeight: 500, fontSize: 26, color: m.renk, marginTop: 6, letterSpacing: 2}}>{m.rol.toLocaleUpperCase("tr")}</div>}
  </div>
);

export const Maskotlar: React.FC = () => (
  <AbsoluteFill style={{background: C.zemin, padding: 60, display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 30, alignContent: "flex-start"}}>
    {MASKOTLAR.map((m, i) => <MaskotKart key={i} m={m} no={i + 1} />)}
  </AbsoluteFill>
);
