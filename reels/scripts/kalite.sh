#!/bin/bash
# KALİTE KONTROL: format, fps, süre uyumu, ses seviyesi, boş/donuk kare, temas sayfası
# Kullanım: bash scripts/kalite.sh out/video.mp4 public/VID_xxx/ses.mp3
V=$1; A=$2; HATA=0
read W H FPS <<<$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate -of csv=p=0 "$V" | tr ',' ' ')
[ "$W" = 1080 ] && [ "$H" = 1920 ] && echo "✓ 1080x1920 (9:16)" || { echo "✗ çözünürlük $W x $H"; HATA=1; }
[ "$FPS" = "30/1" ] && echo "✓ 30 fps" || { echo "✗ fps $FPS"; HATA=1; }
DV=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$V"); DA=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$A")
python3 -c "import sys; dv,da=$DV,$DA; ok=dv>=da; print(('✓' if ok else '✗')+f' süre: video {dv:.2f} sn ≥ anlatım {da:.2f} sn (TTS kesilmiyor)'); sys.exit(0 if ok else 1)" || HATA=1
ffprobe -v error -select_streams a -show_entries stream=codec_name -of csv=p=0 "$V" | grep -q . && echo "✓ ses kanalı var" || { echo "✗ ses yok"; HATA=1; }
LUFS=$(ffmpeg -i "$V" -af ebur128 -f null - 2>&1 | grep -E '^\s+I:' | tail -1 | awk '{print $2}')
python3 -c "l=$LUFS; print(('✓' if -16<=l<=-12 else '⚠')+f' ses yüksekliği {l} LUFS (hedef −14)')"
SIYAH=$(ffmpeg -i "$V" -vf "blackdetect=d=0.05:pix_th=0.1" -an -f null - 2>&1 | grep -c black_start)
[ "$SIYAH" = 0 ] && echo "✓ boş/siyah kare yok" || { echo "✗ $SIYAH siyah aralık"; HATA=1; }
DON=$(ffmpeg -i "$V" -vf "freezedetect=n=0.001:d=2" -an -f null - 2>&1 | grep -c freeze_start)
[ "$DON" = 0 ] && echo "✓ 2 sn'den uzun donuk sahne yok" || echo "⚠ $DON donuk aralık (2 sn+)"
mkdir -p out/kontrol; ffmpeg -y -loglevel error -i "$V" -vf "fps=2,scale=216:384,tile=10x5" -frames:v 1 out/kontrol/temas.png && echo "→ temas sayfası: out/kontrol/temas.png"
ffmpeg -y -loglevel error -ss 1.2 -i "$V" -frames:v 1 -vf scale=540:960 out/kontrol/kapak.png && echo "→ kapak karesi: out/kontrol/kapak.png"
exit $HATA
