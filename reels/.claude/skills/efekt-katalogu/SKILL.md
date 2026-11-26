---
name: efekt-katalogu
description: Videoya kurgu programı açmadan, kodla (Remotion) efekt ekler. 9 hazır efekt - kadraj taşması, yörünge, ayna, dergi kapağı, karalama, cam yazı, manşet yağmuru, kare dondur, savrulma. Kullanıcı "videoya ... efekti ekle", "efekt kataloğu", "/efekt" dediğinde ya da bu efekt adlarından birini andığında kullan.
---

# Efekt Kataloğu (YapayTU)

Amaç: Kullanıcı efektin adını söyler, sen o efekti Remotion ile koda dökersin. Kurgu programı yok; her efekt bir React bileşeni.

## 0. Hazırlık

- Projede Remotion var mı bak (`package.json` içinde `remotion`). Yoksa kullanıcıya sor, onay verirse kur: `npx create-video@latest` (boş şablon).
- Kullanıcının videosu varsa `public/` klasörüne koy ve `<OffthreadVideo src={staticFile("video.mp4")} />` ile kullan. Videosu yoksa bir görsel ya da düz renk sahneyle örnek göster.
- Bazı efektler kişiyi arka plandan ayırmayı ister (kadraj taşması, yörünge'nin arkadan geçen kartları). Bunun için kişinin şeffaf arka planlı bir kopyası lazım:
  - Kullanıcıdan şeffaf arka planlı (alfa kanallı) bir video ya da PNG kare dizisi iste, ya da
  - açık kaynak `rembg` ile karelerden üret (`pip install "rembg[cli]"`, sonra `rembg p kareler/ kesik/`). Bunu yapmadan önce kullanıcıya süreyi ve disk alanını söyle.
- Her efekti ayrı bir dosyada, ayrı bir bileşen olarak yaz (`src/efektler/Ayna.tsx` gibi). Süreyi ve başlangıç karesini prop olarak al.
- Bitince `npx remotion studio` ile önizlet; kullanıcı beğenirse `npx remotion render` komutunu ver.

## Kurallar

- Zaman her zaman `useCurrentFrame()` ile ilerler. CSS animasyonu ve `setTimeout` kullanma; render'da çalışmaz.
- Yumuşak giriş/çıkış için `spring()` ve `interpolate(..., { extrapolateLeft: "clamp", extrapolateRight: "clamp" })`.
- Efekt sesi ekliyorsan konuşmanın en az 12 dB altında tut.
- Instagram/TikTok için 1080x1920, 30 fps. Önemli içeriği üst 250 ve alt 400 pikselin dışında tut (uygulama arayüzü kapatır).

## Efektler

### 1. Kadraj taşması
Kişi bir fotoğraf çerçevesinin içinde durur, sonra çerçevenin üst kenarından dışarı taşar.
- Arkada çerçeve (beyaz kenarlıklı kutu), içinde videonun kendisi.
- Önde kişinin kesik (şeffaf) kopyası, `clip-path: inset(-1000px 0 0 0)` ile: alt ve yanlar çerçevede kesilir, üst serbest kalır.
- Taşma anında kesik kopyayı `spring` ile 150-300 px yukarı it, çerçeveyi 10 kare hafifçe sars, kenardan küçük parçacıklar saç.

### 2. Yörünge
Kişinin etrafında 3B bir elips üzerinde kartlar döner.
- Her kart için açı: `a = i / adet * 2π + kare * hız`. Konum: `x = merkezX + cos(a) * yarıçapX`, `y = merkezY + sin(a) * yarıçapY`.
- Derinlik `z = sin(a)`. z < 0 olan kartlar kişinin ARKASINDA çizilir (kesik kopyadan önce), diğerleri önünde. Boyut `0.6 + 0.4 * (z + 1) / 2`, arkadakiler biraz soluk.
- Kesik kopya yoksa: arkaya geçen kartı soldur, kişinin üstüne binmesin.

### 3. Ayna
Görüntü ortadan ikiye bölünür, sağ yarı sol yarının aynası olur; sonra dikeyde de aynalanıp dörde çıkar.
- Aynı sahneyi iki kez çiz. İkisine de `clip-path: inset(0 50% 0 0)`, ikincisine ek olarak `transform: scaleX(-1)`.
- Dörtlü için bu ikiliyi bir kez daha çiz: `clip-path: inset(0 0 50% 0)` ve `scaleY(-1)`.
- Ortaya parlayan ince bir çizgi koy, `scale` ile 0'dan 1'e uzasın.

### 4. Dergi kapağı
Video bir derginin kapağına dönüşür.
- Kapak, sayfa çevirme gibi gelir: `transform-origin: 0% 50%`, `rotateY(-95deg)` → `0deg`, ebeveynde `perspective: 1400px`.
- Üstte büyük dergi adı; kişi başlığın ÖNÜNDE (kesik kopya varsa başlığın üstüne biner, gerçek dergi gibi).
- Yan yazılar (büyük sayı + kısa başlık), sayı/tarih satırı, köşede dönen yuvarlak etiket, altta barkod (rastgele kalınlıkta dikey çizgiler).
- Kapak yerine oturunca 1 karelik beyaz flaş ve deklanşör sesi.

### 5. Karalama
Kişinin etrafına elle çizilmiş gibi tebeşir çizimler gelir ve canlı gibi titrer.
- Çizimler SVG `path`. Her birine `pathLength={1}`, `strokeDasharray="1 1"`, `strokeDashoffset={1 - ilerleme}`: kendini çiziyor gibi görünür.
- Titreme (boil): SVG filtresi `feTurbulence` + `feDisplacementMap`, `seed` değeri her 3 karede bir değişsin (`Math.floor(kare / 3)`). Filtre kimliğine seed'i ekle ki her seferinde yeniden hesaplansın.
- Örnek çizimler: kafanın etrafında daire, oklar, yıldızlar, konuşma balonu, alta dalgalı çizgi, "BEN" yazısı.

### 6. Cam yazı
Ekranın önünden dev bir cam levha geçer, üstünde büyük yazı; arkası buzlu camdan görünür.
- Levha: `background: rgba(255,255,255,0.14)`, `backdrop-filter: blur(18px) saturate(1.7)`, yarı saydam beyaz kenarlık, içte üst kenara ince parlak çizgi.
- Giriş: `rotateX(60deg) scale(1.4)` → düz. Üstünden çapraz bir parlama şeridi kaysın.
- Arkada renkli, bulanık, yavaş hareket eden lekeler olursa cam etkisi çok daha iyi görünür.

### 7. Manşet yağmuru
Gazete manşetleri yukarıdan düşüp üst üste yığılır.
- Her kart: kırık beyaz zemin, üstte küçük gazete adı + tarih, altında serif kalın manşet.
- Sırayla (her 6-8 karede bir) `y: -400 → hedef`, `rotate: açı*4 → açı`, `spring` ile hafif zıplayarak oturur. Her inişte damga sesi ve küçük sarsıntı.
- Manşetler birbirinin yazısını kapatmasın; hedef y değerlerini kademeli ver.

### 8. Kare dondur
Hareketli görüntü bir anda donar, üstüne sarı kalemle notlar çizilir.
- Donma anından sonra sahneyi Remotion'un `<Freeze frame={donmaKaresi}>` bileşeniyle sar (video ve animasyonlar o karede kalır), üstüne `grayscale(0.75) contrast(1.15)` ve yavaş %7 yakınlaşma.
- Donma anında 1 karelik beyaz flaş + deklanşör sesi.
- Notlar: sarı daire, ok ve kısa yazılar ("bu ben"), karalamadaki gibi `strokeDashoffset` ile kendini çizerek.

### 9. Savrulma
Kamera yana savrulur ve yeni sahne aynı hızla gelir (whip pan).
- Eski sahne: 8 karede `translateX(0 → -1500px)`, hızlanarak (`x³`).
- Yeni sahne: eski sahne çıkarken 9 karede `translateX(1500px → 0)`, yavaşlayarak.
- Hareket bulanıklığı: hızlı karelerde sahneyi 4-5 kez, her biri 60-70 px kaydırılmış ve %20 opak olarak üst üste çiz. Bu, CSS `blur`'dan çok daha gerçekçi yatay bulanıklık verir.
- Ses: "whoosh/whip".

## Bitirirken

- Kullanıcıya hangi dosyaları yazdığını ve efekti nerede (hangi saniyede) kullandığını söyle.
- Render komutunu ver: `npx remotion render src/index.ts <KompozisyonAdı> cikti.mp4`.

Skill'i YapayTU hazırladı, ücretsiz.
