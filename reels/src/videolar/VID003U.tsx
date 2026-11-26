import {ThreeCanvas} from "@remotion/three";
import {ContactShadows} from "@react-three/drei";
import {useThree} from "@react-three/fiber";
import {useEffect, useState} from "react";
import {AbsoluteFill, Audio, Easing, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import * as THREE from "three";
import kelimeler from "../../public/VID_003/kelimeler.json";
import {Kelime, kare} from "../ortak/stil";
import {zamanlayici} from "../ortak/parcalar";
import {F, YAZI} from "../flat/tema";
import {Altyazi, Baslik, Sfx} from "../flat/Video";
import {Balon3D, Banka3D, Belge3D, Bitki3D, Jeton3D, Kanepe3D, Kumbara3D, Tabela3D, Telefon3D, Terazi3D, Tik3D, Yasak3D, useDoku, yuvarlak} from "../uc/nesneler";

const K = kelimeler as Kelime[];
const t = zamanlayici(K);
export const VID003U_SURE = kare(K[K.length - 1].bitis) + 30;
const S = [0, t("aslında"), t("Banka"), t("krediyi"), t("poliçeyi"), t("Yorumlara"), VID003U_SURE];
const io = Easing.bezier(0.65, 0, 0.35, 1);
const out = Easing.bezier(0.16, 1, 0.3, 1);
const ara = (f: number, a: number, b: number, x: number, y: number, e = out) => interpolate(f, [a, b], [x, y], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e});
const geri = (f: number, an: number, sure = 14) => ara(f, an, an + sure, 0, 1, Easing.out(Easing.back(1.7)));
type V3 = [number, number, number];

// İstasyon başına kamera: [başlangıç pozisyonu, bitiş pozisyonu, hedef]
const KAMERA: [V3, V3, V3][] = [
  [[1.0, 3.6, 13.95], [0.3, 3.0, 11.52], [0, 2.25, 0]],
  [[11.4, 3.6, 12.78], [9.6, 3.2, 11.16], [10, 2.25, 0]],
  [[18.6, 3.3, 11.52], [21.4, 3.2, 11.34], [20, 2.35, 0]],
  [[30.4, 3.0, 13.4], [30.6, 4.0, 16.4], [30.5, 1.8, 0]],
  [[39.4, 3.4, 12.60], [40.0, 2.9, 9.72], [40.8, 2.25, 0]],
  [[51.0, 3.4, 14.6], [51.0, 2.9, 13.2], [51.0, 2.35, 0]],
];
const lerp3 = (a: V3, b: V3, p: number): V3 => [a[0] + (b[0] - a[0]) * p, a[1] + (b[1] - a[1]) * p, a[2] + (b[2] - a[2]) * p];
const kameraDurumu = (f: number) => {
  const G1 = 14, G2 = 10; // geçiş: sınırdan 14 kare önce başla, 10 kare sonra bitir
  for (let i = 0; i < 6; i++) {
    const bas = S[i] + (i ? G2 : 0), son = S[i + 1] - (i < 5 ? G1 : 0);
    if (f < son || i === 5) {
      if (i > 0 && f < bas) { // geçiş içindeyiz (i-1 → i)
        const p = io((f - (S[i] - G1)) / (G1 + G2));
        const a = KAMERA[i - 1], b = KAMERA[i];
        const pos = lerp3(a[1], b[0], p); pos[1] += Math.sin(p * Math.PI) * 0.8; pos[2] += Math.sin(p * Math.PI) * 1.2;
        return {pos, hedef: lerp3(a[2], b[2], p)};
      }
      const p = Math.max(0, Math.min(1, (f - bas) / Math.max(1, son - bas)));
      const e = io(p);
      return {pos: lerp3(KAMERA[i][0], KAMERA[i][1], e), hedef: KAMERA[i][2]};
    }
  }
  return {pos: KAMERA[5][1], hedef: KAMERA[5][2]};
};

