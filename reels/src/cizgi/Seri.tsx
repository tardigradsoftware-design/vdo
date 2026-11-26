import {getLength, getPointAtLength} from "@remotion/paths";
import {AbsoluteFill, Audio, Easing, Sequence, interpolate, staticFile, useCurrentFrame} from "remotion";
import {Kagit} from "../dosya/Kagit";
import {D, VERI} from "../dosya/tema";

// Tek çizgi serisi: her vuruşta kalem kalkmadan bir çizim, sonunda kırmızı nokta. Yazı yok (CTA kelimesi hariç).
export type CVurus = {an: number; yol: string; nokta: [number, number]; noktaAn: number; yazi?: {metin: string; an: number; x: number; y: number}};

const Cizim: React.FC<{v: CVurus; sure: number}> = ({v, sure}) => {
  const f = useCurrentFrame();
  const L = getLength(v.yol);
  const bitis = Math.max(16, v.noktaAn - v.an - 3);
  const p = interpolate(f, [2, bitis], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.45, 0, 0.25, 1)});
  const uc = getPointAtLength(v.yol, Math.max(0.01, p * L));
  const n = interpolate(f, [v.noktaAn - v.an, v.noktaAn - v.an + 9], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(2.2))});
  const cik = interpolate(f, [sure - 6, sure], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const hat = (renk: string, dx: number, carp: boolean) => <path d={v.yol} transform={`translate(${dx} ${dx})`} fill="none" stroke={renk} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={L} strokeDashoffset={L * (1 - p)} style={{mixBlendMode: carp ? "multiply" : "normal"}} />;
  const harf = v.yazi ? Math.max(0, Math.min(v.yazi.metin.length, Math.floor((f - (v.yazi.an - v.an)) / 2) + 1)) : 0;
  return (
    <AbsoluteFill style={{opacity: cik, scale: `${0.96 + cik * 0.04}`}}>
      <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position: "absolute"}}>
        <g transform="translate(540 940) scale(1.4) translate(-540 -960)">
        {hat(D.golge, 7, true)}
        {hat(D.murekkep, 0, false)}
        {uc && p > 0 && p < 1 && <circle cx={uc.x} cy={uc.y} r={4.5} fill={D.murekkep} />}
        <circle cx={v.nokta[0] + 6} cy={v.nokta[1] + 6} r={18 * n} fill={D.golge} style={{mixBlendMode: "multiply"}} />
        <circle cx={v.nokta[0]} cy={v.nokta[1]} r={18 * n} fill={D.alarm} />
        {v.yazi && f >= v.yazi.an - v.an && (
          <g fontFamily={VERI} fontWeight={800} fontSize={68} textAnchor="middle" letterSpacing={4}>
            <text x={v.yazi.x + 6} y={v.yazi.y + 6} fill={D.golge} style={{mixBlendMode: "multiply"}}>{v.yazi.metin.slice(0, harf)}</text>
            <text x={v.yazi.x} y={v.yazi.y} fill={D.murekkep}>{v.yazi.metin.slice(0, harf)}</text>
          </g>
        )}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export const CizgiSeri: React.FC<{V: CVurus[]; sure: number; klasor: string}> = ({V, sure, klasor}) => (
  <AbsoluteFill>
    <Kagit />
    {V.map((v, i) => {
      const son = i + 1 < V.length ? V[i + 1].an : sure;
      return <Sequence key={i} from={v.an} durationInFrames={son - v.an} layout="none"><Cizim v={v} sure={son - v.an} /></Sequence>;
    })}
    <Audio src={staticFile(`${klasor}/ses.mp3`)} />
    <Audio src={staticFile(`${klasor}/muzik.wav`)} volume={0.12} />
    {V.map((v, i) => <Sequence key={`k${i}`} from={v.an + 2} durationInFrames={Math.max(16, v.noktaAn - v.an - 3)} layout="none"><Audio src={staticFile("sfx_cizgi/kalem.wav")} volume={0.12} /></Sequence>)}
    {V.map((v, i) => <Sequence key={`n${i}`} from={v.noktaAn} layout="none"><Audio src={staticFile("sfx_cizgi/nokta.wav")} volume={0.22} /></Sequence>)}
  </AbsoluteFill>
);

// ---- Çizim kütüphanesi (her biri tek sürekli yol; merkez ~ (540, 960)) ----
export const YOL = {
  kimlik: "M 380 1000 C 390 952 426 945 440 945 a 26 26 0 1 1 0.1 0 C 454 945 490 952 500 1000 L 500 840 L 380 840 L 380 1060 L 330 1060 L 330 780 L 750 780 L 750 1060 L 560 1060 L 560 870 L 700 870 L 560 870 L 560 920 L 690 920 L 560 920 L 560 970 L 650 970",
  bina: "M 340 1140 L 420 1140 L 420 790 L 660 790 L 660 1140 L 740 1140 L 600 1140 L 600 1050 L 480 1050 L 480 1140 L 420 1140 L 420 980 L 660 980 L 660 880 L 420 880",
  grafik: "M 340 760 L 340 1140 L 760 1140 L 340 1140 L 340 820 L 420 880 L 480 860 L 560 960 L 620 940 L 720 1070 L 700 1040 L 720 1070 L 686 1074",
  kapi: "M 320 1140 L 760 1140 L 680 1140 L 680 960 L 652 960 a 10 10 0 1 0 0.1 0 L 680 960 L 680 760 L 400 760 L 400 1140 L 450 1140 L 450 1210 L 630 1210 L 630 1140 L 540 1180 L 450 1140",
  kilit: "M 460 940 L 460 860 A 80 80 0 0 1 620 860 L 620 940 L 690 940 L 690 1150 L 390 1150 L 390 940 L 540 940 L 540 1012",
  kalkan: "M 540 760 C 610 800 670 806 720 796 C 722 970 660 1086 540 1150 C 420 1086 358 970 360 796 C 410 806 470 800 540 760 C 520 820 470 900 460 950 L 525 1012 L 650 870",
  balon: "M 360 830 C 360 780 390 770 440 770 L 640 770 C 690 770 720 790 720 840 L 720 960 C 720 1010 690 1020 640 1020 L 500 1020 L 430 1090 L 450 1020 L 440 1020 C 390 1020 360 1000 360 960 L 360 830",
};
