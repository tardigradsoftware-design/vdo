import {AbsoluteFill, interpolate, useCurrentFrame} from "remotion";

// Sahne geçişi: içe dalış (zoom + bulanıklık), 7 kare. Sequence içinde kullanılır; f yereldir.
export const Sahne: React.FC<{sure: number; children: React.ReactNode; sonGecis?: boolean}> = ({sure, children, sonGecis = true}) => {
  const f = useCurrentFrame();
  const G = 7;
  const girOlcek = interpolate(f, [0, G], [0.7, 1], {extrapolateRight: "clamp"});
  const girBlur = interpolate(f, [0, G], [18, 0], {extrapolateRight: "clamp"});
  const girOp = interpolate(f, [0, 3], [0, 1], {extrapolateRight: "clamp"});
  const cikOlcek = sonGecis ? interpolate(f, [sure - G, sure], [1, 1.6], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}) : 1;
  const cikBlur = sonGecis ? interpolate(f, [sure - G, sure], [0, 22], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}) : 0;
  const cikOp = sonGecis ? interpolate(f, [sure - G, sure], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}) : 1;
  return (
    <AbsoluteFill
      style={{
        transform: `scale(${girOlcek * cikOlcek})`,
        filter: `blur(${girBlur + cikBlur}px)`,
        opacity: girOp * cikOp,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
