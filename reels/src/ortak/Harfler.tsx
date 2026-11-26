import {spring, useCurrentFrame, useVideoConfig} from "remotion";

// Kinetik yazı: harfler sırayla yaylı düşer
export const Harfler: React.FC<{metin: string; an: number; aralik?: number; style?: React.CSSProperties}> = ({metin, an, aralik = 1.5, style}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <span style={{display: "inline-block", whiteSpace: "pre", ...style}}>
      {[...metin].map((h, i) => {
        const s = spring({frame: f - an - i * aralik, fps, config: {damping: 11, stiffness: 240, mass: 0.6}});
        return (
          <span key={i} style={{display: "inline-block", transform: `translateY(${(1 - s) * -80}px) rotate(${(1 - s) * (i % 2 ? 14 : -14)}deg)`, opacity: Math.min(1, s * 2)}}>
            {h}
          </span>
        );
      })}
    </span>
  );
};

// Fosforlu kalem vurgusu: kelimenin arkasından soldan sağa çizilir
export const Fosfor: React.FC<{an: number; renk: string; children: React.ReactNode}> = ({an, renk, children}) => {
  const f = useCurrentFrame();
  const p = Math.max(0, Math.min(1, (f - an) / 7));
  return (
    <span style={{position: "relative", display: "inline-block"}}>
      <span style={{position: "absolute", left: -10, right: -10, top: "52%", height: "44%", background: renk, transformOrigin: "left", transform: `scaleX(${p}) skewX(-8deg)`, borderRadius: 8, zIndex: 0}} />
      <span style={{position: "relative", zIndex: 1}}>{children}</span>
    </span>
  );
};
