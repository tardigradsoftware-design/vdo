# Minimal yatak (yumuşak piyano + pad) ve kalem/nokta efektleri. Kullanım: python muzik_cizgi.py public/Cxxx
import numpy as np, wave, os, sys, json
SR = 44100; rng = np.random.default_rng(4); klasor = sys.argv[1]
K = json.load(open(f"{klasor}/kelimeler.json")); SON = K[-1]["bitis"] + 1.0
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
tt = t(4.0); kalem = filt(rng.standard_normal(len(tt)), lo=2500, hi=9000) * (0.5 + 0.5 * np.abs(np.sin(tt * 7))) * (0.7 + 0.3 * rng.random(len(tt)))
kaydet("public/sfx_cizgi/kalem.wav", kalem)
tn = t(0.5); kaydet("public/sfx_cizgi/nokta.wav", np.sin(2 * np.pi * np.cumsum(500 * np.exp(-tn * 30) + 260) / SR) * np.exp(-tn * 18) + np.sin(2 * np.pi * n2f(88) * tn) * np.exp(-tn * 8) * 0.3)
N = int(SR * SON); L = np.zeros(N); R = np.zeros(N)
def ekle(x, b, g=(1, 1)):
    i = int(b * SR)
    if 0 <= i < N: j = min(N, i + len(x)); L[i:j] += x[:j - i] * g[0]; R[i:j] += x[:j - i] * g[1]
B = 60 / 84; notalar = [76, 79, 74, 72, 76, 81, 79, 74]; akor = [[60, 64, 67], [57, 60, 64], [53, 57, 60], [55, 59, 62]]
x = 0.0; i = 0
while x < SON - 0.5:
    if i % 4 == 0:
        tp = t(4 * B + 0.5); a = akor[(i // 4) % 4]
        ekle(filt(sum(np.sin(2 * np.pi * n2f(m) * tp) for m in a), hi=1200) * np.minimum(1, tp * 2) * np.exp(-tp * 0.4) * 0.08, x)
    if i % 2 == 0:
        tp = t(1.6); m = notalar[(i // 2) % 8]
        ekle(sum(np.sin(2 * np.pi * n2f(m) * h * tp) * np.exp(-tp * (2 + h)) / h for h in (1, 2, 3)) * 0.12, x, (1, 0.8) if i % 4 else (0.8, 1))
    x += B; i += 1
fd = int(SR * 0.8); L[-fd:] *= np.linspace(1, 0, fd); R[-fd:] *= np.linspace(1, 0, fd)
kaydet(f"{klasor}/muzik.wav", np.stack([L, R], 1)); print("ok")
