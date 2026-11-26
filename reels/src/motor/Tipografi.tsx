// TİPOGRAFİ SİSTEMİ — anlamlı kelimeler için kinetik yazı türleri
import {interpolate, useCurrentFrame} from "remotion";
import {EGRI, FONT, R} from "./marka";
import {ilerle} from "./zaman";

type Mod = "maske" | "pop" | "karakter" | "yumruk";
// Kinetik başlık: kelime kelime; "*kelime" vurgu rengi alır
export const Baslik: React.FC<{metin: string; an: number; boyut?: number; renk?: string; vurgu?: string; mod?: Mod; aralik?: number; hiza?: "left" | "center"; style?: React.CSSProperties}> = ({metin, an, boyut = 110, renk = R.murekkep, vurgu = R.marka, mod = "maske", aralik = 3, hiza = "left", style}) => {
  const f = useCurrentFrame();
  const kelimeler = metin.split(" ");
  return (
    <div style={{display: "flex", flexWrap: "wrap", justifyContent: hiza === "center" ? "center" : "flex-start", gap: `0 ${boyut * 0.24}px`, ...style}}>
      {kelimeler.map((k, i) => {
        const v = k.startsWith("*"); const yazi = v ? k.slice(1) : k;
        const a = an + i * aralik;
        const stil: React.CSSProperties = {fontFamily: FONT.baslik, fontWeight: 800, fontSize: boyut, lineHeight: 1.0, letterSpacing: -boyut * 0.03, color: v ? vurgu : renk, display: "inline-block"};
        if (mod === "maske") {
          const p = ilerle(f, a, 12, EGRI.expo);
          return <span key={i} style={{overflow: "hidden", display: "inline-block", paddingBottom: boyut * 0.1}}><span style={{...stil, translate: `0 ${(1 - p) * 105}%`}}>{yazi}</span></span>;
        }
        if (mod === "pop") {
          const p = ilerle(f, a, 10, EGRI.geri);
          return <span key={i} style={{...stil, scale: `${p}`, opacity: f < a ? 0 : 1}}>{yazi}</span>;
        }
        if (mod === "yumruk") {
          const p = ilerle(f, a, 6, EGRI.snap);
          return <span key={i} style={{...stil, scale: `${1.8 - p * 0.8}`, filter: `blur(${(1 - p) * 10}px)`, opacity: f < a ? 0 : 1}}>{yazi}</span>;
        }
        return (
          <span key={i} style={{display: "inline-block", whiteSpace: "pre"}}>
            {[...yazi].map((h, j) => {
              const p = ilerle(f, a + j * 1.2, 9, EGRI.geri);
              return <span key={j} style={{...stil, translate: `0 ${(1 - p) * 40}px`, rotate: `${(1 - p) * 12}deg`, opacity: f < a + j * 1.2 ? 0 : 1}}>{h}</span>;
            })}
          </span>
        );
      })}
    </div>
  );
};

// İşaretleyici: metnin arkasından soldan sağa süpürülür
export const Isaret: React.FC<{an: number; renk?: string; children: React.ReactNode}> = ({an, renk = R.vurgu, children}) => {
  const f = useCurrentFrame();
  const p = ilerle(f, an, 9, EGRI.snap);
  return (
    <span style={{position: "relative", display: "inline-block"}}>
      <span style={{position: "absolute", left: "-4%", right: "-4%", top: "48%", bottom: "4%", background: renk, transformOrigin: "left", scale: `${p} 1`, borderRadius: 6, rotate: "-1.5deg"}} />
      <span style={{position: "relative"}}>{children}</span>
    </span>
  );
};

// Sayaç: hedef değere sayar (yalnızca TTS'te geçen sayılar için)
export const Sayac: React.FC<{an: number; hedef: number; sure?: number; on?: string; son?: string; boyut?: number; renk?: string}> = ({an, hedef, sure = 18, on = "", son = "", boyut = 220, renk = R.murekkep}) => {
  const f = useCurrentFrame();
  const v = Math.round(interpolate(f, [an, an + sure], [0, hedef], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EGRI.expo}));
  return <span style={{fontFamily: FONT.sayi, fontWeight: 800, fontSize: boyut, color: renk, letterSpacing: -boyut * 0.04}}>{on}{v}{son}</span>;
};

// Etiket çipi
export const Cip: React.FC<{an: number; children: React.ReactNode; zemin?: string; renk?: string; boyut?: number}> = ({an, children, zemin = R.murekkep, renk = R.beyaz, boyut = 34}) => {
  const f = useCurrentFrame();
  const p = ilerle(f, an, 10, EGRI.geri);
  return <span style={{display: "inline-flex", alignItems: "center", gap: 10, fontFamily: FONT.govde, fontWeight: 800, fontSize: boyut, color: renk, background: zemin, padding: `${boyut * 0.3}px ${boyut * 0.7}px`, borderRadius: 999, scale: `${p}`, transformOrigin: "0 50%", opacity: f < an ? 0 : 1}}>{children}</span>;
};
