# 140 BPM enerjik yatak + kesme efektleri (temiz normalize). Kullanım: python muzik_hizli.py public/VID_xxx
import numpy as np, wave, os, sys, json
SR = 44100; rng = np.random.default_rng(9)
klasor = sys.argv[1]; K = json.load(open(f"{klasor}/kelimeler.json")); SON = K[-1]["bitis"] + 1.0
def kaydet(yol, x):
    os.makedirs(os.path.dirname(yol), exist_ok=True); x = np.asarray(x, float)
    if x.ndim == 1: x = np.stack([x, x], 1)
    x = x / (np.max(np.abs(x)) + 1e-9) * 0.89
    with wave.open(yol, "wb") as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype(np.int16).tobytes())
def t(s): return np.arange(int(SR * s)) / SR
def filt(x, lo=None, hi=None):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    if hi: X *= 1 / np.sqrt(1 + (f / hi) ** 4)
    if lo: X *= 1 / np.sqrt(1 + (lo / np.maximum(f, 1)) ** 4)
    return np.fft.irfft(X, len(x))
def n2f(m): return 440 * 2 ** ((m - 69) / 12)
def vuus(yuk):
    s = 0.28; tt = t(s); k = np.sin(np.pi * tt / s) ** 2
    return filt(rng.standard_normal(len(tt)), lo=600 if yuk else 300, hi=6000 if yuk else 3000) * k
def darbe():
    tt = t(0.9); return np.sin(2 * np.pi * np.cumsum(45 + 160 * np.exp(-tt * 18)) / SR) * np.exp(-tt * 5) + filt(rng.standard_normal(len(tt)), lo=1500) * np.exp(-tt * 40) * 0.5
def pop(): tt = t(0.1); return np.sin(2 * np.pi * np.cumsum(1000 * np.exp(-tt * 50) + 500) / SR) * np.exp(-tt * 40)
for ad, x in [("vuus", vuus(True)), ("vuus2", vuus(False)), ("darbe", darbe()), ("pop", pop())]: kaydet(f"public/sfx_hizli/{ad}.wav", x)
B = 60 / 140; N = int(SR * SON); L = np.zeros(N); R = np.zeros(N)
def ekle(x, b, g=(1, 1)):
    i = int(b * SR)
    if 0 <= i < N: j = min(N, i + len(x)); L[i:j] += x[:j - i] * g[0]; R[i:j] += x[:j - i] * g[1]
akor = [[57, 60, 64], [53, 57, 60], [55, 59, 62], [52, 55, 59]]; basn = [45, 41, 43, 40]
x = 0.0; i = 0
while x < SON - 0.3:
    olcu = i // 4; a = akor[olcu % 4]
    tk = t(0.25); ekle(np.sin(2 * np.pi * np.cumsum(50 + 100 * np.exp(-tk * 40)) / SR) * np.exp(-tk * 12) * 0.6, x)
    if i % 2 == 1: tc = t(0.18); ekle(filt(rng.standard_normal(len(tc)), lo=1200, hi=6000) * np.exp(-tc * 25) * 0.3, x)
    for h in range(4): th = t(0.03); ekle(filt(rng.standard_normal(len(th)), lo=8000) * np.exp(-th * 150) * (0.08 if h % 2 else 0.04), x + h * B / 4, (0.8, 1))
    tb = t(B / 2 * 0.9); bs = np.sign(np.sin(2 * np.pi * n2f(basn[olcu % 4]) * tb)) * 0.5 + np.sin(2 * np.pi * n2f(basn[olcu % 4]) * tb) * 0.5
    ekle(filt(bs, hi=800) * np.exp(-tb * 4) * 0.28, x + B / 2)
    if i % 4 == 0:
        tp = t(4 * B); pad = sum(2 * np.abs(2 * ((n2f(m + 12) * tp) % 1) - 1) - 1 for m in a); ekle(filt(pad, hi=2000) * np.minimum(1, tp * 8) * np.exp(-tp * 0.6) * 0.05, x)
    tl = t(0.2); m = a[[0, 2, 1, 2][i % 4]] + 24; ekle(np.sin(2 * np.pi * n2f(m) * tl) * np.exp(-tl * 18) * 0.08, x + B / 2, (1, 0.7) if i % 2 else (0.7, 1))
    x += B; i += 1
fd = int(SR * 0.5); L[-fd:] *= np.linspace(1, 0, fd); R[-fd:] *= np.linspace(1, 0, fd)
kaydet(f"{klasor}/muzik.wav", np.stack([L, R], 1)); print("ok")
