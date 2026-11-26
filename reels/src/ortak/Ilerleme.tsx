import {useCurrentFrame, useVideoConfig} from "remotion";
import {R} from "./stil";

// Üstte ince ilerleme çubuğu (izleyiciyi tutar)
export const Ilerleme: React.FC = () => {
  const f = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  return (
    <div style={{position: "absolute", top: 0, left: 0, right: 0, height: 16, background: "#0E0E1012"}}>
      <div style={{width: `${(f / durationInFrames) * 100}%`, height: "100%", background: R.siyah}} />
    </div>
  );
};
