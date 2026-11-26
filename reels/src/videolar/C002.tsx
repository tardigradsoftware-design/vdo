import kelimeler from "../../public/C002/kelimeler.json";
import {Kelime, kare} from "../ortak/stil";
import {zamanlayici} from "../ortak/parcalar";
import {CVurus, CizgiSeri, YOL} from "../cizgi/Seri";

const K = kelimeler as Kelime[];
const t = zamanlayici(K);
export const C002_SURE = kare(K[K.length - 1].bitis) + 24;
const V: CVurus[] = [
  {an: 0, yol: YOL.kimlik, nokta: [740, 1110], noktaAn: t("haberin")},
  {an: t("adına", 0), yol: YOL.bina, nokta: [700, 770], noktaAn: t("açılıp")},
  {an: t("milyonlarca"), yol: YOL.grafik, nokta: [740, 1094], noktaAn: t("sokulabilirsin")},
  {an: t("Çoğu"), yol: YOL.kapi, nokta: [540, 1180], noktaAn: t("haciz")},
  {an: t("Ama"), yol: YOL.kilit, nokta: [540, 1030], noktaAn: t("açtığında")},
  {an: t("senin"), yol: YOL.kalkan, nokta: [670, 850], noktaAn: t("kuramıyor")},
  {an: t("Yorumlara"), yol: YOL.balon, nokta: [720, 770], noktaAn: t("hemen"), yazi: {metin: "KORUMA", an: t("KORUMA"), x: 540, y: 930}},
];
export const C002: React.FC = () => <CizgiSeri V={V} sure={C002_SURE} klasor="C002" />;
