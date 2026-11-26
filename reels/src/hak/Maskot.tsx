// Turuncu dosya maskot (SVG yer tutucu; PNG pozları gelince yalnızca <Cizim> değişir). Çapa: alt orta.
import {random, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, type Poz, SPRING} from "./tema";
const I = COLORS.ink, K = 7;
type El = {x: number; y: number; tip: "eldiven" | "isaret" | "avuc" | "basparmak"; aci?: number};
const POZLAR: Record<Poz, {sol: El; sag: El; kas: "yukari" | "endise" | "kizgin" | "duz" | "normal"; agiz: "o" | "gulus" | "duz" | "dalga" | "buyuk"; goz: "buyuk" | "normal" | "mutlu"}> = {
  saskin: {sol: {x: -215, y: -350, tip: "eldiven"}, sag: {x: 215, y: -350, tip: "eldiven"}, kas: "yukari", agiz: "o", goz: "buyuk"},
  endiseli: {sol: {x: -45, y: -95, tip: "eldiven"}, sag: {x: 45, y: -95, tip: "eldiven"}, kas: "endise", agiz: "dalga", goz: "normal"},
  itiraz: {sol: {x: -205, y: -140, tip: "eldiven"}, sag: {x: 255, y: -290, tip: "avuc"}, kas: "kizgin", agiz: "duz", goz: "normal"},
  isaret: {sol: {x: -205, y: -140, tip: "eldiven"}, sag: {x: 255, y: -300, tip: "isaret", aci: -35}, kas: "normal", agiz: "gulus", goz: "normal"},
  ciddi: {sol: {x: -200, y: -150, tip: "eldiven"}, sag: {x: 200, y: -150, tip: "eldiven"}, kas: "duz", agiz: "duz", goz: "normal"},
  mutlu: {sol: {x: -205, y: -140, tip: "eldiven"}, sag: {x: 235, y: -310, tip: "basparmak"}, kas: "normal", agiz: "buyuk", goz: "mutlu"},
  yorum: {sol: {x: -205, y: -140, tip: "eldiven"}, sag: {x: 250, y: -110, tip: "isaret", aci: 35}, kas: "normal", agiz: "gulus", goz: "normal"},
  kutlama: {sol: {x: -240, y: -430, tip: "eldiven"}, sag: {x: 240, y: -430, tip: "eldiven"}, kas: "yukari", agiz: "buyuk", goz: "mutlu"},
};
const Kol: React.FC<{omuz: [number, number]; el: El}> = ({omuz, el}) => (
  <g>
    <path d={`M${omuz[0]} ${omuz[1]} Q ${(omuz[0] + el.x) / 2} ${Math.max(omuz[1], el.y) + 40} ${el.x} ${el.y}`} stroke={I} strokeWidth={16} fill="none" strokeLinecap="round" />
    <g transform={`translate(${el.x} ${el.y}) rotate(${el.aci ?? 0})`}>
      {el.tip === "isaret" && <rect x={12} y={-12} width={58} height={24} rx={12} fill={COLORS.paper} stroke={I} strokeWidth={K} />}
      {el.tip === "basparmak" && <rect x={-12} y={-66} width={24} height={50} rx={12} fill={COLORS.paper} stroke={I} strokeWidth={K} />}
      {el.tip === "avuc" ? <rect x={-30} y={-42} width={60} height={76} rx={24} fill={COLORS.paper} stroke={I} strokeWidth={K} /> : <circle r={30} fill={COLORS.paper} stroke={I} strokeWidth={K} />}
    </g>
  </g>
);
const Cizim: React.FC<{poz: Poz; agizAcik: boolean; kirp: boolean}> = ({poz, agizAcik, kirp}) => {
  const P = POZLAR[poz];
  const gozY = -258, gr = P.goz === "buyuk" ? 30 : 25;
  const kas = {yukari: "M-80 -312 Q-52 -330 -24 -314 M80 -312 Q52 -330 24 -314", endise: "M-82 -300 L-26 -316 M82 -300 L26 -316", kizgin: "M-82 -318 L-26 -298 M82 -318 L26 -298", duz: "M-80 -306 L-26 -306 M80 -306 L26 -306", normal: "M-80 -304 Q-52 -316 -24 -304 M80 -304 Q52 -316 24 -304"}[P.kas];
  const acik = agizAcik || P.agiz === "o";
  const agiz = P.agiz === "o" ? <ellipse cx={0} cy={-178} rx={20} ry={26} fill={I} />
    : P.agiz === "buyuk" || (acik && P.agiz === "gulus") ? <path d={`M-48 -196 Q0 ${acik ? -120 : -150} 48 -196 Z`} fill={I} />
    : P.agiz === "dalga" ? <path d={acik ? "M-36 -184 Q-18 -200 0 -184 Q18 -168 36 -184 L36 -170 Q18 -154 0 -170 Q-18 -186 -36 -170 Z" : "M-36 -180 Q-18 -196 0 -180 Q18 -164 36 -180"} stroke={I} strokeWidth={K} fill={acik ? I : "none"} strokeLinecap="round" />
    : P.agiz === "duz" ? (acik ? <rect x={-30} y={-196} width={60} height={26} rx={12} fill={I} /> : <path d="M-30 -182 L30 -182" stroke={I} strokeWidth={K + 2} strokeLinecap="round" />)
    : <path d="M-40 -192 Q0 -156 40 -192" stroke={I} strokeWidth={K + 2} fill="none" strokeLinecap="round" />;
  return (
    <g>
      <ellipse cx={0} cy={4} rx={150} ry={20} fill="#000" opacity={0.3} />
      {/* bacaklar */}
      <rect x={-78} y={-60} width={34} height={56} rx={14} fill={I} /><rect x={44} y={-60} width={34} height={56} rx={14} fill={I} />
      <rect x={-96} y={-18} width={62} height={26} rx={13} fill={I} /><rect x={34} y={-18} width={62} height={26} rx={13} fill={I} />
      {/* arka kapak + sekme */}
      <path d="M-160 -440 L-60 -440 L-36 -410 L160 -410 L160 -60 L-160 -60 Z" fill={COLORS.orange2} stroke={I} strokeWidth={K} strokeLinejoin="round" />
      <rect x={-118} y={-432} width={210} height={150} rx={8} fill={COLORS.paper} stroke={I} strokeWidth={5} transform="rotate(-4)" />
      {/* ön kapak */}
      <rect x={-172} y={-370} width={344} height={316} rx={30} fill={COLORS.orange} stroke={I} strokeWidth={K} />
      <Kol omuz={[-160, -230]} el={P.sol} />
      <Kol omuz={[160, -230]} el={P.sag} />
      {/* gözler */}
      {[-52, 52].map((x) => P.goz === "mutlu" ? <path key={x} d={`M${x - 24} ${gozY + 6} Q${x} ${gozY - 26} ${x + 24} ${gozY + 6}`} stroke={I} strokeWidth={K + 2} fill="none" strokeLinecap="round" />
        : kirp ? <path key={x} d={`M${x - 24} ${gozY} L${x + 24} ${gozY}`} stroke={I} strokeWidth={K + 2} strokeLinecap="round" />
        : <g key={x}><ellipse cx={x} cy={gozY} rx={gr} ry={gr * 1.15} fill={COLORS.paper} stroke={I} strokeWidth={K} /><circle cx={x + 4} cy={gozY + 4} r={gr * 0.5} fill={I} /><circle cx={x + 10} cy={gozY - 4} r={5} fill="#fff" /></g>)}
      <path d={kas} stroke={I} strokeWidth={K + 2} strokeLinecap="round" fill="none" />
      {agiz}
      {poz === "endiseli" && <path d="M120 -330 Q132 -300 120 -290 Q108 -300 120 -330 Z" fill={COLORS.blue} stroke={I} strokeWidth={4} />}
      {poz === "ciddi" && <g stroke={I} strokeWidth={6} fill="none"><circle cx={-52} cy={gozY} r={36} /><circle cx={52} cy={gozY} r={36} /><path d="M-16 -258 L16 -258" /></g>}
    </g>
  );
};

