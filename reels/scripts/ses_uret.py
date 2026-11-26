# Telifsiz müzik yatağı ve efekt sesleri üretir (tamamen sentez, harici örnek yok).
# Kullanım: .venv-tts/bin/python scripts/ses_uret.py
import numpy as np, wave, os
SR = 44100
rng = np.random.default_rng(7)

def kaydet(yol, x, stereo=False):
    os.makedirs(os.path.dirname(yol), exist_ok=True)
    x = np.asarray(x, dtype=np.float64)
    if x.ndim == 1: x = np.stack([x, x], 1)
    x = x / (np.max(np.abs(x)) + 1e-9) * 0.89
    with wave.open(yol, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())

def t(sn): return np.arange(int(SR * sn)) / SR
def env(n, a, r):
    e = np.ones(n); A = int(SR*a); R = int(SR*r)
    if A: e[:A] = np.linspace(0, 1, A)
    if R: e[-R:] *= np.linspace(1, 0, R) ** 2
    return e
def lp(x, k):  # basit tek kutuplu alçak geçiren, k: 0..1
    y = np.zeros_like(x); a = 0.0
    for i in range(len(x)): a += k * (x[i] - a); y[i] = a
    return y
def lp_hizli(x, kesim):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1/SR)
    X *= 1 / np.sqrt(1 + (f / kesim) ** 4); return np.fft.irfft(X, len(x))
def hp_hizli(x, kesim):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1/SR)
    X *= 1 / np.sqrt(1 + (kesim / np.maximum(f, 1)) ** 4); return np.fft.irfft(X, len(x))

# ---------- EFEKTLER ----------
def whoosh(sure=0.45):
    n = rng.standard_normal(int(SR*sure)); tt = t(sure)
    k = np.sin(np.pi * tt / sure) ** 2
    parca = [lp_hizli(n, 400 + 5000 * kk) for kk in [0.2, 0.5, 0.9]]
    x = parca[0]*(1-k) + parca[2]*k
    return x * k
def pop():
    tt = t(0.12); f = 900 * np.exp(-tt * 30) + 300
    return np.sin(2*np.pi*np.cumsum(f)/SR) * np.exp(-tt * 35)
def damga():
    tt = t(0.5)
    govde = np.sin(2*np.pi*np.cumsum(120*np.exp(-tt*18)+45)/SR) * np.exp(-tt*9)
    tik = lp_hizli(rng.standard_normal(len(tt)), 3000) * np.exp(-tt*60)
    return govde * 1.0 + tik * 0.6
def tik():
    tt = t(0.05); return hp_hizli(rng.standard_normal(len(tt)), 2500) * np.exp(-tt*120)
def klavye():
    tt = t(0.07); return hp_hizli(rng.standard_normal(len(tt)), 1500) * np.exp(-tt*90) + np.sin(2*np.pi*1800*tt)*np.exp(-tt*150)*0.3
def ding():
    tt = t(1.0)
    return sum(np.sin(2*np.pi*f*tt)*np.exp(-tt*d)*a for f, d, a in [(1320,4,1),(1980,6,.4),(2640,8,.2)])
def yukselis(sure=1.2):
    tt = t(sure); f = 200 * (8 ** (tt/sure))
    ton = np.sin(2*np.pi*np.cumsum(f)/SR) * 0.3
    gurultu = hp_hizli(rng.standard_normal(len(tt)), 1500) * 0.5
    return (ton + gurultu) * (tt/sure) ** 2
def para():
    tt = t(0.6)
    x = sum(np.sin(2*np.pi*f*tt)*np.exp(-tt*d) for f, d in [(2093,10),(2637,12),(3136,14)])
    x2 = np.roll(x, int(SR*0.07)) * 0.7
    return x + x2

for ad, fn in [("whoosh", whoosh), ("pop", pop), ("damga", damga), ("tik", tik), ("klavye", klavye), ("ding", ding), ("yukselis", yukselis), ("para", para)]:
    kaydet(f"public/sfx/{ad}.wav", fn())

# ---------- MÜZİK YATAĞI (96 BPM, Am-F-C-G, 64 sn) ----------
BPM = 96; vurus = 60 / BPM; olcu = vurus * 4; SURE = 64
N = int(SR * SURE); L = np.zeros(N); Rr = np.zeros(N)
def ekle(x, bas, kanal=(1, 1)):
    i = int(bas * SR); j = min(N, i + len(x))
    if i >= N: return
    L[i:j] += x[:j-i] * kanal[0]; Rr[i:j] += x[:j-i] * kanal[1]
def nota(m): return 440 * 2 ** ((m - 69) / 12)
akorlar = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]  # Am F C G
baslar = [45, 41, 48, 43]
olcu_sayisi = int(SURE / olcu)
for o in range(olcu_sayisi):
    ak = akorlar[o % 4]; b0 = o * olcu
    # Pad: hafif detune testere, yumuşak
    tt = t(olcu + 0.3)
    pad = sum(((2*((nota(m)*d*tt) % 1)-1)) for m in ak for d in (0.997, 1.003))
    pad = lp_hizli(pad, 1200) * env(len(tt), 0.4, 0.5) * 0.06
    ekle(pad, b0)
    # Bas
    for v in range(4):
        tb = t(vurus * 0.9)
        bs = np.sin(2*np.pi*nota(baslar[o % 4])*tb) * env(len(tb), 0.005, 0.2) * 0.35
        ekle(bs, b0 + v * vurus)
    # Arpej pluck (8'lik)
    sira = [0, 1, 2, 1, 0, 2, 1, 2]
    for s in range(8):
        m = ak[sira[s]] + 12; tp = t(0.35)
        pl = (np.sin(2*np.pi*nota(m)*tp) + 0.3*np.sin(4*np.pi*nota(m)*tp)) * np.exp(-tp*9) * 0.12
        ekle(pl, b0 + s * vurus / 2, (0.7, 1.0) if s % 2 else (1.0, 0.7))
    # Davul (ilk 2 ölçü hariç)
    if o >= 2:
        for v in range(4):
            if v in (0, 2):
                tk = t(0.3); kick = np.sin(2*np.pi*np.cumsum(50+90*np.exp(-tk*30))/SR) * np.exp(-tk*12) * 0.5
                ekle(kick, b0 + v * vurus)
            if v in (1, 3):
                ts = t(0.2); sn = hp_hizli(rng.standard_normal(len(ts)), 1800) * np.exp(-ts*22) * 0.12
                ekle(sn, b0 + v * vurus)
        for h in range(8):
            th = t(0.05); hat = hp_hizli(rng.standard_normal(len(th)), 7000) * np.exp(-th*80) * (0.07 if h % 2 else 0.04)
            ekle(hat, b0 + h * vurus / 2, (0.8, 1.0))
# Döngü sonu yumuşak
fade = int(SR * 0.5); L[-fade:] *= np.linspace(1, 0, fade); Rr[-fade:] *= np.linspace(1, 0, fade)
kaydet("public/muzik/yatak.wav", np.stack([L, Rr], 1))
print("ok")
