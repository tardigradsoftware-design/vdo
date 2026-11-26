import {AbsoluteFill, interpolate, useCurrentFrame} from "remotion";
import kelimeler from "../../public/VID_003/kelimeler.json";
import {Kelime, kare} from "../ortak/stil";
import {zamanlayici} from "../ortak/parcalar";
import {Banka, Belge, Bitki, Dalga, Grup, Jeton, Kanepe, Kumbara, Lamba, Leke, Masa, Pencere, Sandalye, Suslemeler, Telefon, Terazi} from "../flat/Cevre";
import {Kisi} from "../flat/Kisi";
import {F, YAZI, inout, yumusak} from "../flat/tema";
import {Baslik, FlatVideo, Sfx} from "../flat/Video";

const K = kelimeler as Kelime[];
const t = zamanlayici(K);
export const VID003F_SURE = kare(K[K.length - 1].bitis) + 30;
const S = [0, t("aslında"), t("Banka"), t("krediyi"), t("poliçeyi"), t("Yorumlara"), VID003F_SURE];
const ara = (f: number, a: number, b: number, x: number, y: number, e = inout) => interpolate(f, [a, b], [x, y], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e});

// Parallax kamera: derinlik 0 (sabit arka) → 1 (ön plan)
const Dunya: React.FC<{s: number; tx?: number; ty?: number; katmanlar: [number, React.ReactNode][]}> = ({s, tx = 0, ty = 0, katmanlar}) => (
  <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position: "absolute", inset: 0}}>
    <g transform="translate(540 950) scale(1.16) translate(-540 -950)">
    {[...katmanlar.slice(0, -1), [0.85, <g key="zemin"><Dalga y={1560} renk={F.gri} genlik={22} faz={4} /><Dalga y={1720} renk="#9DB1D8" genlik={18} faz={1} /></g>] as [number, React.ReactNode], katmanlar[katmanlar.length - 1]].map(([d, icerik], i) => {
      const ss = 1 + (s - 1) * d;
      return <g key={i} transform={`translate(540 960) scale(${ss}) translate(${-540 + tx * d} ${-960 + ty * d})`}>{icerik}</g>;
    })}
    </g>
  </svg>
);
const Ust: React.FC<{children: React.ReactNode}> = ({children}) => <div style={{position: "absolute", left: 90, right: 160, top: 300}}>{children}</div>;
const Rozet: React.FC<{an: number; children: React.ReactNode; zemin?: string; renk?: string}> = ({an, children, zemin = F.mavi, renk = F.beyaz}) => {
  const f = useCurrentFrame();
  const p = ara(f, an, an + 12, 0, 1, yumusak);
  return <div style={{display: "inline-block", marginTop: 18, fontFamily: YAZI, fontWeight: 800, fontSize: 40, color: renk, background: zemin, padding: "10px 26px", borderRadius: 999, scale: `${0.6 + p * 0.4}`, opacity: p, transformOrigin: "0 50%"}}>{children}</div>;
};