export type Tepki = {an: number; isaret: "!" | "?" | "yildiz"};
// x: merkez, y: alt kenar, boy: px yükseklik. konusma: o karede ağız açık mı; pozDegisim: son poz değişiminin karesi.
export const Maskot: React.FC<{x: number; y: number; boy: number; poz: Poz; yon?: "sag" | "sol"; agizAcik: boolean; konusuyor: boolean; pozDegisim: number; tepkiler?: Tepki[]; girisAn?: number; id: string}> = ({x, y, boy, poz, yon = "sag", agizAcik, konusuyor, pozDegisim, tepkiler = [], girisAn, id}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = boy / 480;
  const nefes = 1 + Math.sin((f / fps) * Math.PI) * 0.0075; // 2 sn periyot
  const sallan = konusuyor ? Math.sin((f / fps) * Math.PI * 4) * 3 : 0; // 0,5 sn periyot
  // göz kırpma: 2,5–4 sn aralık, seed'li, 3 kare
  let kirp = false, tk = 0, n = 0;
  while (tk <= f) { const ara = Math.round((2.5 + random(`${id}-kirp-${n}`) * 1.5) * fps); tk += ara; if (f >= tk && f < tk + 3) kirp = true; n++; }
  if (poz === "mutlu" || poz === "kutlama") kirp = false;
  // poz değişimi: 3 kare ezilme → SOFT spring
  const d = f - pozDegisim;
  const ez = d >= 0 && d < 3 ? 1 : 0;
  const geri = d >= 3 ? spring({frame: d - 3, fps, config: SPRING.SOFT, durationInFrames: 5}) : 1;
  const sx = ez ? 1.08 : 1.08 - 0.08 * geri, sy = ez ? 0.92 : 0.92 + 0.08 * geri;
  const ezK = d >= 0 && d < 12 ? [sx, sy] : [1, 1];
  // tepki zıplaması (6 kare, −20 px) + işaret (12 kare)
  const t = [...tepkiler].reverse().find((r) => f >= r.an && f < r.an + 12);
  const zipla = t && f - t.an < 6 ? -Math.sin(((f - t.an) / 6) * Math.PI) * 20 : 0;
  const giris = girisAn !== undefined ? spring({frame: f - girisAn, fps, config: SPRING.POP}) : 1;
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: "absolute", inset: 0, overflow: "visible"}}>
      <g transform={`translate(${x} ${y + sallan + zipla + (1 - giris) * 600}) scale(${(yon === "sol" ? -1 : 1) * s * ezK[0]} ${s * ezK[1] * nefes})`}>
        <Cizim poz={poz} agizAcik={agizAcik} kirp={kirp} />
        {t && <text x={yon === "sol" ? -230 : 230} y={-470} transform={yon === "sol" ? "scale(-1 1)" : undefined} textAnchor="middle" fontFamily="'Anton'" fontSize={110} fill={COLORS.yellow} stroke={I} strokeWidth={8} paintOrder="stroke">{t.isaret === "yildiz" ? "★" : t.isaret}</text>}
        {poz === "kutlama" && [0, 1, 2, 3].map((i) => <text key={i} x={-260 + i * 170} y={-520 - Math.sin(f / 5 + i) * 20} fontSize={60} fill={[COLORS.yellow, COLORS.green, COLORS.blue, COLORS.yellow][i]} textAnchor="middle">★</text>)}
      </g>
    </svg>
  );
};
