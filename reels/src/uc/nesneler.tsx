import {RoundedBox} from "@react-three/drei";
import {useMemo} from "react";
import * as THREE from "three";
import {F} from "../flat/tema";

// ---- malzemeler: yumuşak pastel, hafif clearcoat ----
export const Mat: React.FC<{c: string; r?: number; m?: number; cc?: number}> = ({c, r = 0.45, m = 0, cc = 0.6}) => <meshPhysicalMaterial color={c} roughness={r} metalness={m} clearcoat={cc} clearcoatRoughness={0.25} emissive={c} emissiveIntensity={c.toUpperCase() === "#FFFFFF" ? 0.18 : 0.06} />;
export const ALTIN = "#F2B53A";

// ---- Canvas dokusu (yazı/arayüz çizimi); fontlar yüklendikten sonra çizilir ----
export const useDoku = (w: number, h: number, ciz: (c: CanvasRenderingContext2D) => void, anahtar: string) =>
  useMemo(() => {
    const cv = document.createElement("canvas");
    cv.width = w; cv.height = h;
    const c = cv.getContext("2d")!;
    ciz(c);
    const t = new THREE.CanvasTexture(cv);
    t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
    return t;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [w, h, anahtar]);
export const yuvarlak = (c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, renk: string) => {
  c.fillStyle = renk; c.beginPath(); c.roundRect(x, y, w, h, r); c.fill();
};
const YZ = "'Plus Jakarta Sans', sans-serif";

type P = {position?: [number, number, number]; rotation?: [number, number, number]; scale?: number | [number, number, number]};

export const Jeton3D: React.FC<P> = (p) => {
  const ust = useDoku(256, 256, (c) => {
    c.fillStyle = "#F7C654"; c.fillRect(0, 0, 256, 256);
    c.fillStyle = "#E7A62A"; c.beginPath(); c.arc(128, 128, 96, 0, Math.PI * 2); c.fill();
    c.fillStyle = "#FFE29A"; c.font = `800 120px ${YZ}`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("₺", 128, 136);
  }, "jeton");
  return (
    <mesh {...p} castShadow>
      <cylinderGeometry args={[0.36, 0.36, 0.09, 48]} />
      <meshPhysicalMaterial attach="material-0" color={ALTIN} metalness={0.85} roughness={0.28} />
      <meshPhysicalMaterial attach="material-1" map={ust} metalness={0.7} roughness={0.3} />
      <meshPhysicalMaterial attach="material-2" map={ust} metalness={0.7} roughness={0.3} />
    </mesh>
  );
};

export const Belge3D: React.FC<P & {baslik?: string; vurgu?: string}> = ({baslik = "", vurgu = F.mavi, ...p}) => {
  const doku = useDoku(512, 680, (c) => {
    yuvarlak(c, 0, 0, 512, 680, 28, "#FFFFFF");
    yuvarlak(c, 44, 48, 200, 26, 13, vurgu);
    c.fillStyle = F.lacivert; c.font = `800 44px ${YZ}`; c.fillText(baslik, 44, 140);
    for (let i = 0; i < 7; i++) yuvarlak(c, 44, 190 + i * 52, i % 3 === 2 ? 280 : 420, 18, 9, "#DCE6FB");
    yuvarlak(c, 44, 580, 160, 48, 24, vurgu);
  }, `belge${baslik}${vurgu}`);
  return (
    <group {...p}>
      <RoundedBox args={[1.6, 2.12, 0.05]} radius={0.05} smoothness={4} castShadow><Mat c="#FFFFFF" r={0.6} /></RoundedBox>
      <mesh position={[0, 0, 0.027]}><planeGeometry args={[1.56, 2.08]} /><meshStandardMaterial map={doku} roughness={0.7} /></mesh>
    </group>
  );
};

const Alinlik: React.FC = () => {
  const geo = useMemo(() => {
    const sh = new THREE.Shape(); sh.moveTo(-2.1, 0); sh.lineTo(2.1, 0); sh.lineTo(0, 1.0); sh.closePath();
    const g = new THREE.ExtrudeGeometry(sh, {depth: 1.9, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 3}); g.translate(0, 0, -0.9); return g;
  }, []);
  return <mesh geometry={geo} position={[0, 2.88, 0.05]} castShadow><Mat c={F.lacivert} /></mesh>;
};
export const Banka3D: React.FC<P> = (p) => (
  <group {...p}>
    <RoundedBox args={[4.2, 0.3, 2.2]} radius={0.06} position={[0, 0.15, 0]} castShadow receiveShadow><Mat c={F.gri} /></RoundedBox>
    <RoundedBox args={[3.9, 0.22, 2.0]} radius={0.05} position={[0, 0.41, 0]} castShadow receiveShadow><Mat c="#FFFFFF" /></RoundedBox>
    {[-1.5, -0.75, 0, 0.75, 1.5].map((x) => (
      <mesh key={x} position={[x, 1.55, 0.6]} castShadow><cylinderGeometry args={[0.2, 0.22, 2.1, 32]} /><Mat c="#FFFFFF" /></mesh>
    ))}
    <RoundedBox args={[3.9, 1.9, 1.0]} radius={0.04} position={[0, 1.55, -0.3]} castShadow><Mat c={F.pastel} r={0.7} /></RoundedBox>
    <RoundedBox args={[4.1, 0.28, 2.1]} radius={0.05} position={[0, 2.74, 0.05]} castShadow><Mat c={F.gri} /></RoundedBox>
    <Alinlik />
    <mesh position={[0, 3.25, 1.07]}><circleGeometry args={[0.22, 32]} /><Mat c={F.mavi} /></mesh>
  </group>
);

export const Terazi3D: React.FC<P & {egim: number}> = ({egim, ...p}) => {
  const kefe = (x: number, renk: string) => (
    <group position={[x, 0, 0]} rotation={[0, 0, -egim]}>
      {[-0.42, 0.42].map((dx) => <mesh key={dx} position={[dx / 2, -0.45, 0]} rotation={[0, 0, dx > 0 ? 0.45 : -0.45]}><cylinderGeometry args={[0.012, 0.012, 1.0, 8]} /><Mat c={F.mor} /></mesh>)}
      <mesh position={[0, -0.95, 0]} rotation={[Math.PI, 0, 0]} castShadow><sphereGeometry args={[0.55, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2.6]} /><meshPhysicalMaterial color={renk} roughness={0.35} clearcoat={0.8} side={THREE.DoubleSide} /></mesh>
    </group>
  );
  return (
    <group {...p}>
      <RoundedBox args={[1.6, 0.22, 1.0]} radius={0.08} position={[0, 0.11, 0]} castShadow receiveShadow><Mat c={F.lacivert} /></RoundedBox>
      <mesh position={[0, 1.4, 0]} castShadow><cylinderGeometry args={[0.07, 0.1, 2.5, 24]} /><Mat c={F.lacivert} /></mesh>
      <mesh position={[0, 2.72, 0]} castShadow><sphereGeometry args={[0.16, 32, 16]} /><Mat c={F.mavi} /></mesh>
      <group position={[0, 2.55, 0]} rotation={[0, 0, egim]}>
        <RoundedBox args={[3.0, 0.09, 0.12]} radius={0.04} castShadow><Mat c={F.mor} /></RoundedBox>
        {kefe(-1.42, F.gri)}{kefe(1.42, F.mavi)}
      </group>
    </group>
  );
};

export const Tik3D: React.FC<P & {p: number}> = ({p: ilerleme, ...p}) => {
  const egri = useMemo(() => new THREE.CatmullRomCurve3([new THREE.Vector3(-0.42, 0, 0), new THREE.Vector3(-0.12, -0.3, 0), new THREE.Vector3(0.5, 0.38, 0)], false, "catmullrom", 0.1), []);
  const geo = useMemo(() => new THREE.TubeGeometry(egri, 48, 0.09, 16, false), [egri]);
  geo.setDrawRange(0, Math.floor(geo.index!.count * Math.max(0.001, ilerleme)));
  return (
    <group {...p}>
      <mesh castShadow><cylinderGeometry args={[0.85, 0.85, 0.16, 64]} /><Mat c={F.mavi} r={0.3} cc={1} /></mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.1, 0]} geometry={geo}><Mat c="#FFFFFF" r={0.3} /></mesh>
    </group>
  );
};

