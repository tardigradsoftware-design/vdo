// SES SİSTEMİ — TTS ana kaynak; müzik ve SFX düşük ve kontrollü
import {Audio, Sequence, staticFile, useVideoConfig} from "remotion";
export type SesAd = "whoosh" | "darbe" | "tik" | "pop" | "reveal" | "kagit" | "bildirim" | "supurme" | "alcak" | "vurgu";
const SEVIYE: Record<SesAd, number> = {whoosh: 0.22, darbe: 0.3, tik: 0.22, pop: 0.18, reveal: 0.2, kagit: 0.25, bildirim: 0.18, supurme: 0.2, alcak: 0.32, vurgu: 0.2};
export type Efekt = {ad: SesAd; an: number; ses?: number};
export const SesKatmani: React.FC<{anlatim: string; muzik: string; efektler: Efekt[]}> = ({anlatim, muzik, efektler}) => {
  const {durationInFrames} = useVideoConfig();
  return (
    <>
      <Audio src={staticFile(anlatim)} />
      <Audio src={staticFile(muzik)} volume={(f) => 0.12 * Math.min(1, f / 8) * Math.min(1, (durationInFrames - f) / 20)} />
      {efektler.map((e, i) => <Sequence key={i} from={Math.max(0, e.an)} layout="none"><Audio src={staticFile(`sfx_motor/${e.ad}.wav`)} volume={e.ses ?? SEVIYE[e.ad]} /></Sequence>)}
    </>
  );
};
