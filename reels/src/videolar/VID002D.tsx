import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from "remotion";
import kelimeler from "../../public/VID_002/kelimeler.json";
import {Kelime, kare} from "../ortak/stil";
import {zamanlayici} from "../ortak/parcalar";
import {DosyaVideo, Efekt} from "../dosya/Cerceve";
import {Kagit} from "../dosya/Kagit";
import {Cip, Daktilo, Govde, Kart, Karartma, Manset, Muhur} from "../dosya/Parcalar";
import {D, RAKAM, VERI} from "../dosya/tema";
import {Yarimton, kenar, parmakIzi, radyal} from "../dosya/Yarimton";

const K = kelimeler as Kelime[];
const t = zamanlayici(K);
export const VID002D_SURE = kare(K[K.length - 1].bitis) + 30;
const B1 = t("adına", 0), B2 = t("Çoğu"), B3 = t("Ama"), B4 = t("Yorumlara");
const P: React.FC<{x: number; y: number; children: React.ReactNode; z?: number}> = ({x, y, z, children}) => <div style={{position: "absolute", left: x, top: y, zIndex: z}}>{children}</div>;
const ease = Easing.bezier(0.16, 1, 0.3, 1);

// Yarım ton dolgulu dev rakam
const DevRakam: React.FC<{r: string; boyut: number; renk: string; nokta: string; id: string}> = ({r, boyut, renk, nokta, id}) => (
  <div style={{position: "relative", width: boyut * 0.75, height: boyut}}>
    <svg width={boyut * 0.75} height={boyut} style={{position: "absolute", overflow: "visible"}}>
      <defs><clipPath id={id}><text x="0" y={boyut * 0.86} fontFamily={RAKAM} fontSize={boyut}>{r}</text></clipPath></defs>
      <text x="0" y={boyut * 0.86} fontFamily={RAKAM} fontSize={boyut} fill={renk}>{r}</text>
    </svg>
    <div style={{position: "absolute", inset: 0, clipPath: `url(#${id})`}}>
      <Yarimton w={boyut * 0.75} h={boyut} adim={20} aci={45} renk={nokta} yogunluk={radyal(0.3, 0.3, 1.1, 0.95)} />
    </div>
  </div>
);

// Parmak izi (yarım ton), dairesel maske ile açılır
const ParmakIzi: React.FC<{an: number; w?: number}> = ({an, w = 440}) => {
  const f = useCurrentFrame();
  const p = interpolate(f - an, [0, 16], [0, 75], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease});
  return (
    <div style={{width: w, height: w * 1.27, clipPath: `circle(${p}% at 50% 55%)`}}>
      <Yarimton w={w} h={w * 1.27} adim={14} aci={15} renk={D.murekkep} yogunluk={parmakIzi} />
    </div>
  );
};

// ---------- S1: Sızıntı ----------
const S1: React.FC<{o: number}> = ({o}) => {
  const f = useCurrentFrame();
  const zoomBas = kare(2.42) - o, son = B1 - o;
  const z = interpolate(f, [zoomBas, son], [1, 3.6], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic)});
  const nabiz = 1 + Math.sin(f / 4.7) * 0.004;
  return (
    <AbsoluteFill style={{scale: `${z * nabiz}`, transformOrigin: "690px 1000px"}}>
      <P x={330} y={640}><div style={{scale: `${1 + Math.sin(f / 20) * 0.03}`}}><Yarimton w={720} h={720} adim={22} aci={45} renk={D.golge} yogunluk={radyal(0.5, 0.5, 0.5, 0.75)} /></div></P>
      <P x={470} y={720}><ParmakIzi an={0} /></P>
      <P x={90} y={310}><Manset metin="KİMLİK" an={t("Kimlik") - o} boyut={130} /></P>
      <P x={90} y={450}><Manset metin="BİLGİLERİN" an={t("bilgilerin") - o} boyut={112} aralik={1.2} /></P>
      <P x={90} y={575}><Manset metin="SIZDIYSA" an={t("sızdıysa") - o} boyut={128} renk={D.alarm} /></P>
      <P x={80} y={1040}>
        <Kart an={t("sızdıysa") - o + 4} w={440} aci={-2} style={{padding: "24px 28px"}}>
          <Cip an={t("sızdıysa") - o + 8} zemin={D.alarm}>EK-1 · VERİ</Cip>
          {[["T.C. NO", 0], ["AD SOYAD", 4], ["ADRES", 8]].map(([a, d]) => (
            <div key={a as string} style={{fontFamily: VERI, fontWeight: 800, fontSize: 26, color: D.murekkep, marginTop: 14}}>{a}<Karartma an={t("haberin") - o + (d as number)} en={a === "ADRES" ? 230 : 190} yuk={26} /></div>
          ))}
        </Kart>
      </P>
    </AbsoluteFill>
  );
};

