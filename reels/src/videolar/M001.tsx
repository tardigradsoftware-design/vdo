// VID_001 — "Unutulan para" | Kreatif plan: Hook (dijital arayüz) → Metafor (bekleyen para) → İnfografik (3 kalem)
// → Risk (zamanaşımı, para geri akar) → CTA (yorum kutusu + rehber). Sadece motor bileşenleri kullanılır.
import {AbsoluteFill, interpolate, useCurrentFrame} from "remotion";
import kelimeler from "../../public/VID_001/kelimeler.json";
import {Kamera, Katman} from "../motor/Kamera";
import {Maskot} from "../motor/Maskot";
import {EGRI, FONT, R} from "../motor/marka";
import {Banknot, Bariyer, BilgiKarti, Bina, Cuzdan, G, Ikon, KumSaati, Rehber, Sahne, Takvim, Telefon, YorumKutusu, Zemin} from "../motor/nesneler";
import {Baslik, Cip, Isaret} from "../motor/Tipografi";
import {MotorVideo, SahneTanim} from "../motor/Video";
import {Kelime, ilerle, kare, zamanlayici} from "../motor/zaman";

const K = kelimeler as Kelime[];
const t = zamanlayici(K);
export const M001_SURE = kare(K[K.length - 1].bitis) + 27;
const B = [0, t("devletin"), t("Sağlık"), t("zamanında"), t("Yorumlara"), M001_SURE];
const Ust: React.FC<{children: React.ReactNode; y?: number}> = ({children, y = 290}) => <div style={{position: "absolute", left: 80, right: 160, top: y}}>{children}</div>;
// Yol boyunca uçan nesne
const uc = (p: number, a: [number, number], b: [number, number], tepe: number) => [a[0] + (b[0] - a[0]) * p, a[1] + (b[1] - a[1]) * p - Math.sin(p * Math.PI) * tepe] as const;

// S1 HOOK — dijital arayüz: gizli bakiye
const S1: React.FC = () => {
  const f = useCurrentFrame(); const o = B[0];
  const ac = ilerle(f, t("birikmiş") - o, 14);
  const zil = ilerle(f, t("haberin") - o, 10, EGRI.geri);
  return (
    <AbsoluteFill>
      <Zemin />
      <Kamera anahtarlar={[{f: 0, s: 1.5, y: 60}, {f: 14, s: 1.0, y: 0, egri: EGRI.snap}, {f: t("haberin") - o, s: 1.04, r: 0}, {f: t("haberin") - o + 8, s: 1.1, r: -2, egri: EGRI.snap}, {f: B[1] - o, s: 1.16, y: 60, r: 0, egri: EGRI.ivme}]}>
        <Katman derinlik={0.4}><Sahne><circle cx={540} cy={1000} r={520} fill={R.zemin2} /></Sahne></Katman>
        <Katman>
          <Sahne>
            <Telefon x={520} y={990} s={0.6}>
              <rect x={0} y={0} width={524} height={120} fill={R.marka} />
              <text x={40} y={82} fontFamily={FONT.baslik} fontWeight={800} fontSize={40} fill="#fff">Hesabım</text>
              <rect x={30} y={160} width={464} height={330} rx={34} fill={R.zemin} />
              <text x={60} y={220} fontFamily={FONT.govde} fontWeight={800} fontSize={28} fill={R.gri}>Adınıza kayıtlı alacak</text>
              <text x={60} y={320} fontFamily={FONT.sayi} fontWeight={800} fontSize={78} fill={R.para} opacity={ac}>₺</text>
              {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={130 + i * 52} cy={296} r={16 * ilerle(f, t("birikmiş") - o + 4 + i * 2, 8, EGRI.geri)} fill={R.murekkep} />)}
              <rect x={60} y={380} width={404} height={74} rx={37} fill={R.para} opacity={0.15 + ac * 0.85} />
              <text x={262} y={428} textAnchor="middle" fontFamily={FONT.govde} fontWeight={800} fontSize={30} fill="#fff" opacity={ac}>Ödeme bekliyor</text>
              {[0, 1, 2].map((i) => <rect key={i} x={30} y={530 + i * 150} width={464} height={120} rx={28} fill={R.zemin} />)}
              <G x={440} y={60} s={zil}><circle r={34} fill={R.risk} /><path d="M-14 8 C-14 -18 14 -18 14 8 L18 12 L-18 12 Z M-5 16 a5 5 0 0 0 10 0" fill="#fff" /><path d="M-20 -20 L20 20" stroke="#fff" strokeWidth={6} strokeLinecap="round" /></G>
            </Telefon>
          </Sahne>
        </Katman>
      </Kamera>
      <Ust>
        <Baslik metin="ADINA *BİRİKMİŞ" an={t("adına") - o} boyut={112} mod="yumruk" aralik={4} />
        <div style={{fontFamily: FONT.baslik, fontWeight: 800, fontSize: 84, color: R.murekkep, marginTop: 6, opacity: f >= t("haberin") - o ? 1 : 0}}>
          <Isaret an={t("haberin") - o + 2}>haberin yok</Isaret>
        </div>
      </Ust>
      <Maskot x={800} y={1150} olcek={0.9} poz="sasir" an={t("haberin") - o} giris="sag" />
    </AbsoluteFill>
  );
};