// ---------- S1: Bankada imza ----------
const S1: React.FC<{o: number}> = ({o}) => {
  const f = useCurrentFrame();
  const kam = ara(f, 0, S[1] - o, 1, 1.08, (x) => x);
  const it = ara(f, t("kesilen") - o, t("kesilen") - o + 16, 0, 1, yumusak);
  const ucus = (i: number) => {
    const d = (f - (t("binlerce") - o) - i * 7);
    if (d < 0 || d > 26) return null;
    const p = d / 26;
    return <Jeton key={i} x={340 + p * 360} y={1020 - Math.sin(p * Math.PI) * 220} s={0.9} r={p * 360} />;
  };
  return (
    <AbsoluteFill>
      <Dunya s={kam} katmanlar={[
        [0.2, <g><Leke x={540} y={900} w={1100} h={900} renk={F.pastel2} /><Leke x={900} y={560} w={380} h={300} renk={F.gri2} faz={2} /><Banka x={560} y={900} s={0.85} /><Suslemeler /></g>],
        [0.6, <g><Dalga y={1240} renk={F.gri2} genlik={18} /><Bitki x={150} y={1290} s={1.1} buyuk /></g>],
        [1, <g>
          <Kisi x={720} y={1330} olcek={0.75} ayna ten={F.ten2} sacTip="uzun" ust={F.mavi} alt={F.lacivert} poz={{sagUst: -60 - it * 25, sagAlt: -30, solUst: 14}} kirpma={30} />
          <Masa x={540} y={1060} w={720} />
          <Belge x={680 - it * 260} y={1010} s={0.45} r={-80 + it * 70} />
          <Belge x={760} y={990} s={0.5} r={-6} baslik={f >= t("hayat") - o ? "HAYAT SİGORTASI" : undefined} />
          <Sandalye x={250} y={1130} s={0.9} />
          <Kisi x={260} y={1140} olcek={0.62} oturan ust={F.mor} poz={{sagUst: -75, sagAlt: -35, solUst: 10, bas: 4}} />
          {[0, 1, 2, 3].map(ucus)}
        </g>],
      ]} />
      <Ust>
        <Baslik metin="Kredi çekerken" an={t("kredi", 0) - o} boyut={78} />
        <Baslik metin="hayat sigortası" an={t("hayat") - o} boyut={92} vurgu={["sigortası"]} />
        <Rozet an={t("binlerce") - o} zemin={F.lacivert}>− ₺ binlerce lira</Rozet>
      </Ust>
    </AbsoluteFill>
  );
};

// ---------- S2: Terazi ----------
const S2: React.FC<{o: number}> = ({o}) => {
  const f = useCurrentFrame();
  const egim = ara(f, t("yasal") - o, t("yasal") - o + 24, 0, -12, yumusak) + Math.sin(f / 18) * 0.8;
  const pan = ara(f, 0, S[2] - o + 12, 0, -40, (x) => x);
  const sasir = f >= t("zorunlu") - o;
  const tik = ara(f, t("değil") - o, t("değil") - o + 12, 0, 1, yumusak);
  return (
    <AbsoluteFill>
      <Dunya s={1.03} tx={pan} katmanlar={[
        [0.25, <g><Leke x={560} y={1040} w={1000} h={820} renk={F.pastel2} /><Leke x={170} y={760} w={260} h={220} renk={F.gri2} faz={1} /><Suslemeler tohum={2} /></g>],
        [0.7, <g><Dalga y={1290} renk={F.gri2} genlik={14} faz={1} /><Belge x={230} y={930} s={0.9} r={-8} baslik="KANUN" /></g>],
        [1, <g>
          <Terazi x={540} y={1250} s={1.15} egim={egim} />
          <Kisi x={860} y={1340} olcek={0.6} ust={F.mor} agiz={sasir ? "o" : "gulus"} poz={{kas: sasir ? 7 : 0, bas: sasir ? -6 : 0, sagUst: sasir ? -150 : -10, sagAlt: sasir ? -20 : 0, solUst: 12}} />
        </g>],
      ]} />
      <Ust>
        <Baslik metin="Yasal olarak" an={t("yasal") - o} boyut={78} />
        <div style={{display: "flex", alignItems: "center", gap: 24}}>
          <Baslik metin="zorunlu değil" an={t("zorunlu") - o} boyut={104} vurgu={["değil"]} />
          <div style={{width: 92, height: 92, borderRadius: 46, background: F.mavi, display: "flex", alignItems: "center", justifyContent: "center", scale: `${tik}`, boxShadow: "0 12px 30px rgba(40,105,245,0.35)"}}>
            <svg width="50" height="50" viewBox="0 0 50 50"><path d="M10 26 L21 37 L41 14" stroke="#fff" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="60" strokeDashoffset={60 * (1 - tik)} /></svg>
          </div>
        </div>
      </Ust>
    </AbsoluteFill>
  );
};