// ---------- S2: Adına şirket ----------
const S2: React.FC<{o: number}> = ({o}) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, B2 - o], [1, 1.07]);
  const vurgu = interpolate(f - (t("milyonlarca") - o) - 10, [0, 8], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease});
  return (
    <AbsoluteFill style={{scale: `${z}`, transformOrigin: "500px 820px"}}>
      <P x={560} y={330}><div style={{opacity: 0.9, rotate: "6deg"}}><DevRakam r="2" boyut={760} renk={D.vurgu} nokta={D.golge} id="rakam2" /></div></P>
      <P x={100} y={360}>
        <Kart an={t("şirket", 0) - o} w={720} aci={-3}>
          <Cip an={t("şirket", 0) - o + 4}>EK-2 · TİCARET SİCİLİ</Cip>
          <div style={{fontFamily: RAKAM, fontSize: 46, color: D.murekkep, marginTop: 16}}>ŞİRKET KURULUŞ İLANI</div>
          <div style={{height: 5, background: D.murekkep, margin: "12px 0 16px"}} />
          {[["Ticaret unvanı", 0, 250], ["Kurucu ortak", 5, 270], ["T.C. Kimlik No", 10, 230]].map(([a, d, w]) => (
            <div key={a as string} style={{fontFamily: VERI, fontWeight: 800, fontSize: 28, color: D.murekkep, marginTop: 10}}>{a}:<Karartma an={t("açılıp") - o + (d as number)} en={w as number} yuk={28} /></div>
          ))}
        </Kart>
      </P>
      <P x={90} y={880}>
        <div style={{position: "relative"}}>
          <div style={{position: "absolute", left: -12, right: -12, top: 46, height: 62, background: D.vurgu, transformOrigin: "left", scale: `${vurgu} 1`, rotate: "-1deg", mixBlendMode: "multiply"}} />
          <Manset metin="MİLYONLARCA ₺" an={t("milyonlarca") - o} boyut={92} aralik={1.1} />
        </div>
      </P>
      <P x={100} y={1030}>
        <Kart an={t("vergi") - o - 4} w={760} aci={1.5} style={{padding: "22px 34px"}}>
          {[["VERGİ BORCU", t("vergi") - o], ["İCRA TAKİBİ", t("icra") - o]].map(([a, an], i) => (
            <div key={i} style={{display: "flex", justifyContent: "space-between", fontFamily: VERI, fontWeight: 800, fontSize: 34, color: D.murekkep, padding: "10px 0", borderBottom: i === 0 ? `3px dashed ${D.murekkep}` : "none", opacity: f >= (an as number) ? 1 : 0}}>
              <span>{a}</span><Daktilo an={an as number} metin="₺ ███.███,██" style={{color: D.alarm}} />
            </div>
          ))}
        </Kart>
      </P>
      <P x={560} y={1200}><Cip an={t("sokulabilirsin") - o} zemin={D.vurgu} renk={D.murekkep} style={{fontSize: 40, rotate: "-6deg", border: `5px solid ${D.murekkep}`}}>BORÇ SENDE!</Cip></P>
    </AbsoluteFill>
  );
};