// S2 METAFOR — devlet seni bekleyen bir ödemeyle bekliyor
const S2: React.FC = () => {
  const f = useCurrentFrame(); const o = B[1];
  const akis = (i: number) => {
    const p = ilerle(f, t("ödemeyi") - o + i * 6, 26, EGRI.yumusak);
    if (p <= 0) return null;
    const [x, y] = uc(p, [290, 930], [770, 1130], 300);
    return <Banknot key={i} x={x} y={y} s={0.8} r={-20 + p * 40} o={p < 1 ? 1 : 0} />;
  };
  const para = ilerle(f, t("para") - o, 10, EGRI.geri);
  return (
    <AbsoluteFill>
      <Zemin />
      <Kamera anahtarlar={[{f: 0, x: -110, s: 1.08}, {f: B[2] - o, x: 110, s: 1.0}]}>
        <Katman derinlik={0.3}><Sahne><circle cx={770} cy={1140} r={340} fill={R.zemin2} /></Sahne></Katman>
        <Katman>
          <Sahne>
            <path d="M 290 930 Q 520 600 770 1130" stroke={R.gri} strokeWidth={6} strokeDasharray="4 18" strokeLinecap="round" fill="none" opacity={ilerle(f, 4, 14)} />
            <Bina x={290} y={1200} s={0.95} />
            <Cuzdan x={770} y={1160} s={1.0} bos={f < t("para") - o} />
            <KumSaati x={880} y={880} s={0.6} p={ilerle(f, 0, B[2] - o, (x) => x)} />
            {[0, 1, 2].map(akis)}
            <G x={770} y={950} s={para * 1.3}><rect x={-120} y={-44} width={240} height={88} rx={44} fill={R.para} /><text y={18} textAnchor="middle" fontFamily={FONT.baslik} fontWeight={800} fontSize={52} fill="#fff">PARA</text></G>
          </Sahne>
        </Katman>
      </Kamera>
      <Ust>
        <Baslik metin="DEVLET SANA" an={t("devletin") - o} boyut={96} />
        <div style={{fontFamily: FONT.baslik, fontWeight: 800, fontSize: 96, color: R.murekkep, lineHeight: 1.05, opacity: f >= t("ödemeyi") - o ? 1 : 0}}>
          ödemeyi <Isaret an={t("beklediği") - o}>bekliyor</Isaret>
        </div>
      </Ust>
    </AbsoluteFill>
  );
};

