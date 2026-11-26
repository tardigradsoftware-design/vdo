import {AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import kelimeler from "../../public/VID_001/kelimeler.json";
import {Altyazi} from "../ortak/Altyazi";
import {Damga, sarsinti} from "../ortak/Damga";
import {Ikon, Yagmur} from "../ortak/Ikon";
import {Ilerleme} from "../ortak/Ilerleme";
import {Hareketli} from "../ortak/Hareketli";
import {Fosfor, Harfler} from "../ortak/Harfler";
import {Kart} from "../ortak/Kart";
import {Sahne} from "../ortak/Sahne";
import {MuzikYatagi, Sfx} from "../ortak/Sfx";
import {Zemin} from "../ortak/Zemin";
import {FONT, Kelime, MONO, R, kare} from "../ortak/stil";

const K = kelimeler as Kelime[];
const t = (kelime: string, sira = 0) => {
  const bul = K.filter((k) => k.kelime.replace(/[.,!?]/g, "") === kelime)[sira];
  if (!bul) throw new Error(`Kelime yok: ${kelime}`);
  return kare(bul.baslangic);
};

const SON_SES = kare(K[K.length - 1].bitis);
export const VID001_SURE = SON_SES + 24;
const SINIR = [0, t("devletin"), t("Sağlık"), t("zamanında"), t("Yorumlara"), VID001_SURE];

const Baslik: React.FC<{children: React.ReactNode; boyut?: number; renk?: string; style?: React.CSSProperties}> = ({children, boyut = 110, renk = R.siyah, style}) => (
  <div style={{fontFamily: FONT, fontWeight: 900, fontSize: boyut, letterSpacing: -4, lineHeight: 1.02, color: renk, ...style}}>{children}</div>
);
const Etiket: React.FC<{children: React.ReactNode; renk?: string; style?: React.CSSProperties}> = ({children, renk = R.sari, style}) => (
  <div style={{display: "inline-block", background: renk, color: R.siyah, fontFamily: FONT, fontWeight: 900, fontSize: 40, letterSpacing: -1, padding: "10px 24px", border: `6px solid ${R.siyah}`, borderRadius: 16, ...style}}>{children}</div>
);
const Gorunur: React.FC<{an: number; children: React.ReactNode; style?: React.CSSProperties}> = ({an, children, style}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - an, fps, config: {damping: 12, stiffness: 200}});
  return <div style={{opacity: f >= an ? 1 : 0, transform: `translateY(${(1 - s) * 60}px) scale(${0.9 + s * 0.1})`, ...style}}>{children}</div>;
};
const Konum: React.FC<{x: number; y: number; children: React.ReactNode}> = ({x, y, children}) => (
  <div style={{position: "absolute", left: x, top: y}}>{children}</div>
);

// Dönen ışın patlaması (ikon arkası)
const Isin: React.FC<{boyut: number; renk?: string}> = ({boyut, renk = R.sari}) => {
  const f = useCurrentFrame();
  const kollar = 14;
  const grad = Array.from({length: kollar}).map((_, i) => `${renk} ${(i * 360) / kollar}deg ${(i * 360) / kollar + 360 / kollar / 2}deg, transparent ${(i * 360) / kollar + 360 / kollar / 2}deg ${((i + 1) * 360) / kollar}deg`).join(",");
  return <div style={{width: boyut, height: boyut, borderRadius: "50%", background: `conic-gradient(${grad})`, transform: `rotate(${f * 0.8}deg)`, opacity: 0.55, maskImage: "radial-gradient(circle, black 35%, transparent 70%)", WebkitMaskImage: "radial-gradient(circle, black 35%, transparent 70%)"}} />;
};

