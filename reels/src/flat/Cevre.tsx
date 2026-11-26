import {interpolate, useCurrentFrame} from "remotion";
import {F} from "./tema";

type G = {x: number; y: number; s?: number; r?: number; children?: React.ReactNode};
export const Grup: React.FC<G & {o?: number}> = ({x, y, s = 1, r = 0, o = 1, children}) => <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} opacity={o}>{children}</g>;

// Yumuşak dalgalı organik zemin şekli (yavaş nefes alır)
export const Leke: React.FC<{x: number; y: number; w: number; h: number; renk: string; faz?: number}> = ({x, y, w, h, renk, faz = 0}) => {
  const f = useCurrentFrame();
  const k = (i: number) => 1 + Math.sin(f / 40 + i * 1.7 + faz) * 0.04;
  const p = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
    const a = (i / 8) * Math.PI * 2;
    return [x + Math.cos(a) * w / 2 * k(i), y + Math.sin(a) * h / 2 * k(i + 3)];
  });
  let d = `M${(p[0][0] + p[1][0]) / 2},${(p[0][1] + p[1][1]) / 2}`;
  for (let i = 1; i <= 8; i++) { const a = p[i % 8], b = p[(i + 1) % 8]; d += ` Q${a[0]},${a[1]} ${(a[0] + b[0]) / 2},${(a[1] + b[1]) / 2}`; }
  return <path d={d} fill={renk} />;
};

export const Dalga: React.FC<{y: number; renk: string; genlik?: number; faz?: number}> = ({y, renk, genlik = 30, faz = 0}) => {
  const f = useCurrentFrame();
  let d = `M0 ${y}`;
  for (let x = 0; x <= 1080; x += 40) d += ` L${x} ${y + Math.sin(x / 160 + f / 45 + faz) * genlik}`;
  d += " L1080 1920 L0 1920 Z";
  return <path d={d} fill={renk} />;
};

// Saksı bitkisi: yapraklar hafifçe sallanır
export const Bitki: React.FC<G & {buyuk?: boolean}> = ({x, y, s = 1, buyuk}) => {
  const f = useCurrentFrame();
  const yaprak = (a: number, l: number, renk: string, i: number) => (
    <g transform={`rotate(${a + Math.sin(f / 30 + i) * 3} 0 -60)`}>
      <ellipse cx={0} cy={-60 - l / 2} rx={l * 0.22} ry={l / 2} fill={renk} />
    </g>
  );
  return (
    <Grup x={x} y={y} s={s}>
      {[-50, -25, 0, 22, 48, -70, 70].slice(0, buyuk ? 7 : 5).map((a, i) => yaprak(a, buyuk ? 200 : 140, i % 2 ? F.yaprak : F.yaprak2, i))}
      <path d="M-55 -70 L55 -70 L42 0 L-42 0 Z" fill={F.mavi} />
      <rect x={-62} y={-82} width={124} height={18} rx={9} fill={F.lacivert} />
    </Grup>
  );
};

export const Masa: React.FC<G & {w?: number}> = ({x, y, s = 1, w = 620}) => (
  <Grup x={x} y={y} s={s}>
    <rect x={-w / 2} y={0} width={w} height={26} rx={13} fill={F.lacivert} />
    <rect x={-w / 2 + 30} y={26} width={22} height={300} rx={8} fill={F.mor} />
    <rect x={w / 2 - 52} y={26} width={22} height={300} rx={8} fill={F.mor} />
    <rect x={-w / 2 + 20} y={26} width={w - 40} height={90} rx={10} fill={F.gri} />
  </Grup>
);

export const Sandalye: React.FC<G> = ({x, y, s = 1}) => (
  <Grup x={x} y={y} s={s}>
    <rect x={-120} y={-260} width={46} height={300} rx={20} fill={F.lacivert} />
    <rect x={-120} y={10} width={250} height={40} rx={18} fill={F.lacivert} />
    <rect x={-100} y={50} width={18} height={150} rx={8} fill={F.mor} />
    <rect x={100} y={50} width={18} height={150} rx={8} fill={F.mor} />
  </Grup>
);