export const Tabela3D: React.FC<P & {cizgi: number; yazi: string}> = ({cizgi, yazi, ...p}) => {
  const doku = useDoku(1024, 400, (c) => {
    yuvarlak(c, 0, 0, 1024, 400, 60, F.mavi);
    c.fillStyle = "#FFFFFF"; c.font = `800 170px ${YZ}`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(yazi, 512, 210);
  }, `tabela${yazi}`);
  return (
    <group {...p}>
      <mesh position={[0, -1.3, -0.05]} castShadow><cylinderGeometry args={[0.07, 0.07, 2.6, 16]} /><Mat c={F.lacivert} /></mesh>
      <RoundedBox args={[3.2, 1.3, 0.16]} radius={0.12} castShadow><Mat c={F.mavi} r={0.35} cc={1} /></RoundedBox>
      <mesh position={[0, 0, 0.085]}><planeGeometry args={[3.1, 1.21]} /><meshStandardMaterial map={doku} roughness={0.4} /></mesh>
      <RoundedBox args={[2.7 * cizgi + 0.001, 0.14, 0.12]} radius={0.06} position={[-1.35 + 1.35 * cizgi, 0, 0.16]} rotation={[0, 0, -0.06]} castShadow><Mat c={F.lacivert} /></RoundedBox>
    </group>
  );
};

export const Telefon3D: React.FC<P & {ekran: THREE.Texture}> = ({ekran, ...p}) => (
  <group {...p}>
    <RoundedBox args={[1.5, 3.0, 0.16]} radius={0.18} smoothness={6} castShadow><Mat c={F.lacivert} r={0.3} cc={1} /></RoundedBox>
    <mesh position={[0, 0, 0.082]}><planeGeometry args={[1.36, 2.84]} /><meshStandardMaterial map={ekran} roughness={0.25} emissive="#ffffff" emissiveIntensity={0.08} emissiveMap={ekran} /></mesh>
  </group>
);