// ---------------- Sahne 1: Hook ----------------
const S1: React.FC<{o: number}> = ({o}) => (
  <AbsoluteFill>
    <Yagmur ad="coin" bas={6} adet={9} boyut={100} sure={70} />
    <Konum x={290} y={150}><Isin boyut={500} /></Konum>
    <Konum x={380} y={230}><Ikon ad="money_bag" giris={0} boyut={330} /></Konum>
    <Konum x={110} y={250}>
      <Kart giris={2} yon="sol" style={{padding: "14px 28px", display: "flex", alignItems: "center", gap: 14}}>
        <div style={{width: 26, height: 26, borderRadius: 13, background: R.turuncu, border: `4px solid ${R.siyah}`}} />
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 42}}>e-Devlet</div>
      </Kart>
    </Konum>
    <Konum x={110} y={640}>
      <Kart giris={t("adına") - o} style={{padding: "50px 60px", width: 860}}>
        <Baslik><Harfler metin="ADINA" an={t("adına") - o} /></Baslik>
        <Baslik><Fosfor an={t("birikmiş") - o + 8} renk={R.sari}><Harfler metin="BİRİKMİŞ" an={t("birikmiş") - o} /></Fosfor></Baslik>
        <Gorunur an={t("ama") - o}><Baslik renk={R.gri} boyut={64} style={{marginTop: 18, letterSpacing: -2}}>bir para olabilir</Baslik></Gorunur>
      </Kart>
    </Konum>
    <Konum x={800} y={1200}><Hareketli ad="cigklik" giris={t("haberin") - o + 4} boyut={200} /></Konum>
    <Konum x={720} y={190}><Hareketli ad="parilti" giris={6} boyut={150} /></Konum>
    <Konum x={260} y={420}><Hareketli ad="parilti" giris={14} boyut={110} hiz={1.3} /></Konum>
    <Damga giris={t("haberin") - o} metin="HABERİN BİLE YOK" aci={-7} style={{top: 1080, left: 80}} />
  </AbsoluteFill>
);

// ---------------- Sahne 2: Devlet → sen ----------------
const Akis: React.FC<{bas: number}> = ({bas}) => {
  const f = useCurrentFrame();
  return (
    <>
      <div style={{position: "absolute", left: 370, top: 400, width: 340, borderTop: `7px dashed ${R.siyah}`, backgroundPosition: `${f}px 0`}} />
      {[0, 1, 2].map((i) => {
        const d = (f - bas - i * 12) % 36;
        if (f - bas - i * 12 < 0) return null;
        const x = interpolate(d, [0, 36], [340, 700]);
        const y = 330 - Math.sin((d / 36) * Math.PI) * 90;
        return <Img key={i} src={staticFile("ikon/money_with_wings.png")} style={{position: "absolute", left: x, top: y, width: 120, height: 120, transform: `rotate(${Math.sin(d / 4) * 15}deg)`}} />;
      })}
    </>
  );
};
const Sayac: React.FC<{bas: number; dur: number}> = ({bas, dur}) => {
  const f = useCurrentFrame();
  const rakam = (n: number) => String((Math.floor(f / 2) * 7 + n * 3) % 10);
  return (
    <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 150, letterSpacing: -4}}>
      ₺{f < bas ? "0.000" : f >= dur ? "?.???" : `${rakam(1)}.${rakam(2)}${rakam(3)}${rakam(4)}`}
    </div>
  );
};
const S2: React.FC<{o: number}> = ({o}) => (
  <AbsoluteFill>
    <Konum x={0} y={150}><div style={{width: 1080, textAlign: "center"}}><Gorunur an={0}><Baslik boyut={84}>DEVLET → SANA</Baslik></Gorunur></div></Konum>
    <Konum x={100} y={290}><Ikon ad="classical_building" giris={0} boyut={250} /></Konum>
    <Konum x={730} y={290}><Ikon ad="mobile_phone" giris={t("sana") - o} boyut={250} /></Konum>
    <Akis bas={t("sana") - o} />
    <Konum x={110} y={640}>
      <Kart giris={t("ödemeyi") - o} yon="olcek" style={{padding: "44px 60px", width: 860, textAlign: "center"}}>
        <Sayac bas={t("ödemeyi") - o + 4} dur={t("para", 0) - o} />
        <Gorunur an={t("beklediği") - o}><Etiket style={{marginTop: 24}}>ÖDEME BEKLİYOR</Etiket></Gorunur>
      </Kart>
    </Konum>
    <Konum x={80} y={1180}><Hareketli ad="para_yuz" giris={t("para", 0) - o + 3} boyut={190} /></Konum>
    <Konum x={470} y={350}><Hareketli ad="ucan_para" giris={t("sana") - o} boyut={140} /></Konum>
    <Damga giris={t("para", 0) - o} metin="SENİN PARAN" aci={5} boyut={80} style={{top: 1090, left: 250}} />
  </AbsoluteFill>
);