// ---------- S3: Mecburi gibi gösterilir ----------
const S3: React.FC<{o: number}> = ({o}) => {
  const f = useCurrentFrame();
  const tr = ara(f, 0, S[3] - o + 12, 30, -30, (x) => x);
  const isaret = ara(f, t("sana") - o, t("sana") - o + 14, 0, 1, yumusak);
  const ciz = ara(f, t("gösterse") - o, t("gösterse") - o + 14, 0, 1, yumusak);
  return (
    <AbsoluteFill>
      <Dunya s={1.04} tx={tr} katmanlar={[
        [0.25, <g><Leke x={540} y={1000} w={1080} h={860} renk={F.pastel2} faz={3} /><Leke x={880} y={720} w={300} h={260} renk={F.gri2} /><Suslemeler tohum={4} /></g>],
        [0.7, <g><Dalga y={1300} renk={F.gri2} genlik={16} faz={2} /><Bitki x={960} y={1320} s={0.9} /></g>],
        [1, <g>
          <Grup x={430} y={720} s={isaret} r={-3}>
            <rect x={-200} y={-90} width={400} height={170} rx={30} fill={F.mavi} />
            <text x={0} y={22} textAnchor="middle" fontFamily="'Plus Jakarta Sans'" fontWeight={800} fontSize={64} fill={F.beyaz}>ZORUNLU</text>
            <rect x={-170} y={-8} width={340 * ciz} height={12} rx={6} fill={F.lacivert} />
            <rect x={-12} y={80} width={24} height={200} rx={10} fill={F.lacivert} />
          </Grup>
          <Kisi x={300} y={1340} olcek={0.62} ten={F.ten2} sacTip="uzun" ust={F.mavi} poz={{sagUst: -130 * isaret, sagAlt: -20, solUst: 10, bas: 3}} kirpma={50} />
          <Kisi x={820} y={1340} olcek={0.62} ayna ust={F.mor} agiz="duz" poz={{bas: Math.sin(f / 10) * 5, solUst: -30, solAlt: -100, sagUst: 30, sagAlt: 100}} />
          {[0, 1].map((i) => <text key={i} x={860 + i * 70} y={760 - i * 60 + Math.sin(f / 14 + i) * 12} fontFamily="'Plus Jakarta Sans'" fontWeight={800} fontSize={90 - i * 20} fill={i ? F.gri : F.mor} opacity={f >= t("mecburi") - o ? 1 : 0}>?</text>)}
        </g>],
      ]} />
      <Ust>
        <Baslik metin="Mecburi gibi" an={t("mecburi") - o} boyut={92} />
        <Baslik metin="gösterilir" an={t("gösterse") - o} boyut={92} vurgu={["gösterilir"]} />
      </Ust>
    </AbsoluteFill>
  );
};

// ---------- S4: Evden, şubeye gitmeden ----------
const S4: React.FC<{o: number}> = ({o}) => {
  const f = useCurrentFrame();
  const kam = ara(f, 0, S[4] - o + 12, 1.14, 1.0, yumusak);
  const balon = ara(f, t("şubeye") - o - 4, t("şubeye") - o + 12, 0, 1, yumusak);
  const carpi = ara(f, t("gitmeden") - o, t("gitmeden") - o + 10, 0, 1, yumusak);
  const tel = <g transform="rotate(-20)"><rect x={-26} y={-50} width={52} height={92} rx={10} fill={F.lacivert} /><rect x={-20} y={-42} width={40} height={72} rx={6} fill={F.pastel} /></g>;
  return (
    <AbsoluteFill>
      <Dunya s={kam} ty={-30} katmanlar={[
        [0.2, <g><rect x={0} y={0} width={1080} height={1920} fill={F.pastel} /><Leke x={540} y={980} w={1150} h={820} renk={F.pastel2} faz={4} /><Pencere x={780} y={600} s={0.9} /><Suslemeler tohum={6} /></g>],
        [0.6, <g><rect x={0} y={1290} width={1080} height={700} fill={F.gri2} /><Lamba x={150} y={1290} s={1} /><Bitki x={960} y={1300} s={1.15} buyuk /></g>],
        [1, <g>
          <Kanepe x={540} y={1270} s={0.95} />
          <Kisi x={470} y={1170} olcek={0.6} oturan ust={F.mor} poz={{sagUst: -95, sagAlt: -60, solUst: 20, bas: 6}} esya={tel} kirpma={70} />
          <Grup x={300} y={720} s={balon}>
            <ellipse cx={0} cy={0} rx={190} ry={140} fill={F.beyaz} />
            <circle cx={120} cy={150} r={22} fill={F.beyaz} /><circle cx={150} cy={195} r={12} fill={F.beyaz} />
            <Banka x={0} y={60} s={0.38} />
            <g opacity={carpi} transform={`scale(${0.6 + carpi * 0.4})`}>
              <circle cx={0} cy={-10} r={92} fill="none" stroke={F.mavi} strokeWidth={14} />
              <path d="M-60 -70 L60 50" stroke={F.mavi} strokeWidth={14} strokeLinecap="round" />
            </g>
          </Grup>
        </g>],
      ]} />
      <Ust>
        <Baslik metin="Krediyi aldıktan sonra" an={t("krediyi") - o} boyut={70} />
        <Baslik metin="şubeye gitmeden" an={t("şubeye") - o} boyut={96} vurgu={["gitmeden"]} />
      </Ust>
    </AbsoluteFill>
  );
};

