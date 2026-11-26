import {Composition} from "remotion";
import {VID001, VID001_SURE} from "./videolar/VID001";
import {VID002, VID002_SURE} from "./videolar/VID002";
import {VID002C, VID002C_SURE} from "./videolar/VID002C";
import {Maskotlar} from "./videolar/Maskotlar";
import {VID002P, VID002P_SURE} from "./videolar/VID002P";
import {VID002D, VID002D_SURE} from "./videolar/VID002D";
import {FPS, H, W} from "./ortak/stil";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="VID001" component={VID001} durationInFrames={VID001_SURE} fps={FPS} width={W} height={H} />
      <Composition id="VID002" component={VID002} durationInFrames={VID002_SURE} fps={FPS} width={W} height={H} />
      <Composition id="VID002C" component={VID002C} durationInFrames={VID002C_SURE} fps={FPS} width={W} height={H} />
      <Composition id="Maskotlar" component={Maskotlar} durationInFrames={1} fps={FPS} width={2210} height={3330} />
      <Composition id="VID002P" component={VID002P} durationInFrames={VID002P_SURE} fps={FPS} width={W} height={H} />
      <Composition id="VID002D" component={VID002D} durationInFrames={VID002D_SURE} fps={FPS} width={W} height={H} />
    </>
  );
};