// ---------- S3: Haciz ----------
const S3: React.FC<{o: number}> = ({o}) => {
  const f = useCurrentFrame();
  const kay = interpolate(f - (t("kapısına") - o), [0, 16], [-420, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.2))});
  const gerilim = interpolate(f - (t("haciz") - o), [0, 20], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return (
    <AbsoluteFill>
      <div style={{position: "absolute", inset: 0, opacity: gerilim * 0.7}}><Yarimton w={1080} h={1920} adim={24} aci={30} renk={D.alarm} yogunluk={kenar(0.85, 0.11)} /></div>
      <P x={90} y={310}><Manset metin="ÇOĞU KİŞİ" an={0} boyut={104} /></P>
      <P x={90} y={430}><Manset metin="KAPIDA ÖĞRENİYOR" an={t("kapısına") - o} boyut={70} aralik={0.9} renk={D.golge} golge={D.vurgu} /></P>
      {/* Kapı */}
      <P x={150} y={540}>
        <div style={{width: 760, height: 360, background: D.murekkep, borderRadius: "16px 16px 0 0", position: "relative", overflow: "hidden"}}>
          <div style={{position: "absolute", inset: 0, opacity: 0.35}}><Yarimton w={760} h={360} adim={16} aci={15} renk={D.golge} yogunluk={(u, v) => 0.3 + v * 0.5} carp={false} /></div>
          <div style={{position: "absolute", inset: "30px 40px 0 40px", border: `6px solid ${D.golge}`, borderBottom: "none", borderRadius: 10}} />
          <div style={{position: "absolute", right: 80, top: 170, width: 40, height: 40, borderRadius: 20, background: D.vurgu}} />
        </div>
        <div style={{width: 820, height: 14, background: D.murekkep, marginLeft: -30, borderRadius: 4}} />
      </P>
      {/* İhbarname kapı altından kayar */}
      <P x={200} y={914}>
        <div style={{width: 700, height: 420, overflow: "hidden", paddingTop: 0}}>
          <div style={{translate: `0 ${kay}px`, rotate: "3deg", padding: "0 20px"}}>
            <div style={{background: D.kagitAcik, border: `6px solid ${D.murekkep}`, borderRadius: 10, boxShadow: `12px 12px 0 ${D.golge}`, padding: "26px 34px", width: 600}}>
              <div style={{fontFamily: VERI, fontWeight: 800, fontSize: 24, color: D.murekkep}}>T.C. ••••••• İCRA DAİRESİ</div>
              <div style={{fontFamily: RAKAM, fontSize: 52, color: D.murekkep, margin: "10px 0"}}>HACİZ İHBARNAMESİ</div>
              {[88, 70, 80, 55].map((w, i) => <div key={i} style={{height: 16, width: `${w}%`, background: "#1B234026", borderRadius: 8, marginTop: 14}} />)}
            </div>
          </div>
        </div>
      </P>
      <Muhur metin="HACİZ" an={t("haciz") - o} boyut={150} aci={-11} style={{left: 270, top: 990}} />
    </AbsoluteFill>
  );
};

