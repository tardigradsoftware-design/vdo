import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from "remotion";
import {Altyazi} from "./Altyazi";
import {sarsinti} from "./Damga";
import {Ilerleme} from "./Ilerleme";
import {Sahne} from "./Sahne";
import {MuzikYatagi, Sfx} from "./Sfx";
import {Zemin} from "./Zemin";
import {Kelime} from "./stil";

// Ortak video iskeleti: zemin, sahneler + dalış geçişi, sarsıntı, altyazı, ilerleme, ses, müzik, temel efektler
export const Video: React.FC<{
  sahneler: React.FC<{o: number}>[];
  sinir: number[]; // sahne başlangıç kareleri + toplam süre
  damgalar: number[];
  kelimeler: Kelime[];
  ses: string;
  vurgu?: string[];
  children?: React.ReactNode; // ek efekt sesleri
}> = ({sahneler, sinir, damgalar, kelimeler, ses, vurgu = [], children}) => {
  const f = useCurrentFrame();
  const sure = sinir[sinir.length - 1];
  return (
    <AbsoluteFill>
      <Zemin />
      <AbsoluteFill style={{transform: sarsinti(f, damgalar)}}>
        {sahneler.map((S, i) => (
          <Sequence key={i} from={sinir[i]} durationInFrames={sinir[i + 1] - sinir[i]} layout="none">
            <Sahne sure={sinir[i + 1] - sinir[i]} sonGecis={i < sahneler.length - 1}>
              <S o={sinir[i]} />
            </Sahne>
          </Sequence>
        ))}
      </AbsoluteFill>
      <Altyazi kelimeler={kelimeler} vurgu={vurgu} />
      <Ilerleme />
      <Audio src={staticFile(ses)} />
      <MuzikYatagi sure={sure} />
      {sinir.slice(1, -1).map((s, i) => <Sfx key={`w${i}`} ad="whoosh" an={s - 8} ses={0.2} />)}
      {damgalar.map((d, i) => <Sfx key={`d${i}`} ad="damga" an={d} ses={0.24} />)}
      {children}
    </AbsoluteFill>
  );
};
