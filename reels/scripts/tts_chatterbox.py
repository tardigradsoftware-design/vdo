# Kullanım: python tts_chatterbox.py metin.txt cikti.wav [referans.wav]
import sys, re, torch, torchaudio
from chatterbox.mtl_tts import ChatterboxMultilingualTTS

metin = open(sys.argv[1], encoding="utf-8").read().strip()
cikti = sys.argv[2]
ref = sys.argv[3] if len(sys.argv) > 3 else None

model = ChatterboxMultilingualTTS.from_pretrained(device="cpu")
cumleler = [c.strip() for c in re.split(r"(?<=[.!?])\s+", metin) if c.strip()]
parcalar = []
sessizlik = torch.zeros(1, int(model.sr * 0.25))
for c in cumleler:
    wav = model.generate(c, language_id="tr", audio_prompt_path=ref, exaggeration=0.4, cfg_weight=0.5)
    parcalar += [wav, sessizlik]
torchaudio.save(cikti, torch.cat(parcalar[:-1], dim=1), model.sr)
print("ok", cikti)