export const Banka: React.FC<G> = ({x, y, s = 1}) => (
  <Grup x={x} y={y} s={s}>
    <path d="M-260 -300 L0 -420 L260 -300 Z" fill={F.gri} />
    <rect x={-250} y={-300} width={500} height={30} fill={F.lacivert} opacity={0.5} />
    {[-190, -95, 0, 95, 190].map((cx) => <rect key={cx} x={cx - 26} y={-260} width={52} height={250} rx={10} fill={F.beyaz} />)}
    <rect x={-280} y={-10} width={560} height={34} rx={8} fill={F.gri} />
    <circle cx={0} cy={-350} r={26} fill={F.mavi} />
  </Grup>
);

export const Pencere: React.FC<G & {w?: number; h?: number}> = ({x, y, s = 1, w = 420, h = 520}) => {
  const f = useCurrentFrame();
  const b = (f * 0.4) % (w + 200);
  return (
    <Grup x={x} y={y} s={s}>
      <rect x={-w / 2 - 16} y={-16} width={w + 32} height={h + 32} rx={24} fill={F.beyaz} />
      <defs><clipPath id="cam"><rect x={-w / 2} y={0} width={w} height={h} rx={14} /></clipPath></defs>
      <g clipPath="url(#cam)">
        <rect x={-w / 2} y={0} width={w} height={h} fill={F.gri2} />
        <ellipse cx={-w / 2 + b - 100} cy={110} rx={70} ry={26} fill={F.beyaz} opacity={0.9} />
        {[[-150, 300, 90, 220], [-50, 240, 80, 280], [40, 320, 100, 200], [140, 270, 70, 250]].map(([bx, by, bw, bh], i) => <rect key={i} x={bx} y={by} width={bw} height={bh} rx={6} fill={i % 2 ? F.gri : "#9FB3D8"} />)}
      </g>
      <rect x={-6} y={0} width={12} height={h} fill={F.beyaz} />
    </Grup>
  );
};

export const Kanepe: React.FC<G> = ({x, y, s = 1}) => (
  <Grup x={x} y={y} s={s}>
    <rect x={-360} y={-230} width={720} height={200} rx={60} fill={F.mor} />
    <rect x={-400} y={-80} width={800} height={120} rx={50} fill={F.lacivert} />
    <rect x={-430} y={-170} width={110} height={210} rx={50} fill={F.mor} />
    <rect x={320} y={-170} width={110} height={210} rx={50} fill={F.mor} />
    <rect x={-360} y={40} width={26} height={60} rx={10} fill={F.koyu} />
    <rect x={334} y={40} width={26} height={60} rx={10} fill={F.koyu} />
  </Grup>
);

export const Lamba: React.FC<G> = ({x, y, s = 1}) => (
  <Grup x={x} y={y} s={s}>
    <path d="M-80 -560 L80 -560 L50 -460 L-50 -460 Z" fill={F.gri2} />
    <rect x={-8} y={-460} width={16} height={440} rx={8} fill={F.lacivert} />
    <ellipse cx={0} cy={-10} rx={80} ry={18} fill={F.lacivert} />
    <ellipse cx={0} cy={-470} rx={160} ry={60} fill={F.beyaz} opacity={0.25} />
  </Grup>
);

// Telefon (içerik slotlu)
export const Telefon: React.FC<G & {w?: number; h?: number; children?: React.ReactNode}> = ({x, y, s = 1, r = 0, w = 300, h = 600, children}) => (
  <Grup x={x} y={y} s={s} r={r}>
    <rect x={-w / 2 - 14} y={-h / 2 - 14} width={w + 28} height={h + 28} rx={48} fill={F.lacivert} />
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={36} fill={F.beyaz} />
    <rect x={-40} y={-h / 2 + 14} width={80} height={14} rx={7} fill={F.lacivert} />
    <g transform={`translate(${-w / 2} ${-h / 2})`}>{children}</g>
  </Grup>
);