const Kamera: React.FC = () => {
  const f = useCurrentFrame();
  const {camera} = useThree();
  const {pos, hedef} = kameraDurumu(f);
  camera.position.set(pos[0] + Math.sin(f / 50) * 0.06, pos[1] + Math.sin(f / 37) * 0.04, pos[2]);
  camera.lookAt(hedef[0], hedef[1], hedef[2]);
  return null;
};
// Telefon ekranı (iptal öncesi/sonrası)
const useEkran = (bitti: boolean) => useDoku(560, 1170, (c) => {
  yuvarlak(c, 0, 0, 560, 1170, 60, "#FFFFFF");
  yuvarlak(c, 220, 30, 120, 22, 11, F.lacivert);
  c.fillStyle = F.lacivert; c.font = `800 46px 'Plus Jakarta Sans'`; c.fillText("Poliçelerim", 44, 150);
  yuvarlak(c, 34, 200, 492, 430, 36, F.pastel);
  c.fillStyle = F.mavi; c.beginPath(); c.arc(100, 270, 36, 0, Math.PI * 2); c.fill();
  c.fillStyle = F.lacivert; c.font = `800 32px 'Plus Jakarta Sans'`; c.fillText("Kredi Hayat", 160, 262); c.fillText("Sigortası", 160, 300);
  for (let i = 0; i < 3; i++) yuvarlak(c, 64, 360 + i * 40, i === 2 ? 260 : 420, 16, 8, "#C9D6EE");
  yuvarlak(c, 64, 510, 432, 90, 45, bitti ? "#22B07D" : F.mavi);
  c.fillStyle = "#FFFFFF"; c.font = `800 34px 'Plus Jakarta Sans'`; c.textAlign = "center"; c.fillText(bitti ? "İptal edildi ✓" : "Poliçeyi iptal et", 280, 567); c.textAlign = "left";
  for (let i = 0; i < 2; i++) yuvarlak(c, 34, 680 + i * 200, 492, 170, 36, F.pastel);
}, `ekran${bitti}`);
const useBalon = (n: number) => useDoku(1100, 400, (c) => {
  c.fillStyle = "#FFFFFF"; c.fillRect(0, 0, 1100, 400);
  c.fillStyle = F.gri; c.beginPath(); c.arc(110, 200, 60, 0, Math.PI * 2); c.fill();
  c.fillStyle = F.mavi; c.font = `800 150px 'Plus Jakarta Sans'`; c.textBaseline = "middle"; c.fillText("SİGORTA".slice(0, n) + (n < 7 ? "|" : ""), 210, 212);
}, `balon${n}`);

