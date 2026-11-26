import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {C, MONO, SANS, SERIF} from "./tema";

const yay = (f: number, an: number, fps: number, d = 16, s = 120) => spring({frame: f - an, fps, config: {damping: d, stiffness: s, mass: 0.9}});

// Satır satır maskeyle açılan serif başlık
export const Satir: React.FC<{an: number; children: React.ReactNode; boyut?: number; renk?: string; italik?: boolean; style?: React.CSSProperties}> = ({an, children, boyut = 120, renk = C.yazi, italik, style}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = yay(f, an, fps, 20, 140);
  return (
    <div style={{overflow: "hidden", paddingBottom: boyut * 0.12, ...style}}>
      <div style={{fontFamily: SERIF, fontWeight: italik ? 700 : 900, fontStyle: italik ? "italic" : "normal", fontSize: boyut, lineHeight: 1.0, letterSpacing: -2, color: renk, transform: `translateY(${(1 - s) * 110}%)`, filter: `blur(${(1 - s) * 12}px)`, opacity: f < an ? 0 : 1}}>{children}</div>
    </div>
  );
};

// Soldan sağa çizilen ince kırmızı çizgi
export const Cizgi: React.FC<{an: number; en?: number; renk?: string; kalin?: number}> = ({an, en = 160, renk = C.kirmizi, kalin = 6}) => {
  const f = useCurrentFrame();
  const p = interpolate(f - an, [0, 12], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return <div style={{width: en * p, height: kalin, background: renk, margin: "18px 0"}} />;
};

// Küçük büyük harf etiket (kanun / kategori)
export const Ust: React.FC<{an: number; children: React.ReactNode; renk?: string}> = ({an, children, renk = C.altin}) => {
  const f = useCurrentFrame();
  const o = interpolate(f - an, [0, 8], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return (
    <div style={{display: "inline-flex", alignItems: "center", gap: 14, fontFamily: MONO, fontWeight: 700, fontSize: 30, letterSpacing: 6, color: renk, opacity: o, transform: `translateX(${(1 - o) * -30}px)`}}>
      <div style={{width: 14, height: 14, background: renk, transform: "rotate(45deg)"}} />
      {children}
    </div>
  );
};

// Krem renk belge kartı
export const Belge: React.FC<{an: number; children: React.ReactNode; aci?: number; en?: number; style?: React.CSSProperties}> = ({an, children, aci = -2, en = 820, style}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = yay(f, an, fps, 18, 90);
  return (
    <div
      style={{
        width: en,
        background: C.kagit,
        color: C.murekkep,
        padding: "48px 54px",
        borderRadius: 6,
        boxShadow: "0 40px 80px rgba(0,0,0,0.55), 0 8px 20px rgba(0,0,0,0.4)",
        transform: `perspective(1600px) translateY(${(1 - s) * 260}px) rotateX(${(1 - s) * 28 + Math.sin((f - an) / 40) * 2}deg) rotateY(${Math.sin((f - an) / 55) * 4}deg) rotate(${aci + (1 - s) * 6}deg) scale(${0.92 + s * 0.08})`,
        position: "relative",
        opacity: f < an ? 0 : Math.min(1, s * 1.6),
        backgroundImage: "repeating-linear-gradient(0deg, transparent 0 46px, #0000000c 46px 47px)",
        ...style,
      }}
    >
      {children}
      <div style={{position: "absolute", inset: 0, overflow: "hidden", borderRadius: 6, pointerEvents: "none"}}>
        <div style={{position: "absolute", top: 0, bottom: 0, width: 220, left: interpolate(f - an, [10, 40], [-300, en + 300], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}), background: "linear-gradient(100deg, transparent, rgba(255,255,255,0.55), transparent)", transform: "skewX(-18deg)"}} />
      </div>
    </div>
  );
};
export const BelgeSatir: React.FC<{children: React.ReactNode; boyut?: number; kalin?: boolean; renk?: string}> = ({children, boyut = 30, kalin, renk = C.murekkep}) => (
  <div style={{fontFamily: MONO, fontWeight: kalin ? 700 : 500, fontSize: boyut, color: renk, lineHeight: 1.5}}>{children}</div>
);

// Sansür / karartma çubuğu (soldan uzar)
export const Karartma: React.FC<{an: number; en: number; yuk?: number}> = ({an, en, yuk = 30}) => {
  const f = useCurrentFrame();
  const p = interpolate(f - an, [0, 8], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return <span style={{display: "inline-block", width: en * p, height: yuk, background: C.murekkep, verticalAlign: "middle", marginLeft: 10}} />;
};

// Kırmızı ıslak mühür: büyükten çarpar
export const Muhur: React.FC<{an: number; metin: string; alt?: string; aci?: number; boyut?: number; style?: React.CSSProperties}> = ({an, metin, alt, aci = -12, boyut = 120, style}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - an, fps, config: {damping: 14, stiffness: 320, mass: 0.7}});
  const olcek = interpolate(s, [0, 1], [3, 1]);
  return (
    <div
      style={{
        position: "absolute",
        border: `10px solid ${C.kirmizi}`,
        outline: `4px solid ${C.kirmizi}`,
        outlineOffset: 8,
        color: C.kirmizi,
        fontFamily: SERIF,
        fontWeight: 900,
        fontSize: boyut,
        letterSpacing: 4,
        padding: "6px 34px 14px",
        borderRadius: 10,
        textAlign: "center",
        transform: `rotate(${aci}deg) scale(${olcek})`,
        opacity: f < an ? 0 : interpolate(f - an, [0, 2], [0, 0.92], {extrapolateRight: "clamp"}),
        mixBlendMode: "multiply",
        maskImage: "repeating-radial-gradient(circle at 30% 40%, black 0 3px, rgba(0,0,0,0.75) 3px 5px)",
        WebkitMaskImage: "repeating-radial-gradient(circle at 30% 40%, black 0 3px, rgba(0,0,0,0.75) 3px 5px)",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {metin}
      {alt && <div style={{fontFamily: MONO, fontSize: boyut * 0.22, letterSpacing: 6, fontWeight: 700}}>{alt}</div>}
    </div>
  );
};

// Çizgi ikon: soldan sağa açılır, hafif parlar
export const CizgiIkon: React.FC<{an: number; Ikon: React.FC<{size?: number; color?: string; strokeWidth?: number}>; boyut?: number; renk?: string}> = ({an, Ikon, boyut = 200, renk = C.yazi}) => {
  const f = useCurrentFrame();
  const p = interpolate(f - an, [0, 14], [0, 100], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return (
    <div style={{width: boyut, height: boyut, clipPath: `inset(0 ${100 - p}% 0 0)`, filter: `drop-shadow(0 0 18px ${renk}55)`}}>
      <Ikon size={boyut} color={renk} strokeWidth={1.4} />
    </div>
  );
};

// Büyük kırmızı sayı / veri
export const Veri: React.FC<{an: number; children: React.ReactNode; boyut?: number; renk?: string}> = ({an, children, boyut = 150, renk = C.kirmizi}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = yay(f, an, fps, 14, 160);
  return <div style={{fontFamily: MONO, fontWeight: 700, fontSize: boyut, color: renk, letterSpacing: -4, transform: `scale(${0.8 + s * 0.2})`, opacity: f < an ? 0 : s, textShadow: `0 0 40px ${renk}55`}}>{children}</div>;
};

export const Govde: React.FC<{an: number; children: React.ReactNode; boyut?: number; renk?: string; style?: React.CSSProperties}> = ({an, children, boyut = 46, renk = C.soluk, style}) => {
  const f = useCurrentFrame();
  const o = interpolate(f - an, [0, 10], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return <div style={{fontFamily: SANS, fontWeight: 500, fontSize: boyut, color: renk, lineHeight: 1.35, opacity: o, transform: `translateY(${(1 - o) * 20}px)`, ...style}}>{children}</div>;
};

// Sahne geçişi: yukarı itiş + bulanıklık (8 kare), sahne boyunca yavaş zoom (Ken Burns)
export const CSahne: React.FC<{sure: number; children: React.ReactNode; son?: boolean}> = ({sure, children, son = true}) => {
  const f = useCurrentFrame();
  const G = 8;
  const giris = interpolate(f, [0, G], [1, 0], {extrapolateRight: "clamp"});
  const cikis = son ? interpolate(f, [sure - G, sure], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}) : 0;
  return (
    <AbsoluteFill
      style={{
        transform: `translateY(${giris * 140 - cikis * 140}px) scale(${1 + f * 0.0005})`,
        filter: `blur(${(giris + cikis) * 16}px)`,
        opacity: 1 - Math.max(giris, cikis),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
