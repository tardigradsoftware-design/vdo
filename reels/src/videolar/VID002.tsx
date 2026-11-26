import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import kelimeler from "../../public/VID_002/kelimeler.json";
import {Damga} from "../ortak/Damga";
import {Fosfor, Harfler} from "../ortak/Harfler";
import {Hareketli} from "../ortak/Hareketli";
import {Ikon, Yagmur} from "../ortak/Ikon";
import {Kart} from "../ortak/Kart";
import {Baslik, CTA, Etiket, Gorunur, Isin, Konum, zamanlayici} from "../ortak/parcalar";
import {Sfx} from "../ortak/Sfx";
import {Video} from "../ortak/Video";
import {FONT, Kelime, MONO, R, kare} from "../ortak/stil";

const K = kelimeler as Kelime[];
const t = zamanlayici(K);
export const VID002_SURE = kare(K[K.length - 1].bitis) + 24;
const SINIR = [0, t("adına", 0), t("Çoğu"), t("Ama"), t("Yorumlara"), VID002_SURE];

// Sahne 1: Kimlik sızıntısı
const Damlalar: React.FC<{bas: number}> = ({bas}) => {
  const f = useCurrentFrame();
  return (
    <>
      {Array.from({length: 7}).map((_, i) => {
        const d = (f - bas - i * 5) % 40;
        if (f - bas - i * 5 < 0) return null;
        const x = 300 + ((i * 97) % 480);
        return (
          <div key={i} style={{position: "absolute", left: x, top: 640 + d * 14, fontFamily: MONO, fontWeight: 700, fontSize: 42, color: R.gri, opacity: 1 - d / 40}}>
            {["TC", "**", "01", "ad", "@", "#", "12"][i]}
          </div>
        );
      })}
    </>
  );
};
const S1: React.FC<{o: number}> = ({o}) => (
  <AbsoluteFill>
    <Konum x={290} y={110}><Isin boyut={500} renk={R.sari} /></Konum>
    <Konum x={360} y={180}><Ikon ad="identification_card" giris={0} boyut={360} /></Konum>
    <Damlalar bas={t("sızdıysa") - o} />
    <Konum x={110} y={560}>
      <Kart giris={2} style={{padding: "48px 60px", width: 860}}>
        <Baslik boyut={96}><Harfler metin="KİMLİK" an={t("Kimlik") - o} /></Baslik>
        <Baslik boyut={96}><Harfler metin="BİLGİLERİN" an={t("bilgilerin") - o} aralik={1} /></Baslik>
        <Baslik boyut={96}><Fosfor an={t("sızdıysa") - o + 6} renk={R.sari}><Harfler metin="SIZDIYSA" an={t("sızdıysa") - o} /></Fosfor></Baslik>
      </Kart>
    </Konum>
    <Konum x={780} y={1130}><Hareketli ad="gozler" giris={t("haberin") - o} boyut={200} /></Konum>
    <Damga giris={t("haberin") - o} metin="HABERİN BİLE YOK" aci={-6} style={{top: 1130, left: 70}} />
  </AbsoluteFill>
);

// Sahne 2: Adına şirket + borç
const BorcSayac: React.FC<{bas: number}> = ({bas}) => {
  const f = useCurrentFrame();
  const v = Math.floor(interpolate(f, [bas, bas + 40], [0, 2750000], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}));
  return <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 112, letterSpacing: -4}}>-₺{v.toLocaleString("tr-TR")}</div>;
};
const S2: React.FC<{o: number}> = ({o}) => (
  <AbsoluteFill>
    <Konum x={0} y={150}><div style={{width: 1080, textAlign: "center"}}><Baslik boyut={92}><Harfler metin="ADINA ŞİRKET" an={0} aralik={1.2} /></Baslik></div></Konum>
    <Konum x={110} y={290}><Ikon ad="bust_in_silhouette" giris={0} boyut={230} /></Konum>
    <Konum x={420} y={360}><div style={{fontFamily: FONT, fontWeight: 900, fontSize: 90}}>→</div></Konum>
    <Konum x={720} y={270}><Ikon ad="office_building" giris={t("şirket", 0) - o} boyut={260} /></Konum>
    <Konum x={110} y={620}>
      <Kart giris={t("milyonlarca") - o} yon="olcek" style={{padding: "40px 50px", width: 860, textAlign: "center"}}>
        <Baslik boyut={44} renk={R.gri} style={{letterSpacing: -1}}>MİLYONLARCA LİRA</Baslik>
        <BorcSayac bas={t("milyonlarca") - o} />
        <div style={{display: "flex", gap: 24, justifyContent: "center", marginTop: 20}}>
          <Gorunur an={t("vergi") - o}><Etiket>VERGİ</Etiket></Gorunur>
          <Gorunur an={t("icra") - o}><Etiket>İCRA</Etiket></Gorunur>
        </div>
      </Kart>
    </Konum>
    <Konum x={790} y={1150}><Hareketli ad="ates" giris={t("sokulabilirsin") - o} boyut={190} /></Konum>
    <Damga giris={t("sokulabilirsin") - o} metin="BORÇ SENDE KALIR" aci={5} boyut={66} style={{top: 1160, left: 70}} />
  </AbsoluteFill>
);

