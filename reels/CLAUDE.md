# Video projesi (Remotion)

Kullanıcıya her zaman kısa ve öz yaz.

## Akış
1. Kullanıcı sesi `public/ses.mp3` olarak verir (TTS metnini de verebilir). Ses kesilmez, üstüne bir şey eklenmez.
2. `node scripts/transcribe.mjs` → `kelimeler.json` (Whisper large-v3-turbo, Türkçe, kelime zamanları).
   TTS metni verildiyse kelimelerin yazımını metne göre düzelt, zamanlara dokunma.
3. Her sahne `STIL.md`'ye uyar. Animasyonlar `kelimeler.json` zamanlarına bağlanır.
4. Önce sahne sahne plan göster (her sahne hangi kelimede başlıyor, ekranda ne var). Onay olmadan kod yazma.
5. Render: `npx remotion render <Kompozisyon> out/video.mp4`
6. Kare kare kontrol: saniyede 2 kare al, tek görselde diz, bak. Üst üste binen yazı, taşma, 0,25 sn'den uzun sessizlik varsa söyle.

## Kurulum (yeni container'da)
- `npm install`
- `NODE_USE_ENV_PROXY=1 node scripts/install-whisper.mjs` (whisper.cpp 1.7.4 + model, ~1.6 GB)
- `bash scripts/setup-tts.sh` (Chatterbox, `.venv-tts/`)

## Ses üretimi (Chatterbox, ücretsiz, yerel)
`HF_HUB_DISABLE_XET=1 .venv-tts/bin/python scripts/tts_chatterbox.py metin.txt public/ses.wav referans.wav`
Referans: kullanıcının verdiği 10-20 sn temiz ses. Ahmet (edge-tts) sesi kullanılmaz.

Her videodan önce `TASARIM_REHBERI.md` oku ve TREATMENT yaz. Stil: `STIL_CIDDI.md` (açık tema). Remotion skill'leri `.agents/skills/` altında (Claude Code için `.claude/skills/` symlink).

## Seri üretim (dava dosyası şablonu, ses 1,45x) — STANDART
1. Drive "kisa sesler" → `VID_xxx_kisa.mp3` indir; `ffmpeg -i in.mp3 -af atempo=1.45 public/Dxxx/ses.mp3`
2. `node scripts/transcribe.mjs public/Dxxx/ses.mp3` → `public/Dxxx/kelimeler.json`; yazımı kisa_tts.csv'ye göre düzelt.
3. `src/videolar/Dxxx.tsx`: sadece `DVurus[]` veri listesi (örnek: D001.tsx). Root.tsx'e kaydet.
4. `.venv-tts/bin/python scripts/muzik_dosya.py public/Dxxx <mühür saniyeleri,virgüllü>`
5. Render → loudnorm −14 LUFS → saniyede 1,5 kare kontrol → gönder.