// ---------------- Sahne 3: Üç alacak ----------------
const Madde: React.FC<{no: string; metin: string; ikon: string; an: number; yon: "sol" | "sag"}> = ({no, metin, ikon, an, yon}) => (
  <Kart giris={an} yon={yon} style={{padding: "26px 36px", width: 900, display: "flex", alignItems: "center", gap: 28, marginBottom: 44}}>
    <div style={{flexShrink: 0, width: 84, height: 84, borderRadius: 22, background: R.sari, border: `6px solid ${R.siyah}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 48}}>{no}</div>
    <Baslik boyut={54} style={{letterSpacing: -2, flex: 1}}>{metin}</Baslik>
    <Ikon ad={ikon} giris={an + 5} boyut={150} />
  </Kart>
);
const S3: React.FC<{o: number}> = ({o}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{alignItems: "center", paddingTop: 150}}>
      <Gorunur an={0} style={{display: "flex", alignItems: "center", gap: 20, marginBottom: 40}}>
        <Img src={staticFile("ikon/magnifying_glass_tilted_left.png")} style={{width: 90, height: 90, transform: `rotate(${Math.sin(f / 6) * 12}deg)`}} />
        <Baslik boyut={50} renk={R.gri} style={{letterSpacing: -1}}>UNUTULAN ALACAKLAR</Baslik>
      </Gorunur>
      <Madde no="1" metin="Sağlık iadeleri" ikon="hospital" an={0} yon="sol" />
      <Madde no="2" metin="Eski sigorta alacakları" ikon="shield" an={t("eski") - o} yon="sag" />
      <Madde no="3" metin="Otomatik emeklilik kesintileri" ikon="briefcase" an={t("unutulan", 0) - o} yon="sol" />
      <div style={{position: "absolute", left: 120, top: 1140}}><Hareketli ad="unlem" giris={t("kesintileri") - o + 2} boyut={170} /></div>
      <Damga giris={t("kesintileri") - o} metin="UNUTULDU" aci={-8} boyut={72} style={{top: 1130, right: 90}} />
    </AbsoluteFill>
  );
};

// ---------------- Sahne 4: Zamanaşımı ----------------
const Bar: React.FC<{bas: number; son: number}> = ({bas, son}) => {
  const f = useCurrentFrame();
  const oran = interpolate(f, [bas, son], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return (
    <div style={{width: 720, height: 70, border: `7px solid ${R.siyah}`, borderRadius: 20, overflow: "hidden", marginTop: 34, background: R.zemin}}>
      <div style={{width: `${oran * 100}%`, height: "100%", background: R.siyah}} />
    </div>
  );
};
const UcanCanta: React.FC<{an: number}> = ({an}) => {
  const f = useCurrentFrame();
  const d = interpolate(f - an, [-14, 0], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  if (f < an - 14) return null;
  const x = interpolate(d, [0, 1], [180, 820]);
  const y = 1100 - Math.sin(d * Math.PI) * 220;
  return <Img src={staticFile("ikon/money_bag.png")} style={{position: "absolute", left: x, top: y, width: 170 * (1 - d * 0.6), height: 170 * (1 - d * 0.6), opacity: d >= 1 ? 0 : 1, transform: `rotate(${d * 360}deg)`}} />;
};
const S4: React.FC<{o: number}> = ({o}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Konum x={400} y={150}>
        <Img src={staticFile("ikon/hourglass_not_done.png")} style={{width: 280, height: 280, transform: `rotate(${f < 20 ? 0 : Math.min(180, (f - 20) * 9) + Math.sin(f / 8) * 5}deg)`}} />
      </Konum>
      <Konum x={110} y={480}>
        <Kart giris={0} yon="olcek" style={{padding: "50px 60px", width: 860, display: "flex", flexDirection: "column", alignItems: "center"}}>
          <Baslik boyut={56} renk={R.gri} style={{letterSpacing: -1}}>ZAMANINDA ÇEKİLMEZSE</Baslik>
          <Baslik boyut={92} style={{marginTop: 24}}><Harfler metin="ZAMANAŞIMI" an={t("zamanaşımına") - o} aralik={1.2} /></Baslik>
          <Bar bas={t("zamanaşımına") - o} son={t("devlete") - o} />
        </Kart>
      </Konum>
      <Konum x={790} y={950}><Ikon ad="classical_building" giris={t("uğrayıp") - o} boyut={230} /></Konum>
      <UcanCanta an={t("devlete") - o} />
      <Konum x={130} y={150}><Hareketli ad="alarm" giris={4} boyut={200} /></Konum>
      <Konum x={760} y={170}><Hareketli ad="siren" giris={t("devlete") - o} boyut={190} /></Konum>
      <Damga giris={t("devlete") - o} metin="DEVLETE GEÇİYOR" aci={-5} boyut={66} style={{top: 1220, left: 60}} />
    </AbsoluteFill>
  );
};

// ---------------- Sahne 5: CTA ----------------
const Yazilan: React.FC<{an: number; metin: string}> = ({an, metin}) => {
  const f = useCurrentFrame();
  const n = Math.max(0, Math.min(metin.length, Math.floor((f - an) / 3) + 1));
  return (
    <span>
      {f >= an ? metin.slice(0, n) : ""}
      <span style={{opacity: Math.floor(f / 8) % 2 === 0 ? 1 : 0}}>|</span>
    </span>
  );
};
const Tik: React.FC<{an: number; metin: string}> = ({an, metin}) => (
  <Gorunur an={an}>
    <div style={{display: "flex", alignItems: "center", gap: 24, marginTop: 22}}>
      <Hareketli ad="tik" giris={an} boyut={78} />
      <Baslik boyut={52} style={{letterSpacing: -2}}>{metin}</Baslik>
    </div>
  </Gorunur>
);
const S5: React.FC<{o: number}> = ({o}) => {
  return (
    <AbsoluteFill>
      <Konum x={100} y={150}>
        <Kart giris={0} yon="olcek" style={{padding: "36px 46px", width: 880}}>
          <div style={{display: "flex", alignItems: "center", gap: 18}}>
            <Img src={staticFile("ikon/speech_balloon.png")} style={{width: 76, height: 76}} />
            <Baslik boyut={44} renk={R.gri} style={{letterSpacing: -1}}>YORUMLARA YAZ</Baslik>
          </div>
          <div style={{marginTop: 22, border: `6px solid ${R.siyah}`, borderRadius: 20, padding: "16px 30px", background: R.turuncu, color: R.zemin, fontFamily: MONO, fontWeight: 700, fontSize: 104}}>
            <Yazilan an={t("PARA") - o} metin="PARA" />
          </div>
        </Kart>
      </Konum>
      <Konum x={100} y={600}>
        <Kart giris={t("e-Devlet'ten") - o} style={{padding: "34px 46px", width: 880}}>
          <Etiket>e-Devlet REHBERİ</Etiket>
          <Tik an={t("unutulan", 1) - o} metin="Unutulan paranı bul" />
          <Tik an={t("sorgulama") - o} metin="Saniyeler içinde sorgula" />
          <Tik an={t("çekme") - o} metin="Hesabına çek" />
        </Kart>
      </Konum>
      <Konum x={800} y={1000}><Hareketli ad="zil" giris={t("hemen") - o} boyut={200} /></Konum>
      <Konum x={700} y={250}><Hareketli ad="yazan_el" giris={t("PARA") - o} boyut={170} /></Konum>
      <Konum x={60} y={1230}><Hareketli ad="konfeti" giris={t("göndereyim") - o} boyut={190} /></Konum>
      <Damga giris={t("hemen") - o} metin="HEMEN GÖNDERİYORUM" renk={R.sari} yaziRengi={R.siyah} aci={-4} boyut={50} style={{top: 1110, left: 60}} />
    </AbsoluteFill>
  );
};

const SAHNELER = [S1, S2, S3, S4, S5];
const DAMGALAR = [t("haberin"), t("para", 0), t("kesintileri"), t("devlete"), t("hemen")];

const Sesler: React.FC = () => (
  <>
    <MuzikYatagi sure={VID001_SURE} />
    {SINIR.slice(1, -1).map((s, i) => <Sfx key={`w${i}`} ad="whoosh" an={s - 8} ses={0.2} />)}
    {DAMGALAR.map((d, i) => <Sfx key={`d${i}`} ad="damga" an={d} ses={0.24} />)}
    <Sfx ad="pop" an={0} />
    <Sfx ad="para" an={8} ses={0.15} />
    <Sfx ad="pop" an={t("adına")} />
    <Sfx ad="pop" an={t("sana")} />
    <Sfx ad="para" an={t("sana") + 6} ses={0.14} />
    <Sfx ad="pop" an={t("ödemeyi")} />
    {[t("Sağlık"), t("eski"), t("unutulan", 0)].map((a, i) => <Sfx key={`p${i}`} ad="pop" an={a} />)}
    <Sfx ad="yukselis" an={t("devlete") - 36} ses={0.16} />
    {[0, 3, 6, 9].map((d) => <Sfx key={`k${d}`} ad="klavye" an={t("PARA") + d} ses={0.2} />)}
    <Sfx ad="pop" an={t("e-Devlet'ten")} />
    {[t("unutulan", 1), t("sorgulama"), t("çekme")].map((a, i) => <Sfx key={`c${i}`} ad="ding" an={a} ses={0.12} />)}
  </>
);

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
      <Ilerleme />
      <Audio src={staticFile("VID_001/ses.mp3")} />
      <Sesler />
    </AbsoluteFill>
  );
};