export const Belge: React.FC<G & {w?: number; h?: number; baslik?: string}> = ({x, y, s = 1, r = 0, w = 240, h = 300, baslik}) => (
  <Grup x={x} y={y} s={s} r={r}>
    <rect x={-w / 2 + 10} y={-h / 2 + 12} width={w} height={h} rx={18} fill={F.gri} opacity={0.6} />
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={18} fill={F.beyaz} />
    <rect x={-w / 2 + 26} y={-h / 2 + 30} width={w * 0.5} height={18} rx={9} fill={F.mavi} />
    {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={-w / 2 + 26} y={-h / 2 + 76 + i * 34} width={(w - 52) * (i % 2 ? 0.7 : 1)} height={12} rx={6} fill={F.gri2} />)}
    {baslik && <text x={0} y={h / 2 - 30} textAnchor="middle" fontFamily="'Plus Jakarta Sans'" fontWeight={800} fontSize={26} fill={F.lacivert}>{baslik}</text>}
  </Grup>
);

export const Jeton: React.FC<G> = ({x, y, s = 1, r = 0}) => (
  <Grup x={x} y={y} s={s} r={r}>
    <circle r={34} fill="#F5B83D" />
    <circle r={25} fill="#F9CD63" />
    <text y={11} textAnchor="middle" fontFamily="'Plus Jakarta Sans'" fontWeight={800} fontSize={30} fill="#C98A12">₺</text>
  </Grup>
);

export const Terazi: React.FC<G & {egim?: number}> = ({x, y, s = 1, egim = 0}) => (
  <Grup x={x} y={y} s={s}>
    <rect x={-10} y={-360} width={20} height={340} rx={10} fill={F.lacivert} />
    <rect x={-110} y={-30} width={220} height={36} rx={18} fill={F.lacivert} />
    <circle cx={0} cy={-372} r={22} fill={F.mavi} />
    <g transform={`rotate(${egim} 0 -350)`}>
      <rect x={-230} y={-358} width={460} height={16} rx={8} fill={F.mor} />
      {[-210, 210].map((cx, i) => (
        <g key={cx} transform={`translate(${cx} -350) rotate(${-egim})`}>
          <path d="M0 0 L-70 140 M0 0 L70 140" stroke={F.mor} strokeWidth={6} />
          <path d="M-95 140 Q0 210 95 140 Z" fill={i ? F.mavi : F.gri} />
        </g>
      ))}
    </g>
  </Grup>
);

export const Kumbara: React.FC<G> = ({x, y, s = 1}) => (
  <Grup x={x} y={y} s={s}>
    <ellipse cx={0} cy={0} rx={150} ry={115} fill={F.mavi} />
    <circle cx={120} cy={-20} r={48} fill={F.mavi} />
    <ellipse cx={150} cy={-14} rx={22} ry={18} fill="#1F55CC" />
    <path d="M-60 -100 L-30 -150 L0 -105 Z" fill="#1F55CC" />
    <rect x={-40} y={-118} width={80} height={14} rx={7} fill={F.lacivert} />
    <circle cx={95} cy={-40} r={8} fill={F.koyu} />
    {[-90, -30, 30, 90].map((lx) => <rect key={lx} x={lx - 16} y={90} width={32} height={50} rx={12} fill="#1F55CC" />)}
  </Grup>
);

// Uçuşan dekoratif şekiller
export const Suslemeler: React.FC<{tohum?: number}> = ({tohum = 0}) => {
  const f = useCurrentFrame();
  const sek = [[140, 420, 14, F.mavi], [930, 520, 10, F.gri], [880, 1180, 18, F.mor], [180, 1250, 12, F.gri], [520, 360, 8, F.mavi]] as const;
  return (
    <g>
      {sek.map(([x, y, r, c], i) => <circle key={i} cx={x} cy={y + Math.sin(f / 25 + i + tohum) * 14} r={r} fill={c} opacity={0.7} />)}
      <g transform={`translate(860 380) rotate(${f * 0.6 + tohum * 40})`}><rect x={-16} y={-16} width={32} height={32} rx={6} fill="none" stroke={F.mavi} strokeWidth={6} opacity={0.6} /></g>
      <g transform={`translate(200 1150) rotate(${-f * 0.5})`}><path d="M0 -20 L18 12 L-18 12 Z" fill="none" stroke={F.mor} strokeWidth={6} opacity={0.5} /></g>
    </g>
  );
};

// Yumuşak giriş yardımcıları
export const useGiris = (an: number, sure = 14) => {
  const f = useCurrentFrame();
  return interpolate(f - an, [0, sure], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3)});
};