const Dunya: React.FC = () => {
  const f = useCurrentFrame();
  const yerel = (k: string, i = 0) => t(k, i);
  // A: banka
  const police = geri(f, yerel("hayat"));
  const jetonlar = Array.from({length: 8}).map((_, i) => {
    const d = f - yerel("binlerce") - i * 4;
    const p = ara(d, 0, 22, 0, 1, io);
    const pos: V3 = [-0.6 + p * 2.1, 0.3 + i * 0.0 + Math.sin(p * Math.PI) * 1.6 + p * 0.9, 1.2 - p * 0.6];
    return <Jeton3D key={i} position={d < 0 ? [-0.6, 0.05 + i * 0.1, 1.2] : pos} rotation={[Math.PI / 2 * (d < 0 ? 0 : 1) + p * 4, 0, p * 2]} scale={d > 22 ? 0.001 : 1} />;
  });
  // B: terazi
  const egim = ara(f, yerel("yasal"), yerel("yasal") + 26, 0, 0.22, Easing.out(Easing.back(1.4))) + Math.sin(f / 16) * 0.01;
  const tik = ara(f, yerel("değil"), yerel("değil") + 16, 0, 1);
  // C: tabela
  const tabela = geri(f, yerel("sana"));
  const cizgi = ara(f, yerel("gösterse"), yerel("gösterse") + 14, 0, 1);
  // D: ev
  const yasak = geri(f, yerel("gitmeden"));
  // E: telefon
  const iptal = yerel("iptal");
  const bitti = f >= iptal + 2;
  const ekran = useEkran(bitti);
  const bas = f >= iptal - 2 && f < iptal + 6 ? 0.96 : 1;
  const akis = Array.from({length: 10}).map((_, i) => {
    const d = f - yerel("paranı") - i * 3;
    if (d < 0 || d > 24) return null;
    const p = ara(d, 0, 24, 0, 1, io);
    return <Jeton3D key={i} position={[40.6 + p * 1.25, 2.2 + Math.sin(p * Math.PI) * 1.4 - p * 0.8, 0.4 + p * 0.7]} rotation={[p * 6, i, p * 3]} scale={0.8} />;
  });
  // F: CTA
  const n = Math.max(0, Math.min(7, Math.floor((f - yerel("SİGORTA")) / 3) + 1));
  const balon = useBalon(f >= yerel("SİGORTA") ? n : 0);
  const balonP = geri(f, S[5] + 4);
  const rehber = geri(f, yerel("rehberini"));
  return (
    <>
      {/* A */}
      <Banka3D position={[0, 0, -2.6]} scale={0.95} />
      <Belge3D position={[-1.25, 1.35, 0.7]} rotation={[0, 0.35, 0.05]} baslik="KREDİ" scale={0.85} />
      <group position={[1.35, 1.45 + Math.sin(f / 20) * 0.05, 0.8]} scale={police} rotation={[0, -0.35, -0.04]}><Belge3D baslik="HAYAT SİGORTASI" scale={0.85} vurgu={F.mor} /></group>
      {jetonlar}
      <Bitki3D position={[-3.0, 0, 0.4]} f={f} />
      {/* B */}
      <Terazi3D position={[10, 0, 0]} egim={egim} scale={1.05} />
      <group position={[8.55, 1.6 + egim * 2.2, 0.1]} rotation={[0, 0.3, 0]}><Belge3D baslik="KANUN" scale={0.45} /></group>
      <Tik3D position={[11.2, 3.75, 0.6]} rotation={[Math.PI / 2, 0, 0]} scale={tik * 0.75 + 0.0001} p={ara(f, yerel("değil") + 4, yerel("değil") + 16, 0, 1)} />
      <Bitki3D position={[12.6, 0, -0.8]} f={f + 30} />
      {/* C */}
      <group position={[20, 2.4, 0]} scale={tabela + 0.0001} rotation={[0, Math.sin(f / 30) * 0.04, 0]}><Tabela3D yazi="ZORUNLU" cizgi={cizgi} /></group>
      <Belge3D position={[22.2, 1.3, -0.6]} rotation={[0, -0.5, 0.08]} baslik="ŞARTLAR" scale={0.7} />
      <Bitki3D position={[17.6, 0, 0.2]} f={f + 60} />
      {/* D */}
      <Kanepe3D position={[30, 0, -0.3]} />
      <group position={[29.4, 1.24, 0.2]} rotation={[-1.2, 0, 0.3]}><Telefon3D ekran={ekran} scale={0.3} /></group>
      <group position={[32.6, 0, -1.6]} scale={0.42}><Banka3D /></group>
      <group position={[32.6, 1.45, -0.4]} scale={yasak * 1.05 + 0.0001}><Yasak3D /></group>
      <Bitki3D position={[27.6, 0, -0.9]} f={f + 90} scale={1.1} />
      {/* E */}
      <group position={[40.2, 2.1, 0]} rotation={[0.02, 0.3, -0.04]} scale={bas}><Telefon3D ekran={ekran} scale={1.15} /></group>
      <Kumbara3D position={[41.9, 0, 1.1]} rotation={[0, -0.6, 0]} scale={0.9} />
      {akis}
      {/* F */}
      <group position={[50.4, 2.7 + Math.sin(f / 22) * 0.06, 0]} scale={balonP + 0.0001} rotation={[0, 0.12, 0]}><Balon3D doku={balon} /></group>
      <group position={[52.4, 1.2 + Math.sin(f / 25) * 0.08, 0.6]} scale={rehber + 0.0001} rotation={[0, -0.4 + Math.sin(f / 40) * 0.1, 0.06]}><Belge3D baslik="REHBER" scale={0.8} /></group>
      {[0, 1, 2].map((i) => <Jeton3D key={i} position={[49.2 + i * 0.9, 0.8 + Math.sin(f / 18 + i) * 0.15, 1.2]} rotation={[1.2, f * 0.04 + i, 0]} scale={0.6 * rehber + 0.0001} />)}
    </>
  );
};

