# HakVideo — Maskotlu Hak Videoları (stil rehberi uygulaması)

Tek kompozisyon: `HakVideo` (props: `id`, `showSafeZones`). Video başına yalnızca `public/hak/<ID>/` değişir:
`ses.mp3`, `words.json` ({text,startMs,endMs} — ORİJİNAL TTS kelimeleri), `plan.json` (sahne planı).

## Yeni video
1. `python3 scripts/hak_hazirla.py VID_xxx kaynak.mp3 "<TTS metni>"` → baş sessizliği kırpar, Whisper zamanlarını TTS kelimelerine eşler
2. `public/hak/VID_xxx/plan.json` yaz (kategori, ton, hookTitle, ctaKeyword, beats, emphasis) — örnek: VID_001
3. `npx remotion render HakVideo out/x.mp4 --props='{"id":"VID_xxx"}' --crf=18` (plan render'dan önce otomatik doğrulanır)
4. loudnorm −14 LUFS → `bash scripts/kalite.sh` → kapak: `npx remotion still HakVideo kapak.png --frame=12 --props=...`
Güvenli alan kontrolü: `--props='{"id":"VID_xxx","showSafeZones":true}'`

## Dosyalar (src/hak/)
tema.ts (COLORS, SPRING, kategori/ton tabloları, tr-TR büyük harf) · tipler.ts · zaman.ts (anchor/hit → kare, −2 kare) ·
dogrula.ts (11 kural) · Zemin.tsx · Altyazi.tsx (1–3 kelime, ≤18 harf, fitText, aktif sarı) · Kartlar.tsx (12 kart + hook balonu + CTA) ·
Maskot.tsx (8 poz, ağız 3/2, seed'li göz kırpma, ezilme, tepki) · HakVideo.tsx (geçişler, kamera, üst bant, ses kuralları, calculateMetadata)
Ses: scripts/hak_ses.py → public/hak/sfx (14 efekt) + public/hak/muzik (3 parça, id ile seçilir)

## Rehberden sapmalar (geçici)
- Maskot: turuncu dosya karakteri SVG yer tutucu; PNG pozları gelince `Maskot.tsx` içindeki `Cizim` değişir.
- Fontlar @fontsource (Anton, Montserrat — aynı Google fontları, yerel; latin-ext dahil).
- Müzik havuzu lisans temiz sentez parçalar.
