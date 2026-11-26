import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from "remotion";
import kelimeler from "../../public/VID_001/kelimeler.json";
import {Altyazi} from "../ortak/Altyazi";
import {Damga, sarsinti} from "../ortak/Damga";
import {Kart} from "../ortak/Kart";
import {Sahne} from "../ortak/Sahne";
import {Zemin} from "../ortak/Zemin";
import {FONT, Kelime, MONO, R, kare} from "../ortak/stil";

const K = kelimeler as Kelime[];
const t = (kelime: string, sira = 0) => {
  const bul = K.filter((k) => k.kelime.replace(/[.,!?]/g, "") === kelime)[sira];
  if (!bul) throw new Error(`Kelime yok: ${kelime}`);
  return kare(bul.baslangic);
};

const SON_SES = kare(K[K.length - 1].bitis);
export const VID001_SURE = SON_SES + 20;

const SINIR = [0, t("devletin"), t("Sağlık"), t("zamanında"), t("Yorumlara"), VID001_SURE];

const Baslik: React.FC<{children: React.ReactNode; boyut?: number; renk?: string; style?: React.CSSProperties}> = ({children, boyut = 110, renk = R.siyah, style}) => (
  <div style={{fontFamily: FONT, fontWeight: 900, fontSize: boyut, letterSpacing: -4, lineHeight: 1.02, color: renk, ...style}}>{children}</div>
);

const Etiket: React.FC<{children: React.ReactNode; renk?: string; style?: React.CSSProperties}> = ({children, renk = R.sari, style}) => (
  <div
    style={{
      display: "inline-block",
      background: renk,
      color: R.siyah,
      fontFamily: FONT,
      fontWeight: 900,
      fontSize: 40,
      letterSpacing: -1,
      padding: "10px 24px",
      border: `6px solid ${R.siyah}`,
      borderRadius: 16,
      ...style,
    }}
  >
    {children}
  </div>
);

const Gorunur: React.FC<{an: number; children: React.ReactNode}> = ({an, children}) => {
  const f = useCurrentFrame();
  const y = interpolate(f - an, [0, 6], [40, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return <div style={{opacity: f >= an ? 1 : 0, transform: `translateY(${y}px)`}}>{children}</div>;
};

// Sahne 1: Hook
const S1: React.FC<{o: number}> = ({o}) => (
  <AbsoluteFill style={{alignItems: "center", paddingTop: 260}}>
    <Kart giris={0} yon="olcek" style={{padding: "22px 40px", display: "flex", alignItems: "center", gap: 20}}>
      <div style={{width: 34, height: 34, borderRadius: 17, background: R.turuncu, border: `5px solid ${R.siyah}`}} />
      <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 52, color: R.siyah}}>e-Devlet</div>
    </Kart>
    <Kart giris={t("adına") - o} style={{marginTop: 70, padding: "60px 70px", width: 860}}>
      <Gorunur an={t("adına") - o}><Baslik>ADINA</Baslik></Gorunur>
      <Gorunur an={t("birikmiş") - o}><Baslik>BİRİKMİŞ</Baslik></Gorunur>
      <Gorunur an={t("birikmiş") - o + 6}><Baslik renk={R.gri} boyut={70} style={{marginTop: 20}}>bir para olabilir</Baslik></Gorunur>
    </Kart>
    <Damga giris={t("haberin") - o} metin="HABERİN BİLE YOK" aci={-7} style={{top: 1050}} />
  </AbsoluteFill>
);

// Sahne 2: Devletin sana ödemeyi beklediği para
const Sayac: React.FC<{bas: number; dur: number}> = ({bas, dur}) => {
  const f = useCurrentFrame();
  const kilitli = f >= dur;
  const rakam = (n: number) => String((Math.floor(f / 2) * 7 + n * 3) % 10);
  return (
    <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 150, color: R.siyah, letterSpacing: -4}}>
      ₺{f < bas ? "0.000" : kilitli ? "?.???" : `${rakam(1)}.${rakam(2)}${rakam(3)}${rakam(4)}`}
    </div>
  );
};
const S2: React.FC<{o: number}> = ({o}) => (
  <AbsoluteFill style={{alignItems: "center", paddingTop: 280}}>
    <Gorunur an={0}><Baslik boyut={90} style={{textAlign: "center"}}>DEVLET SANA</Baslik></Gorunur>
    <Kart giris={2} yon="olcek" style={{marginTop: 60, padding: "50px 70px", width: 860, textAlign: "center"}}>
      <Sayac bas={4} dur={t("para", 0) - o} />
      <Gorunur an={t("ödemeyi") - o}><Etiket style={{marginTop: 30}}>ÖDEME BEKLİYOR</Etiket></Gorunur>
    </Kart>
    <Damga giris={t("para", 0) - o} metin="SENİN PARAN" aci={5} boyut={76} style={{top: 1080}} />
  </AbsoluteFill>
);

