# halftone-dossier ses paleti: synth pop-print. Videoya özel skor (kelime zamanlarına göre) + foley.
# Kullanım: .venv-tts/bin/python scripts/muzik_dosya.py public/VID_002
import numpy as np, wave, os, sys, json
SR = 44100; rng = np.random.default_rng(3)
klasor = sys.argv[1]
K = json.load(open(f"{klasor}/kelimeler.json"))
def zt(k, i=0): return [w for w in K if w["kelime"].strip(".,!?") == k][i]["baslangic"]
def kaydet(yol, x):
    os.makedirs(os.path.dirname(yol), exist_ok=True)
    x = np.asarray(x, float)
    if x.ndim == 1: x = np.stack([x, x], 1)
    x = np.tanh(x / (np.max(np.abs(x)) + 1e-9) * 1.2) * 0.85  # yumuşak kırpma
    with wave.open(yol, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype(np.int16).tobytes())
def t(s): return np.arange(int(SR * s)) / SR
def filt(x, lo=None, hi=None):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    if hi: X *= 1 / np.sqrt(1 + (f / hi) ** 4)
    if lo: X *= 1 / np.sqrt(1 + (lo / np.maximum(f, 1)) ** 4)
    return np.fft.irfft(X, len(x))
def n2f(m): return 440 * 2 ** ((m - 69) / 12)
def env(n, a, r):
    e = np.ones(n); A = max(1, int(SR * a)); R = max(1, int(SR * r)); e[:A] = np.linspace(0, 1, A); e[-R:] *= np.linspace(1, 0, R) ** 2; return e

# ---------- FOLEY ----------
def muhur():
    tt = t(1.2)
    boom = np.sin(2 * np.pi * np.cumsum(55 + 140 * np.exp(-tt * 14)) / SR) * np.exp(-tt * 5)
    klik = filt(rng.standard_normal(len(tt)), lo=1500) * np.exp(-tt * 90)
    citir = filt(rng.standard_normal(len(tt)) * (rng.random(len(tt)) > 0.97), lo=2000) * np.exp(-tt * 8) * 0.8
    return boom + klik * 0.7 + citir * 0.5
def deklansor():
    a = t(0.12); b = filt(rng.standard_normal(len(a)), lo=1800, hi=8000) * np.exp(-a * 70)
    x = np.zeros(int(SR * 0.2)); x[:len(b)] += b; x[int(SR * 0.07):int(SR * 0.07) + len(b)] += b * 0.7; return x
def kagit():
    s = 0.5; tt = t(s); k = np.sin(np.pi * tt / s) ** 1.5
    return filt(rng.standard_normal(len(tt)), lo=700, hi=6000) * k * (0.7 + 0.3 * np.sin(tt * 120))
def dosya():  # klasör kapağı
    tt = t(0.35); return (np.sin(2 * np.pi * np.cumsum(180 * np.exp(-tt * 20) + 70) / SR) * np.exp(-tt * 20) + filt(rng.standard_normal(len(tt)), lo=500, hi=3000) * np.exp(-tt * 30) * 0.5)
def daktilo():
    tt = t(0.08); return filt(rng.standard_normal(len(tt)), lo=1500, hi=7000) * np.exp(-tt * 90) + np.sin(2 * np.pi * 210 * tt) * np.exp(-tt * 70) * 0.5
def vuus():
    s = 0.45; tt = t(s); k = np.sin(np.pi * tt / s) ** 2
    return (filt(rng.standard_normal(len(tt)), lo=300, hi=1200) * (1 - tt / s) + filt(rng.standard_normal(len(tt)), lo=1500, hi=5000) * (tt / s)) * k
def pop():
    tt = t(0.07); return np.sin(2 * np.pi * np.cumsum(1400 * np.exp(-tt * 60) + 500) / SR) * np.exp(-tt * 60)
def zip_():  # karartma
    s = 0.18; tt = t(s); return filt(rng.standard_normal(len(tt)), lo=2000, hi=9000) * np.sin(np.pi * tt / s) * (0.6 + 0.4 * np.sign(np.sin(2 * np.pi * 90 * tt)))
def kilit():
    a = t(0.06); b = filt(rng.standard_normal(len(a)), lo=2500) * np.exp(-a * 150)
    c = np.sin(2 * np.pi * 900 * t(0.15)) * np.exp(-t(0.15) * 40)
    x = np.zeros(int(SR * 0.3)); x[:len(b)] += b; x[int(SR * .09):int(SR * .09) + len(c)] += c * 0.6; x[int(SR * .09):int(SR * .09) + len(b)] += b; return x
def tik():
    tt = t(0.4); return sum(np.sin(2 * np.pi * n2f(m) * tt) * np.exp(-tt * 9) * a for m, a in [(84, 1), (96, .25)])
for ad, fn in [("muhur", muhur), ("deklansor", deklansor), ("kagit", kagit), ("dosya", dosya), ("daktilo", daktilo), ("vuus", vuus), ("pop", pop), ("zip", zip_), ("kilit", kilit), ("tik", tik)]:
    kaydet(f"public/sfx_dosya/{ad}.wav", fn())

# ---------- SKOR ----------
BPM = 112; B = 60 / BPM; E = B / 2
SON = K[-1]["bitis"] + 1.0
N = int(SR * SON); L = np.zeros(N); R = np.zeros(N)
def ekle(x, bas, g=(1, 1)):
    i = int(bas * SR)
    if i >= N or i < 0: return
    j = min(N, i + len(x)); L[i:j] += x[:j - i] * g[0]; R[i:j] += x[:j - i] * g[1]
