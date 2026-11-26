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

Remotion skill'leri `.agents/skills/` altında (Claude Code için `.claude/skills/` symlink).
