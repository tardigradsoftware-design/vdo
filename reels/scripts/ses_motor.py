# Motor ses seti (10 efekt) + video uzunluğunda müzik yatağı. Temiz normalize, doyurma yok.
# Kullanım: .venv-tts/bin/python scripts/ses_motor.py <süre_sn> <cikti.wav>
import numpy as np, wave, os, sys
SR = 44100; rng = np.random.default_rng(21)
def kaydet(yol, x):
    os.makedirs(os.path.dirname(yol) or ".", exist_ok=True); x = np.asarray(x, float)
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
def kayan(s, a, b):
    tt = t(s); k = np.sin(np.pi * tt / s) ** 2; n = rng.standard_normal(len(tt))
    return (filt(n, lo=a, hi=b) * (1 - tt / s) + filt(n, lo=a * 2, hi=b * 2) * (tt / s)) * k
efekt = {
    "whoosh": kayan(0.42, 300, 2500),
    "supurme": kayan(0.6, 600, 5000),
    "darbe": (lambda tt: np.sin(2 * np.pi * np.cumsum(48 + 120 * np.exp(-tt * 22)) / SR) * np.exp(-tt * 7) + filt(rng.standard_normal(len(tt)), lo=1500) * np.exp(-tt * 45) * 0.4)(t(0.7)),
    "alcak": (lambda tt: np.sin(2 * np.pi * np.cumsum(38 + 50 * np.exp(-tt * 10)) / SR) * np.exp(-tt * 3.5))(t(1.2)),
    "tik": (lambda tt: np.sin(2 * np.pi * 2200 * tt) * np.exp(-tt * 140) + filt(rng.standard_normal(len(tt)), lo=4000) * np.exp(-tt * 300) * 0.4)(t(0.06)),
    "pop": (lambda tt: np.sin(2 * np.pi * np.cumsum(900 * np.exp(-tt * 45) + 420) / SR) * np.exp(-tt * 32))(t(0.14)),
    "reveal": (lambda tt: sum(np.sin(2 * np.pi * n2f(m) * tt) * np.exp(-tt * 5) * np.minimum(1, tt * 60) for m in (72, 79, 84)) * 0.5 + kayan(0.5, 2000, 8000)[:len(tt)] * 0.3)(t(0.5)),
    "kagit": (lambda s: filt(rng.standard_normal(len(t(s))), lo=900, hi=6500) * np.sin(np.pi * t(s) / s) ** 1.5)(0.35),
    "bildirim": (lambda tt: (np.sin(2 * np.pi * n2f(88) * tt) * np.exp(-tt * 9) + np.roll(np.sin(2 * np.pi * n2f(93) * tt) * np.exp(-tt * 9), int(SR * 0.09))))(t(0.6)),
    "vurgu": (lambda tt: (np.sin(2 * np.pi * n2f(60) * tt) + 0.5 * np.sin(2 * np.pi * n2f(67) * tt)) * np.exp(-tt * 6) + filt(rng.standard_normal(len(tt)), lo=3000) * np.exp(-tt * 60) * 0.3)(t(0.6)),
}
for ad, x in efekt.items(): kaydet(f"public/sfx_motor/{ad}.wav", x)
# Müzik: 118 BPM modern, sade (kick, kapalı hat, sub bas, pluck); TTS altında kalacak
SON = float(sys.argv[1]); cikti = sys.argv[2]
B = 60 / 118; N = int(SR * SON); L = np.zeros(N); Rr = np.zeros(N)
def ekle(x, b, g=(1, 1)):
    i = int(b * SR)
    if 0 <= i < N: j = min(N, i + len(x)); L[i:j] += x[:j - i] * g[0]; Rr[i:j] += x[:j - i] * g[1]
akor = [[62, 65, 69], [58, 62, 65], [60, 64, 67], [57, 60, 64]]; bas = [38, 34, 36, 33]
x = 0.0; i = 0
while x < SON:
    o = (i // 4) % 4
    tk = t(0.3); ekle(np.sin(2 * np.pi * np.cumsum(46 + 90 * np.exp(-tk * 38)) / SR) * np.exp(-tk * 11) * 0.55, x)
    if i % 2 == 1: tc = t(0.2); ekle(filt(rng.standard_normal(len(tc)), lo=1500, hi=7000) * np.exp(-tc * 28) * 0.18, x)
    for h in (0.5,): th = t(0.04); ekle(filt(rng.standard_normal(len(th)), lo=7500) * np.exp(-th * 120) * 0.07, x + B * h, (0.8, 1))
    tb = t(B * 0.95); ekle(np.sin(2 * np.pi * n2f(bas[o]) * tb) * np.minimum(1, tb * 80) * np.exp(-tb * 2) * 0.35, x)
    for k in range(2):
        m = akor[o][(i * 2 + k) % 3] + 12; tp = t(0.3)
        ekle(np.sin(2 * np.pi * n2f(m) * tp) * np.exp(-tp * 12) * 0.09, x + k * B / 2, (1, 0.75) if k else (0.75, 1))
    if i % 4 == 0:
        tp = t(4 * B); ekle(filt(sum(np.sin(2 * np.pi * n2f(m) * tp) for m in akor[o]), hi=1800) * np.minimum(1, tp * 3) * np.exp(-tp * 0.5) * 0.06, x)
    x += B; i += 1
fd = int(SR * 0.8); L[-fd:] *= np.linspace(1, 0, fd); Rr[-fd:] *= np.linspace(1, 0, fd)
kaydet(cikti, np.stack([L, Rr], 1)); print("ok")