// ---------- S4: Ama — kilit ----------
const Kilit: React.FC<{kapan: number}> = ({kapan}) => {
  const f = useCurrentFrame();
  const k = interpolate(f - kapan, [0, 6], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad)});
  const sek = f > kapan + 6 ? Math.sin((f - kapan - 6) * 1.4) * Math.exp(-(f - kapan - 6) * 0.4) * 6 : 0;
  return (
    <div style={{position: "relative", width: 420, height: 520}}>
      <svg width="420" height="520" style={{position: "absolute", overflow: "visible"}}>
        <path d={`M110 ${250 - (1 - k) * 70} V160 a100 100 0 0 1 200 0 V${250 - (1 - k) * 70 + (1 - k) * 0}`} fill="none" stroke={D.murekkep} strokeWidth="38" strokeLinecap="round" transform={`translate(${(1 - k) * 60} ${sek})`} />
      </svg>
      <div style={{position: "absolute", left: 30, top: 230, width: 360, height: 280, background: D.vurgu, border: `9px solid ${D.murekkep}`, borderRadius: 34, boxShadow: `14px 14px 0 ${D.golge}`, overflow: "hidden"}}>
        <Yarimton w={360} h={280} adim={18} aci={45} renk="#C48F00" yogunluk={radyal(0.25, 0.2, 1.2, 0.8)} />
        <div style={{position: "absolute", left: 150, top: 80, width: 60, height: 60, borderRadius: 30, background: D.murekkep}} />
        <div style={{position: "absolute", left: 168, top: 120, width: 24, height: 70, borderRadius: 8, background: D.murekkep}} />
      </div>
    </div>
  );
};
const S4: React.FC<{o: number}> = ({o}) => {
  const f = useCurrentFrame();
  const panBas = t("kilidi") - o - 10;
  const pan = interpolate(f, [panBas, panBas + 18], [0, -1080], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic)});
  const it = interpolate(f, [t("onayın") - o, t("kuramıyor") - o], [1, 1.05], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return (
    <AbsoluteFill style={{translate: `${pan}px 0`}}>
      <P x={80} y={420}><Manset metin="AMA" an={0} boyut={330} golge={D.vurgu} /></P>
      <P x={100} y={830}><Cip an={t("e-Devlet'te") - o} zemin={D.golge} style={{fontSize: 56}}>e-Devlet · TEK AYAR</Cip></P>
      <div style={{position: "absolute", left: 1080, top: 0, width: 1080, height: 1920, scale: `${it}`, transformOrigin: "540px 1150px"}}>
        <P x={330} y={300}><Kilit kapan={t("açtığında") - o} /></P>
        <P x={110} y={830}><Manset metin="KİLİT AKTİF" an={t("açtığında") - o + 4} boyut={92} renk={D.golge} golge={D.vurgu} /></P>
        <P x={100} y={960}>
          <Kart an={t("onayın") - o} w={780} aci={-1.5} yon="olcek" style={{padding: "26px 34px"}}>
            <div style={{fontFamily: RAKAM, fontSize: 36, color: D.murekkep}}>ŞİRKET KURULUŞ BAŞVURUSU</div>
            <div style={{height: 4, background: D.murekkep, margin: "10px 0 12px"}} />
            <div style={{fontFamily: VERI, fontWeight: 800, fontSize: 30, color: D.murekkep}}>Başvuran: <Daktilo an={t("kimse") - o} metin="??????" /></div>
            <div style={{fontFamily: VERI, fontWeight: 800, fontSize: 30, color: D.murekkep, marginTop: 8}}>Kimlik sahibi onayı: <Daktilo an={t("olmadan") - o} metin="YOK" style={{color: D.alarm}} /></div>
          </Kart>
        </P>
        <Muhur metin="RED" alt="ONAY YOK" an={t("kuramıyor") - o} boyut={140} aci={-9} style={{left: 520, top: 950}} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- S5: Kapanış + geri çekilme ----------
const Adim: React.FC<{no: string; metin: string; an: number}> = ({no, metin, an}) => {
  const f = useCurrentFrame();
  const p = interpolate(f - an, [0, 10], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.8))});
  return (
    <div style={{display: "flex", alignItems: "center", gap: 26, marginTop: 26, opacity: f >= an ? 1 : 0, translate: `${(1 - p) * -60}px 0`}}>
      <div style={{width: 96, height: 96, borderRadius: 48, background: D.golge, border: `6px solid ${D.murekkep}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: RAKAM, fontSize: 52, color: D.kagitAcik, scale: `${p}`}}>{no}</div>
      <Govde boyut={50}>{metin}</Govde>
    </div>
  );
};
const S5: React.FC<{o: number}> = ({o}) => {
  const f = useCurrentFrame();
  const geri = interpolate(f, [t("göndereyim") - o + 8, VID002D_SURE - o], [1, 0.74], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease});
  return (
    <AbsoluteFill style={{background: D.murekkep}}>
      {[[-14, 60, 120], [9, -80, 260], [-5, 120, 1500], [12, -60, 1620]].map(([r, x, y], i) => (
        <div key={i} style={{position: "absolute", left: x, top: y, width: 1100, height: 700, background: i % 2 ? "#E9DDBF" : D.kagit, rotate: `${r}deg`, border: `4px solid #0005`}} />
      ))}
      <AbsoluteFill style={{scale: `${geri}`, transformOrigin: "540px 860px", boxShadow: "0 40px 80px #0008", overflow: "hidden"}}>
        <Kagit />
        <P x={100} y={300}>
          <Kart an={0} w={860} yon="olcek" style={{padding: "28px 38px"}}>
            <Cip an={2}>YORUMLARA YAZ</Cip>
            <div style={{marginTop: 18, background: D.vurgu, border: `7px solid ${D.murekkep}`, borderRadius: 16, padding: "10px 30px", fontFamily: VERI, fontWeight: 800, fontSize: 130, color: D.murekkep, height: 170}}>
              <Daktilo an={t("KORUMA") - o} metin="KORUMA" hiz={3} />
            </div>
          </Kart>
        </P>
        <P x={100} y={640}>
          <Adim no="1" metin="Kilidi bul" an={t("güvenlik") - o} />
          <Adim no="2" metin="Nasıl açılır" an={t("nasıl") - o} />
          <Adim no="3" metin="Adım adım uygula" an={t("adım", 0) - o} />
        </P>
        <P x={660} y={960}><ParmakIzi an={t("hemen") - o - 10} w={240} /></P>
        <Muhur metin="KORUNDU" an={t("hemen") - o} renk={D.golge} boyut={70} aci={-12} style={{left: 560, top: 1080}} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const MUHURLER = [t("haciz"), t("kuramıyor"), t("hemen")];
