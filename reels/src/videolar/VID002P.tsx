import kelimeler from "../../public/VID_002/kelimeler.json";
import {Kelime} from "../ortak/stil";
import {CSfx} from "../ciddi/Video";
import {PVideo} from "../pro/Video";
import {DARBELER, S1, S2, S3, S4, S5, SINIR, VID002C_SURE, t} from "./VID002C";

export const VID002P_SURE = VID002C_SURE;
export const VID002P: React.FC = () => (
  <PVideo sahneler={[S1, S2, S3, S4, S5]} sinir={SINIR} bolumler={["SIZINTI", "RİSK", "HACİZ", "ÇÖZÜM", "REHBER"]} darbeler={DARBELER} kelimeler={kelimeler as Kelime[]} ses="VID_002/ses.mp3" vurgu={["KORUMA"]}>
    <CSfx ad="glitch" an={t("sızdıysa") + 2} ses={0.12} />
    <CSfx ad="kagit" an={2} ses={0.25} />
    {[0, 6, 12].map((d) => <CSfx key={`k${d}`} ad="daktilo" an={t("şirket", 0) + d} ses={0.2} />)}
    <CSfx ad="yukselis" an={t("milyonlarca") - 30} ses={0.16} />
    <CSfx ad="kagit" an={t("kapısına")} ses={0.25} />
    <CSfx ad="muhur" an={t("haciz")} ses={0.32} />
    <CSfx ad="tiktak" an={t("açtığında")} ses={0.3} />
    <CSfx ad="onay" an={t("onayın")} ses={0.16} />
    {[0, 3, 6, 9, 12, 15].map((d) => <CSfx key={`y${d}`} ad="daktilo" an={t("KORUMA") + d} ses={0.2} />)}
    {[t("güvenlik"), t("nasıl"), t("adım", 0)].map((a, i) => <CSfx key={`a${i}`} ad="tiktak" an={a} ses={0.25} />)}
  </PVideo>
);
