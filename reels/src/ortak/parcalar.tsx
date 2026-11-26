import {Img, spring, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {FONT, Kelime, MONO, R, kare} from "./stil";
import {Kart} from "./Kart";
import {Hareketli} from "./Hareketli";
import {Damga} from "./Damga";

// Kelime → kare bulucu
export const zamanlayici = (K: Kelime[]) => (kelime: string, sira = 0) => {
  const bul = K.filter((k) => k.kelime.replace(/[.,!?]/g, "") === kelime)[sira];
  if (!bul) throw new Error(`Kelime yok: ${kelime} (${sira})`);
  return kare(bul.baslangic);
};

export const Baslik: React.FC<{children: React.ReactNode; boyut?: number; renk?: string; style?: React.CSSProperties}> = ({children, boyut = 110, renk = R.siyah, style}) => (
  <div style={{fontFamily: FONT, fontWeight: 900, fontSize: boyut, letterSpacing: -4, lineHeight: 1.02, color: renk, ...style}}>{children}</div>
);
export const Etiket: React.FC<{children: React.ReactNode; renk?: string; style?: React.CSSProperties}> = ({children, renk = R.sari, style}) => (
  <div style={{display: "inline-block", background: renk, color: R.siyah, fontFamily: FONT, fontWeight: 900, fontSize: 40, letterSpacing: -1, padding: "10px 24px", border: `6px solid ${R.siyah}`, borderRadius: 16, boxShadow: `6px 6px 0 ${R.siyah}`, ...style}}>{children}</div>
);
export const Gorunur: React.FC<{an: number; children: React.ReactNode; style?: React.CSSProperties}> = ({an, children, style}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - an, fps, config: {damping: 12, stiffness: 200}});
  return <div style={{opacity: f >= an ? 1 : 0, transform: `translateY(${(1 - s) * 60}px) scale(${0.9 + s * 0.1})`, ...style}}>{children}</div>;
};
export const Konum: React.FC<{x: number; y: number; children: React.ReactNode}> = ({x, y, children}) => (
  <div style={{position: "absolute", left: x, top: y}}>{children}</div>
);
export const Isin: React.FC<{boyut: number; renk?: string}> = ({boyut, renk = R.sari}) => {
  const f = useCurrentFrame();
  const n = 14;
  const grad = Array.from({length: n}).map((_, i) => `${renk} ${(i * 360) / n}deg ${(i * 360) / n + 180 / n}deg, transparent ${(i * 360) / n + 180 / n}deg ${((i + 1) * 360) / n}deg`).join(",");
  const m = "radial-gradient(circle, black 35%, transparent 70%)";
  return <div style={{width: boyut, height: boyut, borderRadius: "50%", background: `conic-gradient(${grad})`, transform: `rotate(${f * 0.8}deg)`, opacity: 0.55, maskImage: m, WebkitMaskImage: m}} />;
};
export const Yazilan: React.FC<{an: number; metin: string}> = ({an, metin}) => {
  const f = useCurrentFrame();
  const n = Math.max(0, Math.min(metin.length, Math.floor((f - an) / 3) + 1));
  return (
    <span>
      {f >= an ? metin.slice(0, n) : ""}
      <span style={{opacity: Math.floor(f / 8) % 2 === 0 ? 1 : 0}}>|</span>
    </span>
  );
};

// Ortak kapanış (CTA): yorum kutusu + rehber listesi + zil + damga
export const CTA: React.FC<{
  kelime: string; // yazılacak anahtar kelime
  yazAn: number;
  rehberBaslik: string;
  rehberAn: number;
  maddeler: {metin: string; an: number}[];
  hemenAn: number;
  sonAn: number;
}> = ({kelime, yazAn, rehberBaslik, rehberAn, maddeler, hemenAn, sonAn}) => (
  <>
    <Konum x={100} y={150}>
      <Kart giris={0} yon="olcek" style={{padding: "36px 46px", width: 880}}>
        <div style={{display: "flex", alignItems: "center", gap: 18}}>
          <Img src={staticFile("ikon/speech_balloon.png")} style={{width: 76, height: 76}} />
          <Baslik boyut={44} renk={R.gri} style={{letterSpacing: -1}}>YORUMLARA YAZ</Baslik>
        </div>
        <div style={{marginTop: 22, border: `6px solid ${R.siyah}`, borderRadius: 20, padding: "16px 30px", background: R.turuncu, color: R.zemin, fontFamily: MONO, fontWeight: 700, fontSize: 104}}>
          <Yazilan an={yazAn} metin={kelime} />
        </div>
      </Kart>
    </Konum>
    <Konum x={850} y={60}><Hareketli ad="yazan_el" giris={yazAn} boyut={170} /></Konum>
    <Konum x={100} y={600}>
      <Kart giris={rehberAn} style={{padding: "34px 46px", width: 880}}>
        <Etiket>{rehberBaslik}</Etiket>
        {maddeler.map((m, i) => (
          <Gorunur key={i} an={m.an}>
            <div style={{display: "flex", alignItems: "center", gap: 24, marginTop: 22}}>
              <Hareketli ad="tik" giris={m.an} boyut={78} />
              <Baslik boyut={52} style={{letterSpacing: -2}}>{m.metin}</Baslik>
            </div>
          </Gorunur>
        ))}
      </Kart>
    </Konum>
    <Konum x={800} y={1000}><Hareketli ad="zil" giris={hemenAn} boyut={200} /></Konum>
    <Konum x={60} y={1230}><Hareketli ad="konfeti" giris={sonAn} boyut={190} /></Konum>
    <Damga giris={hemenAn} metin="HEMEN GÖNDERİYORUM" renk={R.sari} yaziRengi={R.siyah} aci={-4} boyut={50} style={{top: 1110, left: 60}} />
  </>
);
