# Remotion Short-Form Video Motoru (src/motor/)

| Modül | Dosya | Görev |
|---|---|---|
| Marka sistemi | marka.ts | Anlamlı renkler (marka/para/risk/vurgu), Türkçe fontlar, güvenli alan, 5 farklı hareket eğrisi |
| Zamanlama | zaman.ts | Whisper kelime zamanları → kare; `t("kelime", sıra)` |
| Kamera | Kamera.tsx | Anahtar kareli 2D kamera (x,y,ölçek,dönüş, segment başına eğri) + derinlikli parallax katmanları |
| Tipografi | Tipografi.tsx | Kinetik başlık (maske/pop/karakter/yumruk), işaretleyici süpürme, sayaç, çip |
| Maskot | Maskot.tsx | Nesne maskot (insan/hayvan değil); pozlar: bekle, işaret, şaşır, uyarı, onay, düşün, incele, tut, selam; girişler; göz takibi; eşya tutma. Kullanıcı maskotu gelince sadece `Govde` değişir |
| Metafor kütüphanesi | nesneler.tsx | Telefon, resmi bina, banknot, jeton, cüzdan, kum saati, bilgi kartı, takvim, bariyer, yorum kutusu, rehber, zemin |
| Geçişler | Gecis.tsx | İmza: çapraz panel süpürme; iris; flaş |
| Ses | Ses.tsx + scripts/ses_motor.py | TTS + düşük müzik + 10 SFX (seviyeler sabit tablo) |
| Altyazı | Altyazi.tsx | ≤3 kelime, anahtar kelime vurgusu, güvenli alan, aralık bazlı gizleme |
| Sahne yöneticisi | Video.tsx | Sahneler + geçişler + altyazı + ses |
| Kalite kontrol | scripts/kalite.sh | Format, fps, TTS kesilmesi, ses, LUFS, siyah/donuk kare, temas sayfası, kapak |

## Yeni video akışı
1. Ses + `kelimeler.json` (scripts/transcribe.mjs)
2. Kreatif plan: problem → hook → metaforlar → sahne türleri → maskot anları → vurgular → kamera → CTA (dosya başına yorum olarak)
3. `src/videolar/Mxxx.tsx`: senaryoya özel sahneler (motor bileşenleriyle)
4. `.venv-tts/bin/python scripts/ses_motor.py <süre> public/VID_xxx/muzik_motor.wav`
5. Render → loudnorm −14 → `bash scripts/kalite.sh` → temas sayfasıyla görsel kontrol → düzelt