export const Kumbara3D: React.FC<P> = (p) => (
  <group {...p}>
    <mesh castShadow scale={[1.2, 0.95, 0.95]} position={[0, 0.75, 0]}><sphereGeometry args={[0.7, 48, 32]} /><Mat c={F.mavi} r={0.3} cc={1} /></mesh>
    <mesh castShadow rotation={[0, 0, Math.PI / 2]} position={[0.88, 0.78, 0]}><cylinderGeometry args={[0.24, 0.26, 0.2, 32]} /><Mat c="#1F55CC" /></mesh>
    {[-0.3, 0.3].map((z) => <mesh key={z} position={[0.45, 1.35, z]} castShadow rotation={[0.2 * Math.sign(z), 0, -0.3]}><coneGeometry args={[0.14, 0.3, 24]} /><Mat c="#1F55CC" /></mesh>)}
    {[[-0.45, -0.35], [-0.45, 0.35], [0.45, -0.35], [0.45, 0.35]].map(([x, z], i) => <mesh key={i} position={[x, 0.15, z]} castShadow><cylinderGeometry args={[0.13, 0.13, 0.3, 24]} /><Mat c="#1F55CC" /></mesh>)}
    <RoundedBox args={[0.42, 0.05, 0.1]} radius={0.02} position={[-0.05, 1.42, 0]}><Mat c={F.lacivert} /></RoundedBox>
    {[-0.2, 0.2].map((z) => <mesh key={z} position={[0.62, 0.98, z]}><sphereGeometry args={[0.05, 16, 16]} /><Mat c={F.koyu} /></mesh>)}
  </group>
);

export const Kanepe3D: React.FC<P> = (p) => (
  <group {...p}>
    <RoundedBox args={[4.2, 0.6, 1.5]} radius={0.22} position={[0, 0.55, 0]} castShadow receiveShadow><Mat c={F.lacivert} r={0.8} cc={0} /></RoundedBox>
    <RoundedBox args={[4.2, 1.4, 0.45]} radius={0.22} position={[0, 1.15, -0.55]} castShadow><Mat c={F.mor} r={0.8} cc={0} /></RoundedBox>
    {[-2.05, 2.05].map((x) => <RoundedBox key={x} args={[0.45, 1.0, 1.5]} radius={0.2} position={[x, 0.85, 0]} castShadow><Mat c={F.mor} r={0.8} cc={0} /></RoundedBox>)}
    {[-0.95, 0.95].map((x) => <RoundedBox key={x} args={[1.7, 0.3, 1.2]} radius={0.14} position={[x, 0.98, 0.05]} castShadow><Mat c="#6E6AA0" r={0.85} cc={0} /></RoundedBox>)}
  </group>
);

export const Yasak3D: React.FC<P> = (p) => (
  <group {...p}>
    <mesh castShadow><torusGeometry args={[1.0, 0.12, 24, 64]} /><Mat c={F.mavi} r={0.3} cc={1} /></mesh>
    <RoundedBox args={[1.9, 0.22, 0.2]} radius={0.1} rotation={[0, 0, -Math.PI / 4]} castShadow><Mat c={F.mavi} r={0.3} cc={1} /></RoundedBox>
  </group>
);

export const Bitki3D: React.FC<P & {f: number}> = ({f, ...p}) => (
  <group {...p}>
    <mesh position={[0, 0.3, 0]} castShadow><cylinderGeometry args={[0.38, 0.28, 0.6, 32]} /><Mat c={F.mavi} /></mesh>
    {[0, 1, 2, 3, 4].map((i) => (
      <mesh key={i} castShadow position={[Math.sin(i * 1.3) * 0.2, 1.05 + (i % 2) * 0.25, Math.cos(i * 1.3) * 0.2]} rotation={[Math.sin(f / 40 + i) * 0.08 + (i - 2) * 0.25, i, (i - 2) * 0.3]} scale={[0.22, 0.6, 0.08]}>
        <sphereGeometry args={[1, 24, 16]} /><Mat c={i % 2 ? F.mor : "#7C78AE"} r={0.6} cc={0.2} />
      </mesh>
    ))}
  </group>
);

export const Balon3D: React.FC<P & {doku: THREE.Texture}> = ({doku, ...p}) => (
  <group {...p}>
    <RoundedBox args={[3.4, 1.4, 0.25]} radius={0.3} smoothness={6} castShadow><Mat c="#FFFFFF" r={0.4} /></RoundedBox>
    <mesh position={[-1.0, -0.82, 0]} rotation={[0, 0, 0.4]} castShadow><coneGeometry args={[0.25, 0.5, 3]} /><Mat c="#FFFFFF" r={0.4} /></mesh>
    <mesh position={[0, 0, 0.13]}><planeGeometry args={[3.1, 1.15]} /><meshStandardMaterial map={doku} roughness={0.5} /></mesh>
  </group>
);