// ---------- S5: Telefondan iptal, para geri ----------
const S5: React.FC<{o: number}> = ({o}) => {
  const f = useCurrentFrame();
  const kam = ara(f, 0, S[5] - o + 12, 1.0, 1.06, (x) => x);
  const iptal = t("iptal") - o;
  const dokun = ara(f, iptal - 10, iptal, 0, 1, yumusak);
  const bitti = f >= iptal + 3;
  const jet = (i: number) => {
    const d = f - (t("paranı") - o) - i * 5;
    if (d < 0 || d > 22) return null;
    const p = d / 22;
    return <Jeton key={i} x={540 + p * 260} y={1000 + p * 200 - Math.sin(p * Math.PI) * 260} s={0.9} r={p * 300} />;
  };
  return (
    <AbsoluteFill>
      <Dunya s={kam} katmanlar={[
        [0.2, <g><Leke x={540} y={900} w={1000} h={1000} renk={F.pastel2} faz={5} /><Leke x={200} y={1200} w={300} h={240} renk={F.gri2} /><Suslemeler tohum={8} /></g>],
        [1, <g>
          <Telefon x={470} y={930} s={1.15} r={-3} w={340} h={620}>
            <rect x={24} y={60} width={150} height={20} rx={10} fill={F.lacivert} />
            <rect x={24} y={110} width={292} height={250} rx={24} fill={F.pastel} />
            <circle cx={70} cy={160} r={26} fill={F.mavi} />
            <rect x={110} y={145} width={170} height={16} rx={8} fill={F.lacivert} />
            <rect x={110} y={172} width={120} height={12} rx={6} fill={F.gri} />
            <rect x={44} y={220} width={252} height={12} rx={6} fill={F.gri2} />
            <rect x={44} y={246} width={200} height={12} rx={6} fill={F.gri2} />
            <rect x={44} y={286} width={252} height={58} rx={29} fill={bitti ? "#22B07D" : F.mavi} transform={`scale(${1 - dokun * 0.04 * (bitti ? 0 : 1)})`} />
            <text x={170} y={324} textAnchor="middle" fontFamily="'Plus Jakarta Sans'" fontWeight={800} fontSize={24} fill="#fff">{bitti ? "İptal edildi ✓" : "Poliçeyi iptal et"}</text>
            <rect x={24} y={390} width={292} height={90} rx={20} fill={F.pastel} />
            <rect x={24} y={500} width={292} height={90} rx={20} fill={F.pastel} />
          </Telefon>
          <g opacity={f < iptal + 8 ? 1 : 0} transform={`translate(${720 - dokun * 90} ${1340 - dokun * 70})`}>
            <rect x={-30} y={0} width={60} height={160} rx={30} fill={F.ten1} />
            <circle cx={0} cy={0} r={30} fill={F.ten1} />
            {f >= iptal && f < iptal + 8 && <circle cx={0} cy={-6} r={20 + (f - iptal) * 8} fill="none" stroke={F.mavi} strokeWidth={6} opacity={1 - (f - iptal) / 8} />}
          </g>
          <Kumbara x={830} y={1290} s={0.85} />
          {[0, 1, 2, 3, 4].map(jet)}
        </g>],
      ]} />
      <Ust>
        <Baslik metin="Poliçeyi iptal et" an={t("poliçeyi") - o} boyut={84} vurgu={["iptal"]} />
        <Rozet an={t("geri") - o}>+ ₺ kuruşu kuruşuna geri</Rozet>
      </Ust>
    </AbsoluteFill>
  );
};