const Sahne3D: React.FC = () => {
  const {width, height} = useVideoConfig();
  const f = useCurrentFrame();
  const {hedef} = kameraDurumu(f);
  return (
    <ThreeCanvas width={width} height={height} shadows camera={{fov: 40, near: 0.1, far: 80}} gl={{toneMapping: THREE.NoToneMapping}}>
      <color attach="background" args={[F.pastel]} />
      <fog attach="fog" args={[F.pastel, 16, 30]} />
      <Kamera />
      <hemisphereLight args={["#ffffff", "#C9D6EE", 1.55]} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[hedef[0] + 4, 9, 6]} intensity={1.25} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-7} shadow-camera-right={7} shadow-camera-top={7} shadow-camera-bottom={-7} shadow-bias={-0.0004} target-position={[hedef[0], 0, 0]} />
      <directionalLight position={[hedef[0] - 6, 4, -4]} intensity={0.6} color="#C9D6EE" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[26, -0.002, 0]}><planeGeometry args={[200, 120]} /><meshBasicMaterial color={F.pastel} fog={false} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[26, 0, 0]} receiveShadow><planeGeometry args={[200, 120]} /><shadowMaterial color={F.lacivert} opacity={0.22} /></mesh>
      <ContactShadows position={[hedef[0], 0.005, 0]} scale={16} blur={2.6} opacity={0.35} far={4} resolution={1024} color={F.lacivert} frames={1} />
      <Dunya />
    </ThreeCanvas>
  );
};

// Başlık katmanı: sahne bitmeden yumuşakça kaybolur
const Katman: React.FC<{bas: number; son: number; children: React.ReactNode}> = ({bas, son, children}) => (
  <Sequence from={bas} durationInFrames={son - bas} layout="none"><Solan sure={son - bas}>{children}</Solan></Sequence>
);
const Solan: React.FC<{sure: number; children: React.ReactNode}> = ({sure, children}) => {
  const f = useCurrentFrame();
  const o = ara(f, sure - 12, sure, 1, 0, io);
  return <div style={{position: "absolute", left: 90, right: 160, top: 300, opacity: o, translate: `0 ${(1 - o) * -30}px`, filter: `blur(${(1 - o) * 8}px)`}}>{children}</div>;
};
const Rozet: React.FC<{an: number; children: React.ReactNode; zemin?: string}> = ({an, children, zemin = F.mavi}) => {
  const f = useCurrentFrame();
  const p = ara(f, an, an + 12, 0, 1);
  return <div style={{display: "inline-block", marginTop: 16, fontFamily: YAZI, fontWeight: 800, fontSize: 40, color: "#fff", background: zemin, padding: "10px 26px", borderRadius: 999, scale: `${0.6 + p * 0.4}`, opacity: p, transformOrigin: "0 50%", boxShadow: "0 12px 30px rgba(40,105,245,0.25)"}}>{children}</div>;
};