// Sahne 3: Üç unutulan alacak
const Madde: React.FC<{no: string; metin: string; an: number; yon: "sol" | "sag"}> = ({no, metin, an, yon}) => (
  <Kart giris={an} yon={yon} style={{padding: "36px 44px", width: 900, display: "flex", alignItems: "center", gap: 34, marginBottom: 50}}>
    <div style={{flexShrink: 0, width: 96, height: 96, borderRadius: 24, background: R.sari, border: `6px solid ${R.siyah}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 56}}>{no}</div>
    <Baslik boyut={58} style={{letterSpacing: -2}}>{metin}</Baslik>
  </Kart>
);
const S3: React.FC<{o: number}> = ({o}) => (
  <AbsoluteFill style={{alignItems: "center", paddingTop: 210}}>
    <Gorunur an={0}><Baslik boyut={46} renk={R.gri} style={{marginBottom: 50, letterSpacing: -1}}>UNUTULAN ALACAKLAR</Baslik></Gorunur>
    <Madde no="1" metin="Sağlık iadeleri" an={0} yon="sol" />
    <Madde no="2" metin="Eski sigorta alacakları" an={t("eski") - o} yon="sag" />
    <Madde no="3" metin="Otomatik emeklilik kesintileri" an={t("unutulan", 0) - o} yon="sol" />
    <Damga giris={t("kesintileri") - o} metin="UNUTULDU" aci={-8} style={{top: 1180, right: 90}} />
  </AbsoluteFill>
);

// Sahne 4: Zamanaşımı
const Bar: React.FC<{bas: number; son: number}> = ({bas, son}) => {
  const f = useCurrentFrame();
  const oran = interpolate(f, [bas, son], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return (
    <div style={{width: 720, height: 70, border: `7px solid ${R.siyah}`, borderRadius: 20, overflow: "hidden", marginTop: 40, background: R.zemin}}>
      <div style={{width: `${oran * 100}%`, height: "100%", background: R.siyah}} />
    </div>
  );
};
const S4: React.FC<{o: number}> = ({o}) => (
  <AbsoluteFill style={{alignItems: "center", paddingTop: 300}}>
    <Kart giris={0} yon="olcek" style={{padding: "60px 70px", width: 860, display: "flex", flexDirection: "column", alignItems: "center"}}>
      <Gorunur an={0}><Baslik boyut={60} renk={R.gri} style={{letterSpacing: -1}}>ZAMANINDA ÇEKİLMEZSE</Baslik></Gorunur>
      <Gorunur an={t("zamanaşımına") - o}><Baslik boyut={92} style={{marginTop: 30}}>ZAMANAŞIMI</Baslik></Gorunur>
      <Bar bas={t("zamanaşımına") - o} son={t("devlete") - o} />
    </Kart>
    <Damga giris={t("devlete") - o} metin="DEVLETE GEÇİYOR" aci={-5} boyut={70} style={{top: 1060}} />
  </AbsoluteFill>
);

// Sahne 5: CTA
const Yazilan: React.FC<{an: number; metin: string}> = ({an, metin}) => {
  const f = useCurrentFrame();
  const n = Math.max(0, Math.min(metin.length, Math.floor((f - an) / 2) + 1));
  const imlec = Math.floor(f / 8) % 2 === 0;
  return (
    <span>
      {f >= an ? metin.slice(0, n) : ""}
      <span style={{opacity: imlec ? 1 : 0}}>|</span>
    </span>
  );
};
const Tik: React.FC<{an: number; metin: string}> = ({an, metin}) => (
  <Gorunur an={an}>
    <div style={{display: "flex", alignItems: "center", gap: 26, marginTop: 26}}>
      <div style={{width: 64, height: 64, borderRadius: 16, background: R.sari, border: `6px solid ${R.siyah}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 40}}>✓</div>
      <Baslik boyut={54} style={{letterSpacing: -2}}>{metin}</Baslik>
    </div>
  </Gorunur>
);
const S5: React.FC<{o: number}> = ({o}) => (
  <AbsoluteFill style={{alignItems: "center", paddingTop: 200}}>
    <Kart giris={0} yon="olcek" style={{padding: "40px 50px", width: 880}}>
      <Baslik boyut={44} renk={R.gri} style={{letterSpacing: -1}}>YORUMLARA YAZ</Baslik>
      <div style={{marginTop: 24, border: `6px solid ${R.siyah}`, borderRadius: 20, padding: "20px 30px", background: R.turuncu, color: R.zemin, fontFamily: MONO, fontWeight: 700, fontSize: 96}}>
        <Yazilan an={t("PARA") - o} metin="PARA" />
      </div>
    </Kart>
    <Kart giris={t("e-Devlet'ten") - o} style={{marginTop: 60, padding: "40px 50px", width: 880}}>
      <Etiket>e-Devlet REHBERİ</Etiket>
      <Tik an={t("unutulan", 1) - o} metin="Unutulan paranı bul" />
      <Tik an={t("sorgulama") - o} metin="Saniyeler içinde sorgula" />
      <Tik an={t("çekme") - o} metin="Hesabına çek" />
    </Kart>
    <Damga giris={t("hemen") - o} metin="HEMEN GÖNDERİYORUM" renk={R.sari} yaziRengi={R.siyah} aci={-4} boyut={52} style={{top: 1170}} />
  </AbsoluteFill>
);

const SAHNELER = [S1, S2, S3, S4, S5];
const DAMGALAR = [t("haberin"), t("para", 0), t("kesintileri"), t("devlete"), t("hemen")];

export const VID001: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Zemin />
      <AbsoluteFill style={{transform: sarsinti(f, DAMGALAR)}}>
        {SAHNELER.map((S, i) => {
          const bas = SINIR[i];
          const sure = SINIR[i + 1] - bas;
          return (
            <Sequence key={i} from={bas} durationInFrames={sure} layout="none">
              <Sahne sure={sure} sonGecis={i < SAHNELER.length - 1}>
                <S o={bas} />
              </Sahne>
            </Sequence>
          );
        })}
      </AbsoluteFill>
      <Altyazi kelimeler={K} vurgu={["PARA"]} />
      <Audio src={staticFile("VID_001/ses.mp3")} />
    </AbsoluteFill>
  );
};
