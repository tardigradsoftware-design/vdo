import {ThreeCanvas} from "@remotion/three";
import {RoundedBox} from "@react-three/drei";
import {useCurrentFrame, useVideoConfig} from "remotion";

export const Test3D: React.FC = () => {
  const f = useCurrentFrame();
  const {width, height} = useVideoConfig();
  return (
    <ThreeCanvas width={width} height={height} shadows camera={{position: [0, 2, 9], fov: 35}} style={{background: "#EAF1FF"}}>
      <hemisphereLight args={["#ffffff", "#B0C2E2", 1.2]} />
      <directionalLight position={[4, 8, 5]} intensity={2.2} castShadow shadow-mapSize={[2048, 2048]} />
      <RoundedBox args={[2, 2, 2]} radius={0.25} smoothness={6} rotation={[0.4, f * 0.03, 0]} position={[0, 1, 0]} castShadow>
        <meshPhysicalMaterial color="#2869F5" clearcoat={1} roughness={0.35} />
      </RoundedBox>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[30, 30]} /><meshStandardMaterial color="#EAF1FF" /></mesh>
    </ThreeCanvas>
  );
};
