# Flat/kurumsal explainer müziği + yumuşak UI efektleri (temiz normalize, doyurma yok)
import numpy as np, wave, os, sys, json
SR = 44100; rng = np.random.default_rng(5)
klasor = sys.argv[1]; K = json.load(open(f"{klasor}/kelimeler.json"))
def zt(k, i=0): return [w for w in K if w["kelime"].strip(".,!?") == k][i]["baslangic"]
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
def env(n, a, r):
    e = np.ones(n); A = max(1, int(SR * a)); R = max(1, int(SR * r)); e[:A] = np.linspace(0, 1, A); e[-R:] *= np.linspace(1, 0, R) ** 2; return e
# efektler
def whoosh(): s = 0.5; tt = t(s); k = np.sin(np.pi * tt / s) ** 2; return filt(rng.standard_normal(len(tt)), lo=400, hi=2500) * k
def pop(): tt = t(0.12); return np.sin(2 * np.pi * np.cumsum(700 * np.exp(-tt * 40) + 400) / SR) * np.exp(-tt * 35)
def tap(): tt = t(0.08); return np.sin(2 * np.pi * 1800 * tt) * np.exp(-tt * 90) + filt(rng.standard_normal(len(tt)), lo=3000) * np.exp(-tt * 200) * 0.3
def jeton():
    x = np.zeros(int(SR * 1.0))
    for i in range(6):
        tt = t(0.3); n = sum(np.sin(2 * np.pi * f0 * tt) * np.exp(-tt * 14) for f0 in (2350 + i * 60, 3520 + i * 40))
        j = int(SR * i * 0.09); x[j:j + len(n)] += n * (1 - i * 0.1)
    return x
def basari():
    x = np.zeros(int(SR * 1.2))
    for i, m in enumerate([77, 81, 84, 89]):
        tt = t(0.8); n = (np.sin(2 * np.pi * n2f(m) * tt) + 0.3 * np.sin(4 * np.pi * n2f(m) * tt)) * np.exp(-tt * 5)
        j = int(SR * i * 0.08); x[j:j + len(n)] += n
    return x
def kagit(): s = 0.35; tt = t(s); return filt(rng.standard_normal(len(tt)), lo=900, hi=6000) * np.sin(np.pi * tt / s) ** 2 * 0.7
for ad, fn in [("whoosh", whoosh), ("pop", pop), ("tap", tap), ("jeton", jeton), ("basari", basari), ("kagit", kagit)]:
    kaydet(f"public/sfx_flat/{ad}.wav", fn())
# müzik: 100 BPM, Fa majör: F - Am - Bb - C
BPM = 100; B = 60 / BPM; SON = K[-1]["bitis"] + 1.0; N = int(SR * SON); L = np.zeros(N); R = np.zeros(N)
def ekle(x, b, g=(1, 1)):
    i = int(b * SR)
    if 0 <= i < N: j = min(N, i + len(x)); L[i:j] += x[:j - i] * g[0]; R[i:j] += x[:j - i] * g[1]
akor = [[53, 57, 60, 64], [57, 60, 64, 67], [58, 62, 65, 69], [60, 64, 67, 70]]
bas = [41, 45, 46, 48]
nefes = zt("aslında")
olcu = 4 * B; i = 0; x = 0.0
while x < SON - 0.5:
    a = akor[i % 4]; tt = t(olcu + 0.4)
    pad = sum(np.sin(2 * np.pi * n2f(m) * tt) + 0.3 * np.sin(2 * np.pi * n2f(m) * 2.003 * tt) for m in a)
    ekle(pad * env(len(tt), 0.5, 0.6) * 0.05, x)
    for k in range(8):
        b0 = x + k * B / 2
        if abs(b0 - nefes) < B: continue  # dönümde kısa nefes
        m = a[[0, 1, 2, 3, 2, 1, 2, 3][k]] + 12; tp = t(0.4)
        ekle((np.sin(2 * np.pi * n2f(m) * tp) * np.exp(-tp * 10)) * 0.12, b0, (0.8, 1) if k % 2 else (1, 0.8))
        if k % 2 == 0:
            tb = t(B * 0.9); ekle(np.sin(2 * np.pi * n2f(bas[i % 4]) * tb) * env(len(tb), 0.01, 0.2) * 0.25, b0)
        if i >= 1 and k in (0, 4):
            tk = t(0.25); ekle(np.sin(2 * np.pi * np.cumsum(50 + 70 * np.exp(-tk * 30)) / SR) * np.exp(-tk * 14) * 0.3, b0)
        if i >= 1: th = t(0.04); ekle(filt(rng.standard_normal(len(th)), lo=6000) * np.exp(-th * 90) * (0.05 if k % 2 else 0.025), b0 + B / 4, (0.7, 1))
    i += 1; x += olcu
fd = int(SR * 0.8); L[-fd:] *= np.linspace(1, 0, fd); R[-fd:] *= np.linspace(1, 0, fd)
kaydet(f"{klasor}/muzik.wav", np.stack([L, R], 1)); print("ok")
