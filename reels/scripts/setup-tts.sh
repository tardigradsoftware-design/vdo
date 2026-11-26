#!/bin/bash
# Chatterbox TTS: venv + CPU PyTorch + model önbelleği. reels/ klasöründen çalıştır.
set -e
[ -f /root/.ccr/ca-bundle.crt ] && export SSL_CERT_FILE=/root/.ccr/ca-bundle.crt REQUESTS_CA_BUNDLE=/root/.ccr/ca-bundle.crt
export HF_HUB_DISABLE_XET=1
[ -d .venv-tts ] || python3 -m venv .venv-tts
. .venv-tts/bin/activate
pip -q install --index-url https://download.pytorch.org/whl/cpu torch==2.6.0 torchaudio==2.6.0
pip -q install chatterbox-tts "setuptools<81"
python -c "from chatterbox.mtl_tts import ChatterboxMultilingualTTS as M; M.from_pretrained(device='cpu')"
echo "tts hazır"
