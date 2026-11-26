# HakVideo ses seti: tek seferlik. 14 efekt + 3 müzik parçası (110–130 BPM havuz). Tamamı sentez, lisans temiz.
import numpy as np, wave, os
SR = 44100; rng = np.random.default_rng(42)
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
def gurultu(s): return rng.standard_normal(int(SR * s))
def para():
    x = np.zeros(int(SR * 0.9))
    for i in range(5):
        tt = t(0.35); n = sum(np.sin(2 * np.pi * f * tt) * np.exp(-tt * 16) for f in (2400 + i * 90, 3600 + i * 70, 5100)); j = int(SR * i * 0.07); x[j:j + len(n)] += n * (1 - i * 0.12)
    return x
E = {
    "acilis_para": para() + np.concatenate([np.sin(2 * np.pi * np.cumsum(60 + 120 * np.exp(-t(0.9) * 25)) / SR) * np.exp(-t(0.9) * 6) * 1.2, np.zeros(0)]),
    "acilis_alarm": (lambda tt: np.sign(np.sin(2 * np.pi * (880 + 220 * np.sign(np.sin(2 * np.pi * 6 * tt))) * tt)) * 0.4 * np.exp(-tt * 2.5) * np.minimum(1, tt * 80))(t(0.8)),
    "acilis_tokmak": (lambda tt: np.sin(2 * np.pi * np.cumsum(140 * np.exp(-tt * 30) + 90) / SR) * np.exp(-tt * 14) + filt(gurultu(0.7), lo=800, hi=4000) * np.exp(-tt * 60) * 0.8)(t(0.7)),
    "whoosh": (lambda s: (lambda tt, n: (filt(n, lo=300, hi=1800) * (1 - tt / s) + filt(n, lo=1200, hi=6000) * (tt / s)) * np.sin(np.pi * tt / s) ** 2)(t(s), gurultu(s)))(0.38),
    "pop": (lambda tt: np.sin(2 * np.pi * np.cumsum(950 * np.exp(-tt * 45) + 430) / SR) * np.exp(-tt * 34))(t(0.14)),
    "damga": (lambda tt: np.sin(2 * np.pi * np.cumsum(50 + 150 * np.exp(-tt * 24)) / SR) * np.exp(-tt * 7) + filt(gurultu(0.7), lo=1200) * np.exp(-tt * 50) * 0.6)(t(0.7)),
    "para": para(),
    "alarm": (lambda tt: np.sin(2 * np.pi * (950 + 250 * (np.floor(tt * 8) % 2)) * tt) * np.exp(-tt * 3) * np.minimum(1, tt * 100))(t(0.55)),
    "saat": np.concatenate([np.concatenate([filt(gurultu(0.03), lo=3000) * np.exp(-t(0.03) * 200) * (1 if i % 2 else 0.6), np.zeros(int(SR * 0.12))]) for i in range(5)]),
    "buzzer": (lambda tt: filt(np.sign(np.sin(2 * np.pi * 110 * tt)) + np.sign(np.sin(2 * np.pi * 116 * tt)), hi=2500) * np.minimum(1, tt * 100) * np.exp(-tt * 3))(t(0.45)),
    "ding": (lambda tt: sum(np.sin(2 * np.pi * n2f(m) * tt) * np.exp(-tt * d) for m, d in ((88, 5), (95, 7))))(t(0.9)),
    "riser": (lambda tt: (np.sin(2 * np.pi * np.cumsum(200 * 6 ** (tt / 0.5)) / SR) * 0.3 + filt(gurultu(0.5), lo=1500) * 0.5) * (tt / 0.5) ** 2)(t(0.5)),
    "tus": (lambda tt: filt(gurultu(0.06), lo=1800, hi=7000) * np.exp(-tt * 110) + np.sin(2 * np.pi * 220 * tt) * np.exp(-tt * 80) * 0.4)(t(0.06)),
    "bildirim": (lambda tt: np.sin(2 * np.pi * n2f(84) * tt) * np.exp(-tt * 8) + np.roll(np.sin(2 * np.pi * n2f(91) * tt) * np.exp(-tt * 8), int(SR * 0.1)))(t(0.8)),
}
for ad, x in E.items(): kaydet(f"public/hak/sfx/{ad}.wav", x)
def muzik(bpm, kok, tohum, sure=60):
    r = np.random.default_rng(tohum); B = 60 / bpm; N = int(SR * sure); L = np.zeros(N); R = np.zeros(N)
    def ekle(x, b, g=(1, 1)):
        i = int(b * SR)
        if 0 <= i < N: j = min(N, i + len(x)); L[i:j] += x[:j - i] * g[0]; R[i:j] += x[:j - i] * g[1]
    akor = [[0, 3, 7], [-4, 0, 3], [-2, 2, 5], [-5, -1, 2]]; x = 0.0; i = 0
    while x < sure:
        o = (i // 4) % 4; a = [kok + 12 + v for v in akor[o]]
        tk = t(0.28); ekle(np.sin(2 * np.pi * np.cumsum(48 + 100 * np.exp(-tk * 40)) / SR) * np.exp(-tk * 12) * 0.6, x)
        if i % 2: tc = t(0.18); ekle(filt(r.standard_normal(len(tc)), lo=1500, hi=7000) * np.exp(-tc * 26) * 0.22, x)
        for h in (0.25, 0.5, 0.75): th = t(0.03); ekle(filt(r.standard_normal(len(th)), lo=7500) * np.exp(-th * 130) * (0.09 if h == 0.5 else 0.04), x + B * h, (0.8, 1))
        tb = t(B / 2 * 0.9)
        for h in (0, 0.5): ekle(filt(np.sign(np.sin(2 * np.pi * n2f(kok - 12 + akor[o][0]) * tb)), hi=700) * np.exp(-tb * 5) * 0.25, x + B * h)
        for k in range(2):
            m = a[(i + k) % 3] + 12; tp = t(0.25); ekle(np.sin(2 * np.pi * n2f(m) * tp) * np.exp(-tp * 14) * 0.1, x + k * B / 2, (1, 0.7) if k else (0.7, 1))
        x += B; i += 1
    return np.stack([L, R], 1)
for k, (bpm, kok, s) in enumerate([(118, 57, 1), (124, 60, 2), (112, 55, 3)]): kaydet(f"public/hak/muzik/{k + 1}.wav", muzik(bpm, kok, s))
print("ok")
