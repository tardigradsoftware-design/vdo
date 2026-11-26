import {Composition} from "remotion";
import {VID001, VID001_SURE} from "./videolar/VID001";
import {VID002, VID002_SURE} from "./videolar/VID002";
import {VID002C, VID002C_SURE} from "./videolar/VID002C";
import {Maskotlar} from "./videolar/Maskotlar";
import {VID002P, VID002P_SURE} from "./videolar/VID002P";
import {VID002D, VID002D_SURE} from "./videolar/VID002D";
import {VID003F, VID003F_SURE} from "./videolar/VID003F";
import {Test3D} from "./uc/Test3D";
import {VID003U, VID003U_SURE} from "./videolar/VID003U";
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
      <Composition id="VID003F" component={VID003F} durationInFrames={VID003F_SURE} fps={FPS} width={W} height={H} />
      <Composition id="Test3D" component={Test3D} durationInFrames={30} fps={FPS} width={W} height={H} />
      <Composition id="VID003U" component={VID003U} durationInFrames={VID003U_SURE} fps={FPS} width={W} height={H} />
    </>
  );
};
