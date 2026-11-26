// VİDEO KABUĞU — sahne yöneticisi: sahneler, geçişler, altyazı, ses
import {AbsoluteFill, Sequence} from "remotion";
import {Altyazi} from "./Altyazi";
import {Gecis, Gecisler} from "./Gecis";
import {R} from "./marka";
import {Efekt, SesKatmani} from "./Ses";
import {Kelime} from "./zaman";
export type SahneTanim = {ad: string; bas: number; son: number; S: React.FC};
export const MotorVideo: React.FC<{sahneler: SahneTanim[]; gecisler: Gecis[]; K: Kelime[]; anahtar: string[]; altyaziGizli?: [number, number][]; anlatim: string; muzik: string; efektler: Efekt[]}> = ({sahneler, gecisler, K, anahtar, altyaziGizli, anlatim, muzik, efektler}) => (
  <AbsoluteFill style={{background: R.zemin}}>
    {sahneler.map((s) => <Sequence key={s.ad} name={s.ad} from={s.bas} durationInFrames={s.son - s.bas}><s.S /></Sequence>)}
    <Gecisler liste={gecisler} />
    <Altyazi K={K} anahtar={anahtar} gizli={altyaziGizli} />
    <SesKatmani anlatim={anlatim} muzik={muzik} efektler={efektler} />
  </AbsoluteFill>
);
