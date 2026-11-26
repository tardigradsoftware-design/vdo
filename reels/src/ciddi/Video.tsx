import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {Kelime} from "../ortak/stil";
import {CAltyazi} from "./Altyazi";
import {CSahne} from "./Parcalar";
import {C} from "./tema";
import {CZemin} from "./Zemin";

export const CSfx: React.FC<{ad: string; an: number; ses?: number}> = ({ad, an, ses = 0.22}) => (
  <Sequence from={Math.max(0, an)} layout="none"><Audio src={staticFile(`sfx_ciddi/${ad}.wav`)} volume={ses} /></Sequence>
);

const Ilerleme: React.FC = () => {
  const f = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  return <div style={{position: "absolute", top: 0, left: 0, height: 8, width: `${(f / durationInFrames) * 100}%`, background: C.kirmizi}} />;
};

// Darbe anında hafif kamera sarsıntısı
const sars = (f: number, anlar: number[]) => {
  let x = 0, y = 0;
  for (const a of anlar) { const d = f - a; if (d >= 0 && d < 12) { const g = (1 - d / 12) * 10; x += Math.sin(d * 2.3) * g; y += Math.cos(d * 2.9) * g; } }
  return `translate(${x}px, ${y}px)`;
};

export const CVideo: React.FC<{sahneler: React.FC<{o: number}>[]; sinir: number[]; darbeler: number[]; kelimeler: Kelime[]; ses: string; vurgu?: string[]; children?: React.ReactNode}> = ({sahneler, sinir, darbeler, kelimeler, ses, vurgu, children}) => {
  const f = useCurrentFrame();
  const sure = sinir[sinir.length - 1];
  return (
    <AbsoluteFill>
      <CZemin />
      <AbsoluteFill style={{transform: sars(f, darbeler)}}>
        {sahneler.map((S, i) => (
          <Sequence key={i} from={sinir[i]} durationInFrames={sinir[i + 1] - sinir[i]} layout="none">
            <CSahne sure={sinir[i + 1] - sinir[i]} son={i < sahneler.length - 1}><S o={sinir[i]} /></CSahne>
          </Sequence>
        ))}
      </AbsoluteFill>
      <CAltyazi kelimeler={kelimeler} vurgu={vurgu} />
      <Ilerleme />
      <Audio src={staticFile(ses)} />
      <Audio src={staticFile("muzik/ciddi.wav")} loop volume={(x) => 0.16 * Math.min(1, x / 10) * Math.min(1, (sure - x) / 15)} />
      {sinir.slice(1, -1).map((s, i) => <CSfx key={i} ad="gecis" an={s - 10} ses={0.22} />)}
      {darbeler.map((d, i) => <CSfx key={`d${i}`} ad="darbe" an={d} ses={0.3} />)}
      {children}
    </AbsoluteFill>
  );
};
