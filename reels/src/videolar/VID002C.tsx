import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {Building2, Fingerprint, ShieldCheck} from "lucide-react";
import kelimeler from "../../public/VID_002/kelimeler.json";
import {Kelime, kare} from "../ortak/stil";
import {zamanlayici} from "../ortak/parcalar";
import {Belge, BelgeSatir, Cizgi, CizgiIkon, Govde, Karartma, Muhur, Satir, Ust, Veri} from "../ciddi/Parcalar";
import {CSfx, CVideo} from "../ciddi/Video";
import {C, MONO, SANS, SERIF} from "../ciddi/tema";

const K = kelimeler as Kelime[];
const t = zamanlayici(K);
export const VID002C_SURE = kare(K[K.length - 1].bitis) + 30;
const SINIR = [0, t("adına", 0), t("Çoğu"), t("Ama"), t("Yorumlara"), VID002C_SURE];
const Pos: React.FC<{x: number; y: number; children: React.ReactNode; w?: number}> = ({x, y, w, children}) => <div style={{position: "absolute", left: x, top: y, width: w}}>{children}</div>;

// --- S1: Veri sızıntısı ---
const VeriAkisi: React.FC<{an: number}> = ({an}) => {
  const f = useCurrentFrame();
  const satirlar = ["TC   1•••••••••8", "AD   M•••• Y••••", "DOĞ  ••.••.19••", "ADR  •••••• Mah.", "TEL  05•• ••• ••", "ANNE A••••", "TC   2•••••••••4", "AD   S•••• K••••"];
  const kay = Math.max(0, f - an) * 3.2;
  return (
    <div style={{width: 880, height: 300, overflow: "hidden", border: `2px solid ${C.cizgi}`, borderRadius: 14, background: "#0D131BCC", padding: "16px 28px", maskImage: "linear-gradient(transparent, black 25%, black 75%, transparent)"}}>
      <div style={{transform: `translateY(${-kay % 330}px)`}}>
        {[...satirlar, ...satirlar].map((s, i) => (
          <div key={i} style={{fontFamily: MONO, fontWeight: 500, fontSize: 32, color: i % 3 === 0 ? C.kirmizi : C.soluk, lineHeight: 1.3, opacity: f >= an ? 1 : 0}}>{s}</div>
        ))}
      </div>
    </div>
  );
};
const Tarama: React.FC = () => {
  const f = useCurrentFrame();
  const y = (Math.sin(f / 10) * 0.5 + 0.5) * 260;
  return <div style={{position: "absolute", left: -20, right: -20, top: y, height: 5, background: C.kirmizi, boxShadow: `0 0 30px ${C.kirmizi}`}} />;
};
const S1: React.FC<{o: number}> = ({o}) => (
  <AbsoluteFill>
    <Pos x={100} y={170}><Ust an={0} renk={C.kirmizi}>VERİ İHLALİ</Ust></Pos>
    <Pos x={780} y={110}><div style={{position: "relative"}}><CizgiIkon an={0} Ikon={Fingerprint} boyut={210} renk={C.yazi} /><Tarama /></div></Pos>
    <Pos x={100} y={260}>
      <Satir an={t("Kimlik") - o} boyut={130}>Kimlik</Satir>
      <Satir an={t("bilgilerin") - o} boyut={130}>bilgilerin</Satir>
      <Satir an={t("sızdıysa") - o} boyut={130} renk={C.kirmizi} italik>sızdıysa.</Satir>
    </Pos>
    <Pos x={100} y={800}><VeriAkisi an={t("sızdıysa") - o} /></Pos>
    <Pos x={100} y={1150}><Govde an={t("haberin") - o} boyut={48} renk={C.yazi}>…ve <span style={{color: C.kirmizi, fontWeight: 800}}>haberin bile olmadan.</span></Govde></Pos>
  </AbsoluteFill>
);