// Sahne 3: Haciz kağıdı kapıda
const HacizKagidi: React.FC<{an: number}> = ({an}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - an, fps, config: {damping: 14, stiffness: 120}});
  return (
    <div style={{position: "absolute", left: 230, top: 330, width: 620, transform: `translateY(${(1 - s) * 900}px) rotate(${(1 - s) * 25 - 4}deg)`, opacity: f < an ? 0 : 1}}>
      <Kart giris={an} yon="olcek" style={{padding: "40px 46px"}}>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 30, color: R.gri}}>T.C. İCRA DAİRESİ</div>
        <Baslik boyut={70} style={{marginTop: 14}}>HACİZ</Baslik>
        <Baslik boyut={46} style={{letterSpacing: -2}}>İHBARNAMESİ</Baslik>
        {[0, 1, 2, 3].map((i) => <div key={i} style={{height: 14, background: "#0E0E101A", borderRadius: 7, marginTop: 20, width: `${90 - i * 14}%`}} />)}
      </Kart>
    </div>
  );
};
const S3: React.FC<{o: number}> = ({o}) => (
  <AbsoluteFill>
    <Konum x={0} y={140}><div style={{width: 1080, textAlign: "center"}}><Gorunur an={0}><Baslik boyut={60} renk={R.gri} style={{letterSpacing: -1}}>ÇOĞU KİŞİ NE ZAMAN ÖĞRENİYOR?</Baslik></Gorunur></div></Konum>
    <Konum x={60} y={300}><Ikon ad="door" giris={t("kapısına") - o - 6} boyut={300} salla={false} /></Konum>
    <HacizKagidi an={t("kapısına") - o} />
    <Konum x={760} y={1140}><Hareketli ad="cigklik" giris={t("öğreniyor") - o} boyut={210} /></Konum>
    <Damga giris={t("haciz") - o} metin="HACİZ!" aci={-10} boyut={110} style={{top: 1120, left: 140}} />
  </AbsoluteFill>
);

