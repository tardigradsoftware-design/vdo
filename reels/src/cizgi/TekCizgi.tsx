import {getLength, getPointAtLength} from "@remotion/paths";
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from "remotion";

// Beyaz zemin, kalem kalkmadan çizilen tek sürekli siyah hat, sonda tek turuncu nokta.
export const TekCizgi: React.FC<{yol: string; nokta: [number, number]; cizimBitis?: number; noktaAn?: number}> = ({yol, nokta, cizimBitis = 4.6, noktaAn = 4.9}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const L = getLength(yol);
  const p = interpolate(f, [0.2 * fps, cizimBitis * fps], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.45, 0, 0.25, 1)});
  const uc = getPointAtLength(yol, Math.max(0.01, p * L));
  const n = interpolate(f, [noktaAn * fps, noktaAn * fps + 9], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(2.2))});
  return (
    <AbsoluteFill style={{background: "#FFFFFF"}}>
      <svg width="1080" height="1920" viewBox="0 0 1080 1920">
        <path d={yol} fill="none" stroke="#111111" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={L} strokeDashoffset={L * (1 - p)} />
        {uc && p > 0 && p < 1 && <circle cx={uc.x} cy={uc.y} r={4} fill="#111111" />}
        <circle cx={nokta[0]} cy={nokta[1]} r={16 * n} fill="#FF6A13" />
      </svg>
    </AbsoluteFill>
  );
};

// Konu: adalet terazisi — tek sürekli hat (geri dönüşler aynı hat üzerinden)
export const TERAZI =
  "M 410 1250 C 470 1244 610 1244 670 1250 " + // taban
  "C 620 1250 560 1252 540 1240 " + // ortaya dönüş
  "C 538 1100 542 900 540 770 " + // direk
  "C 520 752 524 728 540 724 C 556 728 560 752 540 770 " + // tepe ilmeği
  "C 470 784 400 796 340 806 " + // sol kol
  "C 322 860 300 930 282 990 " + // sol zincir
  "C 300 1046 380 1046 398 990 " + // sol kefe
  "C 380 930 358 860 340 806 " + // zincire geri
  "C 470 784 610 748 740 726 " + // sağ kola (ortadan geçer)
  "C 722 780 700 850 682 910 " + // sağ zincir
  "C 700 966 780 966 798 910 " + // sağ kefe
  "C 780 850 758 780 740 726";
export const Cizgi6: React.FC = () => <TekCizgi yol={TERAZI} nokta={[540, 690]} />;

// ---- Dava dosyası stiline uyarlanmış sürüm: kâğıt zemin, mürekkep hat, kobalt kayık baskı gölgesi, kırmızı nokta ----
import {Kagit} from "../dosya/Kagit";
import {D} from "../dosya/tema";
export const TekCizgiDosya: React.FC<{yol: string; nokta: [number, number]; cizimBitis?: number; noktaAn?: number}> = ({yol, nokta, cizimBitis = 4.6, noktaAn = 4.9}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const L = getLength(yol);
  const p = interpolate(f, [0.2 * fps, cizimBitis * fps], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.45, 0, 0.25, 1)});
  const uc = getPointAtLength(yol, Math.max(0.01, p * L));
  const n = interpolate(f, [noktaAn * fps, noktaAn * fps + 9], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(2.2))});
  const hat = (renk: string, dx: number, carp: boolean) => (
    <path d={yol} transform={`translate(${dx} ${dx})`} fill="none" stroke={renk} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={L} strokeDashoffset={L * (1 - p)} style={{mixBlendMode: carp ? "multiply" : "normal"}} />
  );
  return (
    <AbsoluteFill>
      <Kagit />
      <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position: "absolute"}}>
        {hat(D.golge, 7, true)}
        {hat(D.murekkep, 0, false)}
        {uc && p > 0 && p < 1 && <circle cx={uc.x} cy={uc.y} r={4.5} fill={D.murekkep} />}
        <circle cx={nokta[0] + 6} cy={nokta[1] + 6} r={17 * n} fill={D.golge} style={{mixBlendMode: "multiply"}} />
        <circle cx={nokta[0]} cy={nokta[1]} r={17 * n} fill={D.alarm} />
      </svg>
    </AbsoluteFill>
  );
};
export const Cizgi6Dosya: React.FC = () => <TekCizgiDosya yol={TERAZI} nokta={[540, 690]} />;