// --- S2: Adına şirket + borç ---
const Defter: React.FC<{satirlar: {ad: string; an: number}[]}> = ({satirlar}) => (
  <div style={{width: 880, border: `2px solid ${C.cizgi}`, borderRadius: 14, background: "#0D131BCC", padding: "22px 34px"}}>
    {satirlar.map((s, i) => {
      return (
        <div key={i} style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: i < satirlar.length - 1 ? `1px solid ${C.cizgi}` : "none"}}>
          <Govde an={s.an} boyut={44} renk={C.yazi}>{s.ad}</Govde>
          <Bar an={s.an + 4} />
        </div>
      );
    })}
  </div>
);
const Bar: React.FC<{an: number}> = ({an}) => {
  const f = useCurrentFrame();
  const p = interpolate(f - an, [0, 14], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return <div style={{display: "flex", alignItems: "center", gap: 12, fontFamily: MONO, fontWeight: 700, fontSize: 40, color: C.kirmizi, opacity: f >= an ? 1 : 0}}>₺<div style={{width: 260 * p, height: 30, background: C.kirmizi, boxShadow: `0 0 20px ${C.kirmizi}88`}} /></div>;
};
const S2: React.FC<{o: number}> = ({o}) => (
  <AbsoluteFill>
    <Pos x={100} y={160}><Ust an={0}>TİCARET SİCİLİ</Ust></Pos>
    <Pos x={130} y={240}>
      <Belge an={2} aci={-1.5}>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          <BelgeSatir kalin boyut={34}>ŞİRKET KURULUŞ İLANI</BelgeSatir>
          <div style={{opacity: 0.8}}><Building2 size={64} color={C.murekkep} strokeWidth={1.6} /></div>
        </div>
        <div style={{height: 2, background: C.murekkep, margin: "16px 0 20px"}} />
        <BelgeSatir>Ticaret unvanı: <Karartma an={t("şirket", 0) - o} en={300} /></BelgeSatir>
        <BelgeSatir>Kurucu ortak:<Karartma an={t("şirket", 0) - o + 6} en={340} /></BelgeSatir>
        <BelgeSatir>T.C. Kimlik No:<Karartma an={t("açılıp") - o} en={300} /></BelgeSatir>
      </Belge>
    </Pos>
    <Pos x={100} y={740}><Veri an={t("milyonlarca") - o} boyut={112}>MİLYONLARCA ₺</Veri></Pos>
    <Pos x={100} y={900}><Defter satirlar={[{ad: "Vergi borcu", an: t("vergi") - o}, {ad: "İcra takibi", an: t("icra") - o}]} /></Pos>
    <Pos x={100} y={1210}><Satir an={t("sokulabilirsin") - o} boyut={70} italik renk={C.yazi}>Hepsi senin adına.</Satir></Pos>
  </AbsoluteFill>
);

// --- S3: Haciz ---
const S3: React.FC<{o: number}> = ({o}) => (
  <AbsoluteFill>
    <Pos x={100} y={170}>
      <Satir an={0} boyut={84}>Çoğu kişi</Satir>
      <Satir an={t("kapısına") - o} boyut={84} italik renk={C.soluk}>kapıya gelince öğreniyor.</Satir>
    </Pos>
    <Pos x={150} y={480}>
      <Belge an={t("kapısına") - o} aci={2.5} en={780}>
        <BelgeSatir boyut={26}>T.C.</BelgeSatir>
        <BelgeSatir boyut={26}>•••••• İCRA DAİRESİ</BelgeSatir>
        <div style={{fontFamily: SERIF, fontWeight: 900, fontSize: 64, margin: "18px 0 6px"}}>Haciz İhbarnamesi</div>
        <div style={{height: 2, background: C.murekkep, margin: "10px 0 18px"}} />
        <BelgeSatir>Dosya No : 2026/<Karartma an={t("kapısına") - o + 10} en={160} /></BelgeSatir>
        <BelgeSatir>Borçlu   :<Karartma an={t("kapısına") - o + 14} en={320} /></BelgeSatir>
        <BelgeSatir>Alacaklı : Vergi Dairesi</BelgeSatir>
        <BelgeSatir>Tutar    : ₺<Karartma an={t("kapısına") - o + 18} en={240} /></BelgeSatir>
        <div style={{position: "relative", height: 10}}>
          <Muhur an={t("haciz") - o} metin="HACİZ" alt="TEBLİĞ EDİLDİ" boyut={120} aci={-14} style={{left: 300, top: -190}} />
        </div>
      </Belge>
    </Pos>
  </AbsoluteFill>
);

// --- S4: Çözüm: e-Devlet kilidi ---
const Anahtar: React.FC<{an: number}> = ({an}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - an, fps, config: {damping: 14, stiffness: 200}});
  return (
    <div style={{width: 150, height: 80, borderRadius: 40, background: s > 0.5 ? C.altin : C.cizgi, position: "relative", boxShadow: s > 0.5 ? `0 0 30px ${C.altin}88` : "none"}}>
      <div style={{position: "absolute", top: 8, left: 8 + s * 70, width: 64, height: 64, borderRadius: 32, background: C.yazi}} />
    </div>
  );
};
const Telefon: React.FC<{o: number}> = ({o}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f, fps, config: {damping: 18, stiffness: 90}});
  return (
    <div style={{width: 620, height: 640, borderRadius: 60, border: `3px solid ${C.cizgi}`, background: "linear-gradient(180deg, #121A24, #0C1118)", padding: 40, boxShadow: "0 50px 100px rgba(0,0,0,0.6)", transform: `translateY(${(1 - s) * 300}px) rotate(${(1 - s) * -6}deg)`}}>
      <div style={{width: 120, height: 10, borderRadius: 5, background: C.cizgi, margin: "0 auto 36px"}} />
      <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 32, color: C.soluk, letterSpacing: 4}}>e-DEVLET · GÜVENLİK</div>
      <div style={{height: 1, background: C.cizgi, margin: "24px 0"}} />
      <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 0"}}>
        <div>
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 40, color: C.yazi}}>Şirket kilidi</div>
          <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 28, color: C.soluk, marginTop: 6}}>Onayım olmadan işlem yapılamaz</div>
        </div>
        <Anahtar an={t("açtığında") - o} />
      </div>
      <div style={{height: 1, background: C.cizgi, margin: "10px 0 30px"}} />
      <div style={{display: "flex", alignItems: "center", gap: 20, opacity: f >= t("onayın") - o ? 1 : 0}}>
        <CizgiIkon an={t("onayın") - o} Ikon={ShieldCheck} boyut={110} renk={C.altin} />
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 38, color: C.altin}}>Koruma aktif</div>
      </div>
    </div>
  );
};
const S4: React.FC<{o: number}> = ({o}) => (
  <AbsoluteFill>
    <Pos x={100} y={160}><Ust an={0}>ÇÖZÜM</Ust></Pos>
    <Pos x={100} y={230}>
      <Satir an={0} boyut={84}>Tek bir kilit.</Satir>
    </Pos>
    <Pos x={230} y={400}><Telefon o={o} /></Pos>
    <Pos x={100} y={1110}>
      <Satir an={t("kimse") - o} boyut={76}>Kimse adına</Satir>
      <Satir an={t("şirket", 1) - o} boyut={76} italik renk={C.altin}>şirket kuramaz.</Satir>
    </Pos>
  </AbsoluteFill>
);

