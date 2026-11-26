import {Audio, Sequence, staticFile} from "remotion";

// Efekt sesleri konuşmadan en az 12 dB kısık (0.25 ≈ -12 dB)
export const Sfx: React.FC<{ad: string; an: number; ses?: number}> = ({ad, an, ses = 0.22}) => (
  <Sequence from={Math.max(0, an)} layout="none">
    <Audio src={staticFile(`sfx/${ad}.wav`)} volume={ses} />
  </Sequence>
);

// Müzik yatağı: sürekli, hiç susmaz; başta/sonda kısa fade
export const MuzikYatagi: React.FC<{sure: number; ses?: number}> = ({sure, ses = 0.11}) => (
  <Audio
    src={staticFile("muzik/yatak.wav")}
    loop
    volume={(f) => ses * Math.min(1, f / 10) * Math.min(1, (sure - f) / 15)}
  />
);
