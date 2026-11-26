# Hazırlık: ses başı sessizliği kırp → Whisper zamanları → ORİJİNAL TTS kelimelerine eşle → words.json {text,startMs,endMs}
# Kullanım: python3 scripts/hak_hazirla.py VID_001 kaynak.mp3 "TTS metni"
import sys, json, subprocess, difflib, re, os
vid, kaynak, tts = sys.argv[1], sys.argv[2], sys.argv[3]
d = f"public/hak/{vid}"; os.makedirs(d, exist_ok=True)
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", kaynak, "-af", "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.03", "-ar", "44100", "-b:a", "192k", f"{d}/ses.mp3"], check=True)
subprocess.run(["node", "scripts/transcribe.mjs", f"{d}/ses.mp3"], check=True, capture_output=True)
W = json.load(open("kelimeler.json")); os.remove("kelimeler.json")
def norm(s): return re.sub(r"[^\w]", "", s.lower().replace("i̇", "i").replace("I", "ı"), flags=re.U)
tt = tts.split()
a = [norm(x) for x in tt]; b = [norm(w["kelime"]) for w in W]
eslesme = [None] * len(tt)
for blok in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes():
    tag, i1, i2, j1, j2 = blok
    if tag == "equal":
        for k in range(i2 - i1): eslesme[i1 + k] = (W[j1 + k]["baslangic"], W[j1 + k]["bitis"])
    elif j2 > j1:  # farklı bölünmüş kelimeler: aralığı orantılı paylaştır
        s0, s1 = W[j1]["baslangic"], W[j2 - 1]["bitis"]; n = i2 - i1
        for k in range(n): eslesme[i1 + k] = (s0 + (s1 - s0) * k / max(1, n), s0 + (s1 - s0) * (k + 1) / max(1, n))
for i in range(len(tt)):  # eşleşmeyenleri komşulardan doldur
    if eslesme[i] is None:
        once = next((eslesme[j][1] for j in range(i - 1, -1, -1) if eslesme[j]), 0.0)
        sonra = next((eslesme[j][0] for j in range(i + 1, len(tt)) if eslesme[j]), once + 0.3)
        eslesme[i] = (once, max(once + 0.05, sonra))
out = [{"text": t, "startMs": round(s * 1000), "endMs": round(e * 1000)} for t, (s, e) in zip(tt, eslesme)]
json.dump(out, open(f"{d}/words.json", "w"), ensure_ascii=False, indent=1)
print(f"{len(out)} kelime, ilk kelime {out[0]['startMs']} ms, son {out[-1]['endMs']} ms")