def kick(): tt = t(0.35); return np.sin(2 * np.pi * np.cumsum(48 + 110 * np.exp(-tt * 35)) / SR) * np.exp(-tt * 10)
def snare(): tt = t(0.22); return filt(rng.standard_normal(len(tt)), lo=1200, hi=7000) * np.exp(-tt * 22) * 0.6 + np.sin(2 * np.pi * 190 * tt) * np.exp(-tt * 30) * 0.4
def clap():
    tt = t(0.25); n = filt(rng.standard_normal(len(tt)), lo=900, hi=5000); e = np.exp(-tt * 25)
    for d in (0.008, 0.017): e += np.roll(np.exp(-tt * 60), int(SR * d)) * 0.6
    return n * e * 0.5
def hat(a=0.25): tt = t(0.05); return filt(rng.standard_normal(len(tt)), lo=7000) * np.exp(-tt * 110) * a
def snap(): tt = t(0.06); return filt(rng.standard_normal(len(tt)), lo=2500, hi=6000) * np.exp(-tt * 120) * 0.8
def kare_bas(m, s):
    tt = t(s); x = np.sign(np.sin(2 * np.pi * n2f(m) * tt)) * 0.6 + np.sin(2 * np.pi * n2f(m) * tt) * 0.4
    return filt(x, hi=900) * env(len(tt), 0.004, 0.05) * 0.35
def marimba(m, s=0.6):
    tt = t(s); return (np.sin(2 * np.pi * n2f(m) * tt) + 0.35 * np.sin(2 * np.pi * n2f(m) * 4 * tt) * np.exp(-tt * 18)) * np.exp(-tt * 6) * 0.3
def pad(akor, s):
    tt = t(s); x = sum(2 * np.abs(2 * ((n2f(m) * tt) % 1) - 1) - 1 for m in akor)
    return filt(x, hi=1500) * env(len(tt), 0.3, 0.6) * 0.07
def zil(m): tt = t(1.6); return sum(np.sin(2 * np.pi * n2f(m) * h * tt) * np.exp(-tt * (3 + h * 2)) / h for h in (1, 2.76, 5.4)) * 0.18

basla_sirket = zt("adına"); cogu = zt("Çoğu"); haciz = zt("haciz"); ama = zt("Ama"); kur = zt("kuramıyor"); yorum = zt("Yorumlara")
basdizi = [38, 38, 45, 38, 41, 41, 43, 40]  # D minör sinsi
# A: 0 → çoğu (bas + şıklatma, şirketten sonra kick)
i = 0; x = 0.0
while x < cogu - 0.05:
    ekle(kare_bas(basdizi[i % 8], E * 0.9), x)
    if i % 4 == 2: ekle(snap(), x, (0.8, 1))
    if x >= basla_sirket:
        if i % 4 == 0: ekle(kick(), x)
        if i % 4 == 2: ekle(clap(), x)
        ekle(hat(0.18 if i % 2 else 0.1), x, (0.9, 1))
    i += 1; x += E
# B: trampet rulosu + yükseliş → sessizlik → (mühür foley'de)
sus1 = haciz - 0.32
x = cogu; aralik = E
while x < sus1:
    ekle(snare() * (0.3 + 0.7 * (x - cogu) / (sus1 - cogu)), x); aralik = max(0.04, aralik * 0.86); x += aralik
yuk = t(sus1 - cogu); f = 150 * (12 ** (yuk / yuk[-1]))
ekle((np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.15 + filt(rng.standard_normal(len(yuk)), lo=1500) * 0.25) * (yuk / yuk[-1]) ** 2, cogu)
# mühürden sonra hüzünlü tek pad
ekle(pad([50, 53, 57], ama - haciz - 0.2), haciz + 0.25)
# C: dönüm, parlak marimba + groove → sessizlik → mühür
sus2 = kur - 0.36
melodi = [74, 76, 77, 79, 81, 79, 77, 76, 74, 77, 81, 84]
i = 0; x = ama
while x < sus2:
    if i % 2 == 0: ekle(marimba(melodi[(i // 2) % len(melodi)]), x, (1, 0.8) if i % 4 else (0.8, 1))
    ekle(kare_bas([50, 50, 57, 50, 53, 53, 55, 57][i % 8], E * 0.9), x)
    if i % 4 == 0: ekle(kick(), x)
    if i % 4 == 2: ekle(clap(), x)
    ekle(hat(0.15), x, (0.9, 1)); i += 1; x += E
# D: kapanış groove + çan etiketi
i = 0; x = kur + 0.5
while x < SON - 0.6:
    ekle(kare_bas([50, 50, 57, 50, 55, 55, 53, 52][i % 8], E * 0.9), x)
    if i % 4 == 0: ekle(kick(), x)
    if i % 4 == 2: ekle(clap(), x)
    if i % 2 == 0: ekle(marimba([86, 81, 77, 81][(i // 2) % 4], 0.4) * 0.6, x)
    ekle(hat(0.15), x, (0.9, 1)); i += 1; x += E
for k, m in enumerate([74, 78, 81, 86]): ekle(zil(m), zt("göndereyim") + 0.25 + k * 0.12)
fade = int(SR * 0.6); L[-fade:] *= np.linspace(1, 0, fade); R[-fade:] *= np.linspace(1, 0, fade)
kaydet(f"{klasor}/muzik.wav", np.stack([L, R], 1))
# Ambiyans: kâğıt odası (çok kısık, sürekli)
amb = filt(rng.standard_normal(N), lo=200, hi=2500) * 0.05 + filt(rng.standard_normal(N), hi=180) * 0.06
kaydet(f"{klasor}/ambiyans.wav", amb)
print("ok", SON)
