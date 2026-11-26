import {useCurrentFrame} from "remotion";
import {F} from "./tema";

// Kontursuz flat karakter. Orijin: ayakların ortası (ayakta) / koltuk hizası (oturan).
// Kollar omuzdan döner (ust: üst kol açısı, alt: dirsek açısı; derece, 0 = aşağı sarkık).
export type Poz = {solUst?: number; solAlt?: number; sagUst?: number; sagAlt?: number; bas?: number; govde?: number; kas?: number};
export const Kisi: React.FC<{
  x: number; y: number; olcek?: number; oturan?: boolean; ayna?: boolean;
  ten?: string; sac?: string; ust?: string; alt?: string; sacTip?: "kisa" | "uzun" | "topuz";
  poz?: Poz; kirpma?: number; agiz?: "gulus" | "o" | "duz"; esya?: React.ReactNode; // sağ elde tutulan
}> = ({x, y, olcek = 1, oturan, ayna, ten = F.ten1, sac = F.sac, ust = F.mor, alt = F.lacivert, sacTip = "kisa", poz = {}, kirpma = 0, agiz = "gulus", esya}) => {
  const f = useCurrentFrame();
  const nefes = Math.sin(f / 22) * 0.012;
  const kirp = ((f + kirpma) % 96) < 4 ? 0.12 : 1; // ~3 sn'de bir göz kırpma
  const {solUst = 8, solAlt = 0, sagUst = -8, sagAlt = 0, bas = 0, govde = 0, kas = 0} = poz;
  const basSalla = bas + Math.sin(f / 37) * 2;
  const kalcaY = oturan ? 0 : -250;
  const Kol = ({sx, ua, la, sag}: {sx: number; ua: number; la: number; sag?: boolean}) => (
    <g transform={`rotate(${ua} ${sx} -430)`}>
      <rect x={sx - 21} y={-440} width={42} height={125} rx={21} fill={ust} />
      <g transform={`rotate(${la} ${sx} -325)`}>
        <rect x={sx - 19} y={-335} width={38} height={110} rx={19} fill={ust} />
        <circle cx={sx} cy={-222} r={22} fill={ten} />
        {sag && esya && <g transform={`translate(${sx} -222)`}>{esya}</g>}
      </g>
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${(ayna ? -1 : 1) * olcek} ${olcek})`}>
      {!oturan && <ellipse cx={0} cy={6} rx={120} ry={18} fill={F.koyu} opacity={0.12} />}
      {/* bacaklar */}
      {oturan ? (
        <g>
          <rect x={-70} y={-40} width={190} height={58} rx={29} fill={alt} />
          <rect x={-10} y={-40} width={190} height={58} rx={29} fill={F.koyu} opacity={0.35} />
          <rect x={112} y={-20} width={52} height={190} rx={26} fill={alt} />
          <rect x={102} y={150} width={84} height={34} rx={17} fill={F.koyu} />
        </g>
      ) : (
        <g>
          <rect x={-62} y={-262} width={56} height={250} rx={28} fill={alt} />
          <rect x={6} y={-262} width={56} height={250} rx={28} fill={alt} />
          <rect x={-74} y={-22} width={76} height={30} rx={15} fill={F.koyu} />
          <rect x={4} y={-22} width={76} height={30} rx={15} fill={F.koyu} />
        </g>
      )}
      <g transform={`translate(0 ${kalcaY}) rotate(${govde} 0 0) scale(${1 + nefes} ${1 - nefes}) translate(0 ${-kalcaY})`}>
        <g transform={`translate(0 ${kalcaY + 250})`}>
          <Kol sx={-78} ua={solUst} la={solAlt} />
          {/* gövde */}
          <path d="M-88 -440 Q-92 -470 -50 -478 L50 -478 Q92 -470 88 -440 L80 -250 Q80 -236 66 -236 L-66 -236 Q-80 -236 -80 -250 Z" fill={ust} />
          <path d="M-30 -478 L0 -440 L30 -478 Z" fill={F.beyaz} opacity={0.9} />
          <rect x={-18} y={-505} width={36} height={36} rx={10} fill={ten} />
          {/* baş */}
          <g transform={`rotate(${basSalla} 0 -500)`}>
            <circle cx={0} cy={-560} r={62} fill={ten} />
            <circle cx={-60} cy={-555} r={12} fill={ten} />
            <circle cx={60} cy={-555} r={12} fill={ten} />
            {sacTip === "kisa" && <path d="M-64 -566 Q-66 -632 0 -634 Q66 -632 64 -566 Q50 -600 0 -598 Q-40 -598 -64 -566 Z" fill={sac} />}
            {sacTip === "uzun" && <path d="M-70 -560 Q-74 -636 0 -636 Q74 -636 70 -560 L72 -480 Q50 -470 44 -500 Q40 -590 0 -596 Q-40 -590 -44 -500 Q-50 -470 -72 -480 Z" fill={sac} />}
            {sacTip === "topuz" && <g fill={sac}><circle cx={0} cy={-640} r={30} /><path d="M-64 -562 Q-66 -630 0 -632 Q66 -630 64 -562 Q48 -598 0 -596 Q-44 -598 -64 -562 Z" /></g>}
            <g transform={`translate(0 -556) scale(1 ${kirp}) translate(0 556)`}>
              <ellipse cx={-22} cy={-556} rx={6} ry={7.5} fill={F.koyu} />
              <ellipse cx={22} cy={-556} rx={6} ry={7.5} fill={F.koyu} />
            </g>
            <rect x={-34} y={-582 - kas} width={22} height={6} rx={3} fill={sac} transform={`rotate(${-kas * 2} -23 ${-579 - kas})`} />
            <rect x={12} y={-582 - kas} width={22} height={6} rx={3} fill={sac} transform={`rotate(${kas * 2} 23 ${-579 - kas})`} />
            {agiz === "gulus" && <path d="M-14 -528 Q0 -516 14 -528" stroke={F.koyu} strokeWidth={5} fill="none" strokeLinecap="round" />}
            {agiz === "o" && <ellipse cx={0} cy={-526} rx={7} ry={9} fill={F.koyu} />}
            {agiz === "duz" && <path d="M-12 -526 L12 -526" stroke={F.koyu} strokeWidth={5} strokeLinecap="round" />}
            <ellipse cx={-36} cy={-534} rx={10} ry={6} fill="#E89A8A" opacity={0.35} />
            <ellipse cx={36} cy={-534} rx={10} ry={6} fill="#E89A8A" opacity={0.35} />
          </g>
          <Kol sx={78} ua={sagUst} la={sagAlt} sag />
        </g>
      </g>
    </g>
  );
};
