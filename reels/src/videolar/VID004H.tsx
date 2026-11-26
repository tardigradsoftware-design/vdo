import kelimeler from "../../public/VID_004/kelimeler.json";
import {Kelime, kare} from "../ortak/stil";
import {zamanlayici} from "../ortak/parcalar";
import {Hizli, Vurus} from "../hizli/Sablon";

const K = kelimeler as Kelime[];
const t = zamanlayici(K);
export const VID004H_SURE = kare(K[K.length - 1].bitis) + 18;
// Sadece veri: her vuruş bir kelimede başlar. "*" ile başlayan satır vurgu rengindedir.
const V: Vurus[] = [
  {an: t("Özel"), tip: "manset", satirlar: ["ÖZEL", "*HASTANE"], zemin: "mavi", ikon: "hospital"},
  {an: t("acil", 0), tip: "manset", satirlar: ["ACİL", "SERVİS"], zemin: "kirmizi", ikon: "ambulance"},
  {an: t("senden"), tip: "liste", baslik: "SENDEN ALINAN", zemin: "beyaz", maddeler: [
    {metin: "Muayene", an: t("muayene"), ikon: "stethoscope"}, {metin: "Tahlil", an: t("tahlil"), ikon: "test_tube"}, {metin: "Serum", an: t("serum"), ikon: "syringe"}]},
  {an: t("ücreti", 0), tip: "sayi", ust: "ÜCRET", sayi: "₺?", zemin: "sari", ikon: "money_with_wings"},
  {an: t("yasal"), tip: "manset", satirlar: ["YASAL", "OLARAK"], zemin: "lacivert"},
  {an: t("tamamen"), tip: "yasak", satirlar: ["TAMAMEN", "*YASAK"], zemin: "kirmizi"},
  {an: t("SGK"), tip: "manset", satirlar: ["SGK", "*ANLAŞMALI"], zemin: "mavi", ikon: "check_mark_button"},
  {an: t("ya"), tip: "manset", satirlar: ["YA DA", "*DEĞİL"], zemin: "beyaz", ikon: "cross_mark"},
  {an: t("acil", 1), tip: "manset", satirlar: ["ACİL", "*HALLERDE"], zemin: "kirmizi", ikon: "ambulance"},
  {an: t("hiçbir"), tip: "manset", satirlar: ["HİÇBİR", "*HASTANE"], zemin: "lacivert", ikon: "prohibited"},
  {an: t("tek"), tip: "sayi", ust: "TEK KURUŞ", sayi: "0 ₺", zemin: "sari", ikon: "coin"},
  {an: t("ilave"), tip: "yasak", satirlar: ["İLAVE", "*ÜCRET"], zemin: "lacivert"},
  {an: t("Yorumlara"), tip: "cta", kelime: "ACİL", yazAn: t("ACİL"), zemin: "mavi"},
  {an: t("hastane", 1), tip: "manset", satirlar: ["FATURANI", "*GERİ AL"], zemin: "beyaz", ikon: "receipt"},
  {an: t("adım", 0), tip: "liste", baslik: "ADIM ADIM", zemin: "lacivert", maddeler: [
    {metin: "Belgele", an: t("adım", 0)}, {metin: "Başvur", an: t("adım", 1)}, {metin: "Geri al", an: t("rehberi")}]},
  {an: t("hemen"), tip: "manset", satirlar: ["HEMEN", "*GÖNDERİYORUM"], zemin: "sari", ikon: "bell"},
];
export const VID004H: React.FC = () => <Hizli vuruslar={V} K={K} klasor="VID_004" sure={VID004H_SURE} />;
