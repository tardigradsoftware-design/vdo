// GÖRSEL METAFOR KÜTÜPHANESİ — SVG vektör nesneler (konum: sahne koordinatı, merkezli)
import {useCurrentFrame} from "remotion";
import {FONT, R} from "./marka";

type T = {x: number; y: number; s?: number; r?: number; o?: number; children?: React.ReactNode};
export const G: React.FC<T> = ({x, y, s = 1, r = 0, o = 1, children}) => <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} opacity={o}>{children}</g>;
export const Sahne: React.FC<{children: React.ReactNode}> = ({children}) => <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: "absolute", inset: 0, overflow: "visible"}}>{children}</svg>;
const golge = (w: number, y: number) => <ellipse cx={0} cy={y} rx={w} ry={w * 0.12} fill="#000" opacity={0.08} />;

// Telefon (ekran içeriği slotu 520x1000 koordinatında)
export const Telefon: React.FC<T> = ({children, ...p}) => (
  <G {...p}>
    {golge(260, 560)}
    <rect x={-290} y={-560} width={580} height={1120} rx={78} fill={R.murekkep} />
    <rect x={-262} y={-530} width={524} height={1060} rx={56} fill={R.beyaz} />
    <rect x={-60} y={-516} width={120} height={26} rx={13} fill={R.murekkep} />
    <g transform="translate(-262 -530)">{children}</g>
  </G>
);
// Resmi bina (genel, kurumsal; logo yok)
export const Bina: React.FC<T> = (p) => (
  <G {...p}>
    {golge(240, 6)}
    <path d="M-250 -280 L0 -380 L250 -280 Z" fill={R.murekkep} />
    <rect x={-240} y={-280} width={480} height={26} fill={R.murekkep} />
    {[-180, -90, 0, 90, 180].map((cx) => <rect key={cx} x={cx - 24} y={-246} width={48} height={210} rx={8} fill={R.zemin2} stroke={R.murekkep} strokeWidth={6} />)}
    <rect x={-270} y={-34} width={540} height={34} rx={6} fill={R.murekkep} />
  </G>
);
// Banknot
export const Banknot: React.FC<T> = (p) => (
  <G {...p}>
    <rect x={-110} y={-58} width={220} height={116} rx={14} fill={R.para} />
    <rect x={-96} y={-44} width={192} height={88} rx={8} fill="none" stroke="#ffffff88" strokeWidth={4} />
    <circle r={28} fill="#ffffff33" />
    <text y={13} textAnchor="middle" fontFamily={FONT.baslik} fontWeight={800} fontSize={40} fill="#fff">₺</text>
  </G>
);
export const Jeton: React.FC<T> = (p) => (
  <G {...p}><circle r={46} fill="#E6A817" /><circle r={36} fill={R.vurgu} /><text y={14} textAnchor="middle" fontFamily={FONT.baslik} fontWeight={800} fontSize={40} fill="#B8860B">₺</text></G>
);
// Cüzdan (boşsa noktalı kontur: "bekleyen")
export const Cuzdan: React.FC<T & {bos?: boolean}> = ({bos, ...p}) => (
  <G {...p}>
    {golge(170, 130)}
    <rect x={-170} y={-110} width={340} height={230} rx={34} fill={bos ? "none" : R.murekkep} stroke={R.murekkep} strokeWidth={8} strokeDasharray={bos ? "22 16" : undefined} />
    <rect x={60} y={-30} width={130} height={80} rx={22} fill={bos ? R.zemin : R.marka} stroke={R.murekkep} strokeWidth={8} />
    <circle cx={110} cy={10} r={12} fill={R.murekkep} />
  </G>
);
export const KumSaati: React.FC<T & {p: number}> = ({p: dol, ...p}) => (
  <G {...p}>
    <rect x={-70} y={-110} width={140} height={18} rx={9} fill={R.murekkep} />
    <rect x={-70} y={92} width={140} height={18} rx={9} fill={R.murekkep} />
    <path d="M-52 -92 L52 -92 L8 0 L52 92 L-52 92 L-8 0 Z" fill={R.beyaz} stroke={R.murekkep} strokeWidth={7} />
    <path d={`M${-40 * (1 - dol)} ${-80 + 70 * dol} L${40 * (1 - dol)} ${-80 + 70 * dol} L0 -6 Z`} fill={R.vurgu} />
    <path d={`M-44 88 L44 88 L${24 * (1 - dol) + 4} ${88 - 60 * dol} L${-24 * (1 - dol) - 4} ${88 - 60 * dol} Z`} fill={R.vurgu} />
  </G>
);
// Bilgi kartı (ikon + başlık)
export const BilgiKarti: React.FC<T & {baslik: string; ikon: React.ReactNode; renk?: string; w?: number}> = ({baslik, ikon, renk = R.marka, w = 760, ...p}) => (
  <G {...p}>
    <rect x={-w / 2 + 10} y={-70} width={w} height={150} rx={34} fill="#000" opacity={0.08} />
    <rect x={-w / 2} y={-80} width={w} height={150} rx={34} fill={R.beyaz} />
    <rect x={-w / 2 + 22} y={-58} width={106} height={106} rx={26} fill={renk} />
    <g transform={`translate(${-w / 2 + 75} -5)`}>{ikon}</g>
    <text x={-w / 2 + 158} y={10} fontFamily={FONT.baslik} fontWeight={800} fontSize={50} fill={R.murekkep}>{baslik}</text>
  </G>
);
// İkonlar (beyaz, kart içi)
export const Ikon = {
  arti: <path d="M-12 -32 h24 v20 h20 v24 h-20 v20 h-24 v-20 h-20 v-24 h20 Z" fill="#fff" />,
  kalkan: <path d="M0 -34 C 20 -34 32 -28 34 -24 C 34 6 22 26 0 36 C -22 26 -34 6 -34 -24 C -32 -28 -20 -34 0 -34 Z" fill="#fff" />,
  yuzde: <g stroke="#fff" strokeWidth={8} strokeLinecap="round" fill="none"><path d="M-24 26 L24 -26" /><circle cx={-18} cy={-18} r={9} /><circle cx={18} cy={18} r={9} /></g>,
  takvim: <g fill="#fff"><rect x={-30} y={-24} width={60} height={54} rx={8} /><rect x={-20} y={-34} width={8} height={18} rx={4} /><rect x={12} y={-34} width={8} height={18} rx={4} /></g>,
};
// Takvim sayfası (yaprak kopar)
export const Takvim: React.FC<T & {gun: string}> = ({gun, ...p}) => (
  <G {...p}>
    <rect x={-150} y={-160} width={300} height={320} rx={30} fill={R.beyaz} stroke={R.murekkep} strokeWidth={8} />
    <rect x={-150} y={-160} width={300} height={80} rx={30} fill={R.risk} />
    <rect x={-150} y={-110} width={300} height={30} fill={R.risk} />
    <text y={70} textAnchor="middle" fontFamily={FONT.sayi} fontWeight={800} fontSize={130} fill={R.murekkep}>{gun}</text>
  </G>
);
// Bariyer (yasak/engel)
export const Bariyer: React.FC<T & {p: number}> = ({p: ac, ...p}) => (
  <G {...p}>
    <rect x={-24} y={-40} width={48} height={200} rx={10} fill={R.murekkep} />
    <g transform={`rotate(${-80 * (1 - ac)} 0 -20)`}>
      <rect x={0} y={-44} width={420} height={48} rx={14} fill={R.beyaz} stroke={R.murekkep} strokeWidth={7} />
      {[0, 1, 2, 3].map((i) => <rect key={i} x={30 + i * 100} y={-41} width={50} height={42} fill={R.risk} />)}
    </g>
  </G>
);
// Yorum kutusu (CTA)
export const YorumKutusu: React.FC<T & {yazi: string; imlec: boolean; bas?: number}> = ({yazi, imlec, bas = 1, ...p}) => (
  <G {...p}>
    <rect x={-400} y={-90} width={800} height={180} rx={90} fill={R.beyaz} stroke={R.murekkep} strokeWidth={8} />
    <circle cx={-310} cy={0} r={50} fill={R.zemin2} />
    <text x={-230} y={30} fontFamily={FONT.baslik} fontWeight={800} fontSize={86} fill={R.murekkep}>{yazi}{imlec ? "|" : ""}</text>
    <g transform={`translate(320 0) scale(${bas})`}><circle r={62} fill={R.marka} /><path d="M-20 -24 L28 0 L-20 24 L-12 0 Z" fill="#fff" /></g>
  </G>
);
// Rehber belgesi
export const Rehber: React.FC<T> = (p) => (
  <G {...p}>
    <rect x={-110} y={-140} width={220} height={280} rx={20} fill={R.beyaz} stroke={R.murekkep} strokeWidth={7} />
    <rect x={-80} y={-110} width={110} height={18} rx={9} fill={R.marka} />
    {[0, 1, 2, 3].map((i) => <rect key={i} x={-80} y={-70 + i * 36} width={i % 2 ? 120 : 160} height={12} rx={6} fill={R.zemin2} />)}
    <circle cx={60} cy={95} r={26} fill={R.para} /><path d="M48 95 L58 105 L74 85" stroke="#fff" strokeWidth={7} fill="none" strokeLinecap="round" />
  </G>
);
// Zemin dekoru: ızgara noktalar + büyük yumuşak şekiller (derinlik için)
export const Zemin: React.FC<{renk?: string; ton?: string}> = ({renk = R.zemin, ton = R.zemin2}) => {
  const f = useCurrentFrame();
  return (
    <svg width={1080} height={1920} style={{position: "absolute", inset: 0}}>
      <rect width={1080} height={1920} fill={renk} />
      <defs><pattern id="izg" width={54} height={54} patternUnits="userSpaceOnUse"><circle cx={2} cy={2} r={2.4} fill={ton} /></pattern></defs>
      <rect width={1080} height={1920} fill="url(#izg)" transform={`translate(${(f * 0.4) % 54} 0)`} />
    </svg>
  );
};