// --- S5: Kapanış ---
const Adim: React.FC<{no: string; metin: string; an: number}> = ({no, metin, an}) => (
  <div style={{display: "flex", alignItems: "center", gap: 30, padding: "22px 0", borderBottom: `1px solid ${C.cizgi}`}}>
    <Govde an={an} boyut={40} renk={C.altin} style={{fontFamily: MONO, fontWeight: 700}}>{no}</Govde>
    <Govde an={an} boyut={50} renk={C.yazi} style={{fontWeight: 800}}>{metin}</Govde>
  </div>
);
const Yaz: React.FC<{an: number; metin: string}> = ({an, metin}) => {
  const f = useCurrentFrame();
  const n = Math.max(0, Math.min(metin.length, Math.floor((f - an) / 3) + 1));
  return <>{f >= an ? metin.slice(0, n) : ""}<span style={{opacity: Math.floor(f / 9) % 2 ? 0 : 1, color: C.kirmizi}}>▍</span></>;
};
const S5: React.FC<{o: number}> = ({o}) => (
  <AbsoluteFill>
    <Pos x={100} y={160}><Ust an={0}>ÜCRETSİZ REHBER</Ust></Pos>
    <Pos x={100} y={230}><Satir an={0} boyut={92}>Yorumlara yaz:</Satir></Pos>
    <Pos x={100} y={380}>
      <div style={{width: 880, border: `4px solid ${C.kirmizi}`, borderRadius: 18, padding: "26px 40px", fontFamily: MONO, fontWeight: 700, fontSize: 120, color: C.yazi, letterSpacing: 8, background: "#160B0D", boxShadow: `0 0 60px ${C.kirmizi}44`}}>
        <Yaz an={t("KORUMA") - o} metin="KORUMA" />
      </div>
    </Pos>
    <Pos x={100} y={640} w={880}>
      <Cizgi an={t("bu") - o} en={880} renk={C.cizgi} kalin={2} />
      <Adim no="01" metin="Güvenlik kilidini bul" an={t("güvenlik") - o} />
      <Adim no="02" metin="Nasıl açılacağını öğren" an={t("nasıl") - o} />
      <Adim no="03" metin="Adım adım uygula" an={t("adım", 0) - o} />
    </Pos>
    <Pos x={100} y={1170}><Govde an={t("hemen") - o} boyut={50} renk={C.yazi}>Rehberi <span style={{color: C.kirmizi, fontWeight: 800}}>hemen gönderiyorum →</span></Govde></Pos>
  </AbsoluteFill>
);

const DARBELER = [t("sızdıysa"), t("sokulabilirsin"), t("haciz"), t("kuramıyor")];

export const VID002C: React.FC = () => (
  <CVideo sahneler={[S1, S2, S3, S4, S5]} sinir={SINIR} darbeler={DARBELER} kelimeler={K} ses="VID_002/ses.mp3" vurgu={["KORUMA"]}>
    <CSfx ad="glitch" an={t("sızdıysa") + 2} ses={0.12} />
    <CSfx ad="kagit" an={2} ses={0.25} />
    {[0, 6, 12].map((d) => <CSfx key={`k${d}`} ad="daktilo" an={t("şirket", 0) + d} ses={0.2} />)}
    <CSfx ad="yukselis" an={t("milyonlarca") - 30} ses={0.16} />
    <CSfx ad="kagit" an={t("kapısına")} ses={0.25} />
    <CSfx ad="muhur" an={t("haciz")} ses={0.32} />
    <CSfx ad="tiktak" an={t("açtığında")} ses={0.3} />
    <CSfx ad="onay" an={t("onayın")} ses={0.16} />
    {[0, 3, 6, 9, 12, 15].map((d) => <CSfx key={`y${d}`} ad="daktilo" an={t("KORUMA") + d} ses={0.2} />)}
    {[t("güvenlik"), t("nasıl"), t("adım", 0)].map((a, i) => <CSfx key={`a${i}`} ad="tiktak" an={a} ses={0.25} />)}
  </CVideo>
);