// S3 İNFOGRAFİK — alacak türleri, kartlar sırayla gelir; kamera aşağı iner
const S3: React.FC = () => {
  const f = useCurrentFrame(); const o = B[2];
  const kart = (an: number, y: number, yon: number) => {
    const p = ilerle(f, an - o, 14, EGRI.geri);
    return {x: 540 + (1 - p) * 900 * yon, y, o: f < an - o ? 0 : 1};
  };
  const vurgu = ilerle(f, t("kesintileri") - o, 10);
  const k1 = kart(t("Sağlık"), 640, -1), k2 = kart(t("eski"), 880, 1), k3 = kart(t("unutulan", 0), 1120, -1);
  return (
    <AbsoluteFill>
      <Zemin />
      <Kamera anahtarlar={[{f: 0, y: -140, s: 1.06}, {f: t("eski") - o, y: -40, s: 1.04}, {f: t("unutulan", 0) - o, y: 40, s: 1.02}, {f: B[3] - o, y: 70, s: 1.0, r: 1.5}]}>
        <Katman derinlik={0.25}><Sahne><text x={980} y={1300} textAnchor="end" fontFamily={FONT.baslik} fontWeight={800} fontSize={760} fill={R.zemin2}>?</text></Sahne></Katman>
        <Katman>
          <Sahne>
            {[k1, k2, k3].map((k, i) => vurgu > 0 && <rect key={i} x={k.x - 392} y={k.y - 92} width={784} height={174} rx={42} fill="none" stroke={R.vurgu} strokeWidth={10 * vurgu} />)}
            <BilgiKarti x={k1.x} y={k1.y} o={k1.o} baslik="Sağlık iadeleri" ikon={Ikon.arti} renk={R.para} />
            <BilgiKarti x={k2.x} y={k2.y} o={k2.o} baslik="Eski sigorta alacakları" ikon={Ikon.kalkan} renk={R.marka} />
            <BilgiKarti x={k3.x} y={k3.y} o={k3.o} baslik="Emeklilik kesintileri" ikon={Ikon.yuzde} renk={R.murekkep} />
          </Sahne>
        </Katman>
      </Kamera>
      <Ust>
        <Cip an={4} zemin={R.vurgu} renk={R.murekkep}>UNUTULAN ALACAKLAR</Cip>
      </Ust>
      <Maskot x={830} y={430} olcek={0.55} poz="incele" yon={130} an={t("unutulan", 0) - o - 6} giris="sag" />
    </AbsoluteFill>
  );
};

// S4 RİSK — süre biter, para devlete geri akar
const S4: React.FC = () => {
  const f = useCurrentFrame(); const o = B[3];
  const za = t("zamanaşımına") - o, dv = t("devlete") - o;
  const gun = f < za ? String(30 - Math.min(29, Math.floor(f / 1.3))).padStart(2, "0") : "00";
  const z = ilerle(f, za, 7, EGRI.snap);
  const sars = f >= za && f < za + 10 ? Math.sin((f - za) * 2.5) * 10 * (1 - (f - za) / 10) : 0;
  const geri = (i: number) => {
    const p = ilerle(f, dv + i * 5, 22, EGRI.yumusak);
    if (p <= 0 || p >= 1) return null;
    const [x, y] = uc(p, [800, 1220], [420, 1180], 260);
    return <Banknot key={i} x={x} y={y} s={0.5} r={p * -30} />;
  };
  return (
    <AbsoluteFill style={{translate: `${sars}px 0`}}>
      <Zemin />
      <Kamera anahtarlar={[{f: 0, s: 1.14, y: -60}, {f: za, s: 1.0, y: 0, egri: EGRI.snap}, {f: B[4] - o, s: 1.03, x: -20}]}>
        <Katman>
          <Sahne>
            <Takvim x={560} y={720} s={0.95} r={-4} gun={gun} />
            <Bariyer x={430} y={1190} s={0.65} p={1 - z} />
            <Bina x={420} y={1300} s={0.5} />
            <Cuzdan x={800} y={1230} s={0.55} bos={f >= dv + 10} />
            {[0, 1, 2].map(geri)}
          </Sahne>
        </Katman>
      </Kamera>
      <Ust>
        <Baslik metin="ZAMANINDA ÇEKİLMEZSE" an={0} boyut={80} />
      </Ust>
      <div style={{position: "absolute", left: 80, right: 160, top: 930, display: "flex", justifyContent: "center", opacity: f >= za ? 1 : 0, scale: `${1.6 - z * 0.6}`}}>
        <div style={{background: R.risk, color: "#fff", fontFamily: FONT.baslik, fontWeight: 800, fontSize: 92, padding: "6px 30px 14px", borderRadius: 20, rotate: "-3deg", boxShadow: "0 20px 40px rgba(255,74,61,0.35)"}}>ZAMANAŞIMI</div>
      </div>
      <div style={{position: "absolute", left: 80, right: 160, top: 1060, display: "flex", justifyContent: "center"}}>
        <Cip an={dv} zemin={R.murekkep} boyut={44}>→ devlete geçiyor</Cip>
      </div>
      <Maskot x={880} y={1010} olcek={0.46} poz="uyari" an={za} giris="olcek" />
    </AbsoluteFill>
  );
};

