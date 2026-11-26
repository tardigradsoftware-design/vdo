import kelimeler from "../../public/D001/kelimeler.json";
import {Kelime, kare} from "../ortak/stil";
import {zamanlayici} from "../ortak/parcalar";
import {DVurus, DosyaSablon} from "../dosya/Sablon";

const K = kelimeler as Kelime[];
const t = zamanlayici(K);
export const D001_SURE = kare(K[K.length - 1].bitis) + 24;
const V: DVurus[] = [
  {an: 0, bolum: "EK-1 PARA", rakam: "₺", satirlar: [{metin: "E-DEVLET'TE", an: t("e-Devlet'te")}, {metin: "ADINA", an: t("adına")}, {metin: "BİRİKMİŞ", an: t("birikmiş"), renk: "alarm"}]},
  {an: t("haberin"), satirlar: [{metin: "HABERİN", an: t("haberin")}, {metin: "BİLE YOK", an: t("bile"), renk: "golge"}], parmak: true},
  {an: t("devletin"), satirlar: [{metin: "DEVLET SANA", an: t("devletin"), boyut: 100}], belge: {ust: "T.C. ••••••", baslik: "ÖDEME BEKLEYEN ALACAK", alanlar: [{etiket: "Alacaklı:", an: t("sana"), deger: "SEN"}, {etiket: "Durum:", an: t("ödemeyi"), deger: "ÖDENMEDİ", kirmizi: true}, {etiket: "Tutar: ₺", an: t("para")}]}},
  {an: t("Sağlık"), silme: "golge", bolum: "EK-2 KALEMLER", satirlar: [{metin: "UNUTULANLAR", boyut: 110}], maddeler: [{metin: "Sağlık iadeleri", an: t("Sağlık")}, {metin: "Eski sigorta alacakları", an: t("eski")}, {metin: "Otomatik emeklilik", an: t("unutulan", 0)}]},
  {an: t("zamanında"), satirlar: [{metin: "ZAMANINDA", an: t("zamanında")}, {metin: "ÇEKİLMEZSE", an: t("çekilmezse"), renk: "golge"}], rakam: "?"},
  {an: t("zamanaşımına"), bolum: "EK-3 ZAMANAŞIMI", satirlar: [{metin: "ZAMANAŞIMI", renk: "alarm"}], belge: {baslik: "ALACAK KAYDI", alanlar: [{etiket: "Süre:", an: t("uğrayıp"), deger: "DOLDU", kirmizi: true}]}, muhur: {metin: "DEVLETE GEÇTİ", an: t("devlete")}},
  {an: t("Yorumlara"), silme: "vurgu", bolum: "REHBER", cta: {kelime: "PARA", yazAn: t("PARA"), adimlar: [{metin: "Unutulan parayı bul", an: t("unutulan", 1)}, {metin: "Saniyeler içinde sorgula", an: t("sorgulama")}, {metin: "Hesabına çek", an: t("çekme")}]}},
];
export const D001: React.FC = () => <DosyaSablon V={V} K={K} sure={D001_SURE} klasor="D001" dosya="2026/0001" anahtar={["birikmiş", "para", "unutulan", "zamanaşımına", "devlete"]} />;