// Sahne 4: e-Devlet kilidi
const Anahtar: React.FC<{an: number}> = ({an}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - an, fps, config: {damping: 12, stiffness: 160}});
  return (
    <div style={{width: 230, height: 120, borderRadius: 60, border: `7px solid ${R.siyah}`, background: s > 0.5 ? R.turuncu : "#E6E6E8", position: "relative", boxShadow: `8px 8px 0 ${R.siyah}`}}>
      <div style={{position: "absolute", top: 10, left: 10 + s * 110, width: 86, height: 86, borderRadius: 43, background: R.zemin, border: `7px solid ${R.siyah}`}} />
    </div>
  );
};
const S4: React.FC<{o: number}> = ({o}) => {
  const f = useCurrentFrame();
  const kilitli = f >= t("açtığında") - o;
  return (
    <AbsoluteFill>
      <Konum x={110} y={150}>
        <Kart giris={0} yon="sol" style={{padding: "14px 28px", display: "flex", alignItems: "center", gap: 14}}>
          <div style={{width: 26, height: 26, borderRadius: 13, background: R.turuncu, border: `4px solid ${R.siyah}`}} />
          <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 42}}>e-Devlet</div>
        </Kart>
      </Konum>
      <Konum x={360} y={240}><Isin boyut={420} renk={kilitli ? R.sari : "#E6E6E8"} /></Konum>
      <Konum x={430} y={300}><Ikon ad={kilitli ? "locked_with_key" : "unlocked"} giris={t("kilidi") - o} boyut={280} /></Konum>
      <Konum x={110} y={660}>
        <Kart giris={t("tek") - o} style={{padding: "40px 50px", width: 860, display: "flex", alignItems: "center", justifyContent: "space-between"}}>
          <div>
            <Baslik boyut={40} renk={R.gri} style={{letterSpacing: -1}}>TEK BİR AYAR</Baslik>
            <Baslik boyut={62} style={{letterSpacing: -2}}>Şirket kilidi</Baslik>
          </div>
          <Anahtar an={t("açtığında") - o} />
        </Kart>
      </Konum>
      <Konum x={110} y={940}>
        <Gorunur an={t("onayın") - o} style={{display: "flex", alignItems: "center", gap: 22}}>
          <Ikon ad="office_building" giris={t("kimse") - o} boyut={150} />
          <Ikon ad="prohibited" giris={t("kimse") - o + 6} boyut={130} style={{marginLeft: -110, marginTop: 30}} />
          <Baslik boyut={52} style={{letterSpacing: -2}}>Onayın olmadan</Baslik>
        </Gorunur>
      </Konum>
      <Konum x={800} y={1160}><Hareketli ad="yuz_puan" giris={t("kuramıyor") - o + 3} boyut={180} /></Konum>
      <Damga giris={t("kuramıyor") - o} metin="KİMSE KURAMAZ" aci={-5} boyut={70} style={{top: 1170, left: 60}} />
    </AbsoluteFill>
  );
};

// Sahne 5: CTA
const S5: React.FC<{o: number}> = ({o}) => (
  <AbsoluteFill>
    <CTA
      kelime="KORUMA"
      yazAn={t("KORUMA") - o}
      rehberBaslik="GÜVENLİK KİLİDİ REHBERİ"
      rehberAn={t("bu") - o}
      maddeler={[
        {metin: "Kilidi bul", an: t("güvenlik") - o},
        {metin: "Nasıl açılır", an: t("nasıl") - o},
        {metin: "Adım adım anlatım", an: t("adım", 0) - o},
      ]}
      hemenAn={t("hemen") - o}
      sonAn={t("göndereyim") - o}
    />
  </AbsoluteFill>
);

const DAMGALAR = [t("haberin"), t("sokulabilirsin"), t("haciz"), t("kuramıyor"), t("hemen")];

export const VID002: React.FC = () => (
  <Video sahneler={[S1, S2, S3, S4, S5]} sinir={SINIR} damgalar={DAMGALAR} kelimeler={K} ses="VID_002/ses.mp3" vurgu={["KORUMA"]}>
    <Sfx ad="pop" an={0} />
    <Sfx ad="klavye" an={t("sızdıysa")} ses={0.15} />
    <Sfx ad="pop" an={t("şirket", 0)} />
    <Sfx ad="yukselis" an={t("milyonlarca") - 4} ses={0.14} />
    <Sfx ad="pop" an={t("vergi")} />
    <Sfx ad="pop" an={t("icra")} />
    <Sfx ad="whoosh" an={t("kapısına")} ses={0.18} />
    <Sfx ad="pop" an={t("kilidi")} />
    <Sfx ad="tik" an={t("açtığında")} ses={0.3} />
    <Sfx ad="ding" an={t("açtığında") + 3} ses={0.12} />
    <Sfx ad="pop" an={t("kimse")} />
    {[0, 3, 6, 9, 12, 15].map((d) => <Sfx key={d} ad="klavye" an={t("KORUMA") + d} ses={0.2} />)}
    <Sfx ad="pop" an={t("bu")} />
    {[t("güvenlik"), t("nasıl"), t("adım", 0)].map((a, i) => <Sfx key={`c${i}`} ad="ding" an={a} ses={0.12} />)}
  </Video>
);

// kullanılmayan importları engelle
void Img; void Yagmur;