// ---------- S6: CTA ----------
const S6: React.FC<{o: number}> = ({o}) => {
  const f = useCurrentFrame();
  const kam = ara(f, 0, VID003F_SURE - o, 1.06, 1.0, yumusak);
  const yaz = t("SİGORTA") - o;
  const n = Math.max(0, Math.min(7, Math.floor((f - yaz) / 3) + 1));
  const el = Math.sin(f / 4) * 22;
  return (
    <AbsoluteFill>
      <Dunya s={kam} katmanlar={[
        [0.2, <g><Leke x={540} y={1000} w={1100} h={900} renk={F.pastel2} faz={6} /><Suslemeler tohum={10} /></g>],
        [0.7, <g><Dalga y={1300} renk={F.gri2} genlik={16} faz={3} /><Bitki x={950} y={1310} s={1.1} buyuk /></g>],
        [1, <g>
          <Belge x={760} y={960} s={0.95} r={6} baslik="REHBER" />
          <Kisi x={300} y={1330} olcek={0.62} ust={F.mor} poz={{sagUst: -150 + el, sagAlt: -30, solUst: 12}} />
        </g>],
      ]} />
      <div style={{position: "absolute", left: 90, right: 160, top: 300}}>
        <Baslik metin="Yorumlara yaz" an={0} boyut={84} />
        <div style={{marginTop: 22, background: F.beyaz, borderRadius: 28, padding: "18px 26px", display: "flex", alignItems: "center", gap: 18, boxShadow: "0 18px 40px rgba(69,66,118,0.15)", width: 700, opacity: ara(f, 4, 16, 0, 1, yumusak)}}>
          <div style={{width: 64, height: 64, borderRadius: 32, background: F.gri}} />
          <div style={{flex: 1, fontFamily: YAZI, fontWeight: 800, fontSize: 64, color: F.mavi, letterSpacing: 2}}>
            {f >= yaz ? "SİGORTA".slice(0, n) : ""}<span style={{opacity: Math.floor(f / 8) % 2 ? 0 : 1, color: F.lacivert}}>|</span>
          </div>
          <div style={{width: 64, height: 64, borderRadius: 32, background: F.mavi, display: "flex", alignItems: "center", justifyContent: "center"}}>
            <svg width="30" height="30" viewBox="0 0 30 30"><path d="M4 15 L26 15 M17 6 L26 15 L17 24" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        </div>
        <Rozet an={t("rehberini") - o} zemin={F.lacivert}>Rehberi hemen gönderiyorum</Rozet>
      </div>
    </AbsoluteFill>
  );
};

export const VID003F: React.FC = () => (
  <FlatVideo sahneler={[S1, S2, S3, S4, S5, S6]} sinir={S} kelimeler={K} vurgu={["sigortası", "zorunlu", "mecburi", "iptal", "geri", "sigorta"]} klasor="VID_003">
    <Sfx ad="kagit" an={t("kesilen")} ses={0.3} />
    <Sfx ad="jeton" an={t("binlerce")} ses={0.16} />
    <Sfx ad="pop" an={t("binlerce") + 2} ses={0.2} />
    <Sfx ad="pop" an={t("değil")} ses={0.25} />
    <Sfx ad="pop" an={t("sana")} ses={0.2} />
    <Sfx ad="tap" an={t("gösterse")} ses={0.25} />
    <Sfx ad="pop" an={t("şubeye") - 4} ses={0.2} />
    <Sfx ad="tap" an={t("gitmeden")} ses={0.25} />
    <Sfx ad="tap" an={t("iptal")} ses={0.35} />
    <Sfx ad="basari" an={t("iptal") + 3} ses={0.2} />
    <Sfx ad="jeton" an={t("paranı")} ses={0.18} />
    <Sfx ad="pop" an={t("geri")} ses={0.2} />
    {[0, 3, 6, 9, 12, 15, 18].map((d) => <Sfx key={d} ad="tap" an={t("SİGORTA") + d} ses={0.15} />)}
    <Sfx ad="pop" an={t("rehberini")} ses={0.2} />
    <Sfx ad="basari" an={t("göndereyim")} ses={0.14} />
  </FlatVideo>
);