export const VID003U: React.FC = () => {
  const [h] = useState(() => delayRender("fontlar"));
  const [hazir, setHazir] = useState(false);
  useEffect(() => {
    Promise.all([document.fonts.load("800 64px 'Plus Jakarta Sans'"), document.fonts.load("600 64px 'Plus Jakarta Sans'")]).then(() => { setHazir(true); continueRender(h); });
  }, [h]);
  const o = (i: number) => S[i];
  return (
    <AbsoluteFill style={{background: F.pastel}}>
      {hazir && <Sahne3D />}
      <AbsoluteFill style={{background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(69,66,118,0.18) 100%)"}} />
      <AbsoluteFill style={{background: "linear-gradient(180deg, rgba(234,241,255,0.92) 0%, rgba(234,241,255,0) 32%)"}} />
      <Katman bas={0} son={S[1]}>
        <Baslik metin="Kredi çekerken" an={t("kredi", 0)} boyut={76} />
        <Baslik metin="hayat sigortası" an={t("hayat")} boyut={96} vurgu={["sigortası"]} />
        <Rozet an={t("binlerce")} zemin={F.lacivert}>− ₺ binlerce lira</Rozet>
      </Katman>
      <Katman bas={S[1]} son={S[2]}>
        <Baslik metin="Yasal olarak" an={t("yasal") - o(1)} boyut={76} />
        <Baslik metin="zorunlu değil" an={t("zorunlu") - o(1)} boyut={108} vurgu={["değil"]} />
      </Katman>
      <Katman bas={S[2]} son={S[3]}>
        <Baslik metin="Mecburi gibi" an={t("mecburi") - o(2)} boyut={96} />
        <Baslik metin="gösterilir" an={t("gösterse") - o(2)} boyut={96} vurgu={["gösterilir"]} />
      </Katman>
      <Katman bas={S[3]} son={S[4]}>
        <Baslik metin="Krediyi aldıktan sonra" an={t("krediyi") - o(3)} boyut={68} />
        <Baslik metin="şubeye gitmeden" an={t("şubeye") - o(3)} boyut={100} vurgu={["gitmeden"]} />
      </Katman>
      <Katman bas={S[4]} son={S[5]}>
        <Baslik metin="Poliçeyi iptal et" an={t("poliçeyi") - o(4)} boyut={92} vurgu={["iptal"]} />
        <Rozet an={t("geri") - o(4)}>+ ₺ kuruşu kuruşuna geri</Rozet>
      </Katman>
      <Katman bas={S[5]} son={VID003U_SURE + 12}>
        <Baslik metin="Yorumlara yaz" an={2} boyut={92} />
        <Rozet an={t("rehberini") - o(5)} zemin={F.lacivert}>Rehberi hemen gönderiyorum</Rozet>
      </Katman>
      <Altyazi kelimeler={K} vurgu={["sigortası", "zorunlu", "mecburi", "iptal", "geri", "sigorta"]} />
      <Audio src={staticFile("VID_003/ses.mp3")} />
      <Audio src={staticFile("VID_003/muzik.wav")} volume={0.13} />
      {S.slice(1, -1).map((s, i) => <Sfx key={i} ad="whoosh" an={s - 12} ses={0.24} />)}
      <Sfx ad="jeton" an={t("binlerce")} ses={0.18} />
      <Sfx ad="pop" an={t("hayat")} ses={0.2} />
      <Sfx ad="pop" an={t("değil")} ses={0.24} />
      <Sfx ad="basari" an={t("değil") + 6} ses={0.1} />
      <Sfx ad="pop" an={t("sana")} ses={0.2} />
      <Sfx ad="tap" an={t("gösterse")} ses={0.25} />
      <Sfx ad="pop" an={t("gitmeden")} ses={0.22} />
      <Sfx ad="tap" an={t("iptal")} ses={0.35} />
      <Sfx ad="basari" an={t("iptal") + 3} ses={0.2} />
      <Sfx ad="jeton" an={t("paranı")} ses={0.2} />
      <Sfx ad="pop" an={S[5] + 4} ses={0.2} />
      {[0, 3, 6, 9, 12, 15, 18].map((d) => <Sfx key={d} ad="tap" an={t("SİGORTA") + d} ses={0.15} />)}
      <Sfx ad="pop" an={t("rehberini")} ses={0.2} />
      <Sfx ad="basari" an={t("göndereyim")} ses={0.14} />
    </AbsoluteFill>
  );
};