// S5 CTA — yorum kutusu + rehber; maskot yönlendirir
const S5: React.FC = () => {
  const f = useCurrentFrame(); const o = B[4];
  const ya = t("PARA") - o;
  const n = Math.max(0, Math.min(4, Math.floor((f - ya) / 2) + 1));
  const gonder = t("yaz") - o;
  const bas = f >= gonder && f < gonder + 6 ? 0.85 : 1;
  const rh = t("rehberini") - o, hm = t("hemen") - o;
  const poz = f >= hm ? "onay" : f >= rh ? "tut" : "isaret";
  return (
    <AbsoluteFill>
      <Zemin />
      <Kamera anahtarlar={[{f: 0, s: 1.08}, {f: B[5] - o, s: 1.0, y: 10}]}>
        <Katman derinlik={0.3}><Sahne><circle cx={500} cy={1020} r={470} fill={R.zemin2} /></Sahne></Katman>
        <Katman>
          <Sahne>
            <YorumKutusu x={500} y={700} s={ilerle(f, 2, 12, EGRI.geri)} yazi={f >= ya ? "PARA".slice(0, n) : ""} imlec={Math.floor(f / 8) % 2 === 0} bas={bas} />
            {f >= gonder + 3 && <G x={820} y={600} s={ilerle(f, gonder + 3, 10, EGRI.geri)}><circle r={30} fill={R.risk} /><text y={11} textAnchor="middle" fontFamily={FONT.govde} fontWeight={800} fontSize={30} fill="#fff">1</text></G>}
          </Sahne>
        </Katman>
      </Kamera>
      <Ust>
        <Baslik metin="YORUMLARA *YAZ" an={2} boyut={100} mod="karakter" />
      </Ust>
      <div style={{position: "absolute", left: 500, right: 150, top: 900, display: "flex", flexDirection: "column", gap: 26, alignItems: "flex-start"}}>
        <Cip an={t("saniyeler") - o} zemin={R.marka} boyut={42}>⏱ saniyeler içinde</Cip>
        <Cip an={t("sorgulama") - o} boyut={42}>1 · Sorgula</Cip>
        <Cip an={t("çekme") - o} zemin={R.para} boyut={42}>2 · Hesabına çek</Cip>
      </div>
      <Maskot x={260} y={1150} olcek={0.95} poz={poz} yon={-55} an={4} giris="sol" esya={f >= rh ? <Rehber x={10} y={-120} s={0.55} r={-8} /> : undefined} />
    </AbsoluteFill>
  );
};

const sahneler: SahneTanim[] = [
  {ad: "hook-arayuz", bas: B[0], son: B[1], S: S1},
  {ad: "metafor-bekleyen-para", bas: B[1], son: B[2], S: S2},
  {ad: "infografik-alacaklar", bas: B[2], son: B[3], S: S3},
  {ad: "risk-zamanasimi", bas: B[3], son: B[4], S: S4},
  {ad: "cta-yorum", bas: B[4], son: B[5], S: S5},
];
export const M001: React.FC = () => (
  <MotorVideo
    sahneler={sahneler}
    gecisler={[{an: B[1], tip: "iris", x: 540, y: 980, renk: R.murekkep}, {an: B[2], tip: "panel"}, {an: B[3], tip: "flas"}, {an: B[4], tip: "panel", renk: R.para}]}
    K={K}
    altyaziGizli={[[t("devlete"), B[4]]]}
    anahtar={["birikmiş", "para", "unutulan", "zamanaşımına", "devlete", "para"]}
    anlatim="VID_001/ses.mp3"
    muzik="VID_001/muzik_motor.wav"
    efektler={[
      {ad: "darbe", an: 0}, {ad: "reveal", an: t("birikmiş")}, {ad: "pop", an: t("haberin")},
      {ad: "whoosh", an: B[1] - 8}, {ad: "kagit", an: t("ödemeyi")}, {ad: "tik", an: t("beklediği")}, {ad: "pop", an: t("para")},
      {ad: "supurme", an: B[2] - 8}, {ad: "pop", an: t("Sağlık")}, {ad: "pop", an: t("eski")}, {ad: "pop", an: t("unutulan", 0)}, {ad: "tik", an: t("kesintileri")},
      {ad: "vurgu", an: B[3]}, {ad: "alcak", an: t("zamanaşımına")}, {ad: "whoosh", an: t("devlete")},
      {ad: "supurme", an: B[4] - 8}, ...[0, 2, 4, 6].map((d) => ({ad: "tik" as const, an: t("PARA") + d})), {ad: "bildirim", an: t("yaz")},
      {ad: "pop", an: t("saniyeler")}, {ad: "pop", an: t("sorgulama")}, {ad: "pop", an: t("çekme")}, {ad: "reveal", an: t("rehberini")}, {ad: "vurgu", an: t("hemen")},
    ]}
  />
);
// kullanılmayan import uyarısını önle
void interpolate;
