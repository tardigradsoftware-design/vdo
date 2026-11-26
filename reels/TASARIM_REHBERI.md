# Tasarım rehberi (her videodan önce oku)

Kaynaklar: lemo-opuscar DIRECTOR.md, ClaudeAnimationBase ANIMATION_GUIDE.md, Remotion markup skill'i,
caption-news / halftone-dossier / news-package stilleri. Bunlardan damıtıldı.

## 0. Yönetmen sırası
Bir video şu sırayla değerlendirilir: **ses → ritim → kamera → yönetmenlik**. Güzel kare sadece başlangıçtır.

## 1. Kod yazmadan önce: TREATMENT
Her video için `public/VID_xxx/TREATMENT.md` yaz:
1. **3 aday yapı** (ör. geri sayım, önce/sonra, dosya açılışı) → birini seç, neden.
2. **Logline + yay**: kurulum → dönüm → son. Son, açılışa göndermeyle biter.
3. **Benchmark**: 1-2 referans iş; neyi öğren / neyi alma.
4. **Çekim listesi**: her sahne için kadraj (geniş/orta/yakın/insert), kamera hareketi (push, pull, pan, parallax, punch-in) ve NEDENİ.
5. **Saniye saniye beat listesi** (kelimeler.json'a göre).
6. **Ses tablosu**: her bölüm için ambiyans, foley, müzik durumu.
Kullanıcı storyboard isterse 6-9 anahtar kareyi tek görselde göster, onay bekle.

## 2. Hikâye
- **İlk 3 saniyede kanca.** En büyük sayı / en sert cümle 0,15 sn içinde ekranda.
- **Tek konu, tek hedef, tek dönüm.** Her sahnede bir şey DEĞİŞİR (ilk kare ≠ son kare).
- **Bir imza an** (signature shot): ortamın kendi diliyle yapılan, hatırlanan tek hareket; duygusal zirveye koy.
- Ekstraları kes. Açıklama gerektiren beat'i çıkar.

## 3. Ritim ve okuma süresi
- Altyazı ≥ max(1,8 sn, konuşma + 0,6 sn). Başlık kartı ≥ 4 sn değil (Reels'te ≥ 2,5 sn), ama okunmadan geçilmez.
- Yazı animasyonu bittikten sonra ekranda kalma: harf ÷ 15 + 1,5 sn.
- **Bir okuma, bir an.** İki şey aynı anda olursa izleyici birini görür. Sebep → tepki sırayla.
- **Hız değişsin**: hızlı/yavaş dönüşümlü, bir hızlanma, bir nefes (2-3 sn tutulan an, dönüşten sonra).
- 1 sn'den uzun düz kare yok (sayaç, çizgi çizilmesi, fosfor, yavaş push hep canlı tutar).

## 4. Kamera
- En az **4 farklı kamera hareketi** ve gerçek kadraj değişimi (2D'nin de kamerası var: push, pull, parallax, odak kayması, kare içinde kare).
- Kilit anlarda konu kadraj yüksekliğinin en az 1/3'ü.
- Geçişler **ortamın içinden**: kâğıt kayması, mühür çarpması, fosfor çizgisinin sahneyi silmesi. Varsayılan fade/sert kesme yok (caption-news hariç: orada sert kesme + 1-2 karelik beyaz flaş).

## 5. Ses (videonun yarısı)
- **Görünen her hareketin sesi var**, malzemesine uygun (kâğıt, metal, mürekkep, cam).
- 3 katman: ambiyans + foley + müzik. Müzik konuşma ve kilit foley altında kısılır (ducking).
- **En az 2 gerçek sessizlik**: dönüm/zirve öncesi; sessizlikten sonraki ilk ses en önemli seslerden biri.
- Sesi geçiş olarak kullan (J-cut / L-cut) en az 2 kez.
- Hedef ses yüksekliği ≈ −14 LUFS.

## 6. En sık hatalar (her teslimden önce kontrol et)
- Konu çok küçük / kenara yapışık. Renk üstüne aynı renk. Altyazı konuyu örtüyor.
- Gag/uyarı anlaşılmadan geçiyor. Geçişte boş kare.
- Güvenli bölge ihlali: üst 270, alt 480, sol 70, sağ 150 px.

## 7. İnceleme döngüsü
- Saniyede 2 kare temas sayfası + kilit aksiyonlarda 0,2 sn şeritler + sesli tam hız izleme.
- **Tek düzeltme turu**: bulunan her şey bir turda, sonra bir kontrol daha.
- Başka işin aynısı olmasın: yapı, açılış, imza an, kamera yolu, müzik şekli, son → 6'nın en az 4'ü farklı.

## 8. Hukuk içerik için stil adayları (lemo-opuscar kütüphanesinden)
| Stil | Neden uyar |
|---|---|
| **halftone-dossier** (dava dosyası) | Krem arşiv kâğıdı, yarım ton noktalar, dev serif manşet + kayık baskı gölgesi, çarpan mühürler, numaralı delil kartları. Hukuk/dosya hissinin tam karşılığı. |
| **caption-news** (sessiz izlenen haber) | Sesi kapalı da anlaşılır; dev altyazı tek kelime sarı blokta; her sayının yanında kaynak etiketi (kanun maddesi). Reels'e en uygun dil. |
| **news-package** (bülten paketi) | Sabit alt bant, kategori sekmesi, tek ekranda tek bilgi. Seri içerik için tutarlı marka sistemi. |
| **briefing-board** | Beyaz tahtada gerçek nesneler + 3 renk mürekkep anlamı (kırmızı = karar). |

## 9. Elimizdeki araçlar
- `@remotion/effects`: paper(), noise(), halftone(), vignette(), lightLeak(), shine(), glow(), chromaticAberration(), zoomBlur(), lut(), curves()… (HtmlInCanvas ile gruba uygulanır).
- `@remotion/light-leaks`, `@remotion/motion-blur` (geçişlerde hareket bulanıklığı), `@remotion/shapes`, `@remotion/paths` (çizgi çizdirme), `@remotion/noise` (organik titreşim), `@remotion/layout-utils` (yazıyı kutuya sığdırma), `@remotion/transitions`, `@remotion/lottie`, `@remotion/google-fonts`.
- Remotion markup kuralları: CSS transition yok; `interpolate` + `Easing.bezier(0.16,1,0.3,1)`; `scale/translate/rotate` özellikleri.
- Skill'ler (`.claude/skills/`): remotion-* (resmi), lemo-opuscar (66 film stili; kütüphane `/home/user/kaynaklar/lemo-opuscar`), belgesel, motion-grafik, reklam-filmi, konusan-maskot (sese göre ağız oynatma), kil-animasyon, 3d-animasyon, cizgi-film, efekt-katalogu (9 efekt), animasyon-rehberi, taste-skill, earshot + real-sound (ses analizi; kurulum onay bekliyor).
- Referans arşivleri (`/home/user/kaynaklar/`): mg-styles-15 (15 hareketli grafik stili + promptlar), awesome-opus5-5-videos (700 viral video promptu), opus-video-prompts.

## 10. Ses karışımı (hata sonrası eklendi)
- Ses dosyaları normalize edilir ama doyurma/tanh kırpma YOK (bozulma yapar).
- Seviyeler: konuşma ≈ −19 LUFS (ham) · müzik konuşmanın ~14 dB altında (volume ≈ 0,13) · ambiyans neredeyse duyulmaz (volume ≈ 0,015) · efektler 0,15–0,55.
- Render sonrası: `ffmpeg -i ham.mp4 -c:v copy -af "loudnorm=I=-14:TP=-1.5:LRA=11" -ar 48000 -c:a aac -b:a 192k son.mp4`
- Her stem'in LUFS değerini ölç (ebur128), ambiyans konuşmadan yüksekse hata var.