export const VID002D: React.FC = () => (
  <DosyaVideo
    sahneler={[{S: S1, bas: 0}, {S: S2, bas: B1}, {S: S3, bas: B2}, {S: S4, bas: B3}, {S: S5, bas: B4}]}
    sure={VID002D_SURE}
    silmeler={[{an: B1, renk: D.golge}, {an: B2, renk: D.murekkep}, {an: B4, renk: D.vurgu}]}
    sertKesmeler={[B3]}
    muhurler={MUHURLER}
    kelimeler={K}
    anahtar={["sızdıysa", "şirket", "milyonlarca", "haciz", "kilidi", "kimse", "koruma", "güvenlik"]}
    dosya="2026/0002"
    bolumler={[{an: 0, ad: "EK-1 SIZINTI"}, {an: B1, ad: "EK-2 ŞİRKET"}, {an: B2, ad: "EK-3 HACİZ"}, {an: B3, ad: "ÇÖZÜM"}, {an: B4, ad: "REHBER"}]}
    klasor="VID_002"
  >
    {/* Foley */}
    {[t("Kimlik"), t("bilgilerin"), t("sızdıysa")].map((a, i) => <Efekt key={`p${i}`} ad="pop" an={a} ses={0.15} />)}
    {[0, 4, 8].map((d) => <Efekt key={`z${d}`} ad="zip" an={t("haberin") + d} ses={0.18} />)}
    <Efekt ad="kagit" an={t("sızdıysa") + 2} ses={0.25} />
    <Efekt ad="deklansor" an={kare(2.42)} ses={0.3} />
    {[B1, B2, B4].map((b, i) => <Efekt key={`v${i}`} ad="vuus" an={b - 9} ses={0.3} />)}
    <Efekt ad="dosya" an={t("şirket", 0) + 6} ses={0.35} />
    {[0, 5, 10].map((d) => <Efekt key={`z2${d}`} ad="zip" an={t("açılıp") + d} ses={0.16} />)}
    {[t("milyonlarca"), t("vergi"), t("icra")].map((a, i) => <Efekt key={`d${i}`} ad="pop" an={a} ses={0.14} />)}
    {[0, 2, 4, 6, 8].map((d) => <Efekt key={`dk${d}`} ad="daktilo" an={t("vergi") + d} ses={0.18} />)}
    {[0, 2, 4, 6, 8].map((d) => <Efekt key={`dk2${d}`} ad="daktilo" an={t("icra") + d} ses={0.18} />)}
    <Efekt ad="pop" an={t("sokulabilirsin")} ses={0.2} />
    <Efekt ad="kagit" an={B2 - 6} ses={0.22} />
    <Efekt ad="kagit" an={t("kapısına")} ses={0.35} />
    <Efekt ad="muhur" an={t("haciz")} ses={0.55} />
    <Efekt ad="deklansor" an={B3} ses={0.25} />
    <Efekt ad="vuus" an={t("kilidi") - 10} ses={0.3} />
    <Efekt ad="kilit" an={t("açtığında")} ses={0.45} />
    <Efekt ad="dosya" an={t("onayın")} ses={0.3} />
    {[0, 2, 4].map((d) => <Efekt key={`y${d}`} ad="daktilo" an={t("olmadan") + d} ses={0.2} />)}
    <Efekt ad="muhur" an={t("kuramıyor")} ses={0.55} />
    {[0, 3, 6, 9, 12, 15].map((d) => <Efekt key={`k${d}`} ad="daktilo" an={t("KORUMA") + d} ses={0.2} />)}
    {[t("güvenlik"), t("nasıl"), t("adım", 0)].map((a, i) => <Efekt key={`tk${i}`} ad="tik" an={a} ses={0.2} />)}
    <Efekt ad="muhur" an={t("hemen")} ses={0.4} />
    <Efekt ad="kagit" an={t("göndereyim") + 8} ses={0.25} />
  </DosyaVideo>
);
