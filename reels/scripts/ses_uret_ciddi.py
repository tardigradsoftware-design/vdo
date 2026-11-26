# Ciddi tarz: karanlık ambient müzik yatağı + belgesel efektleri (tamamen sentez)
import numpy as np, wave, os
SR = 44100
rng = np.random.default_rng(11)
def kaydet(yol, x):
    os.makedirs(os.path.dirname(yol), exist_ok=True)
    x = np.asarray(x, float)
    if x.ndim == 1: x = np.stack([x, x], 1)
    x = x / (np.max(np.abs(x)) + 1e-9) * 0.89
    with wave.open(yol, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())
def t(s): return np.arange(int(SR*s))/SR
def filt(x, lo=None, hi=None):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1/SR)
    if hi: X *= 1/np.sqrt(1+(f/hi)**4)
    if lo: X *= 1/np.sqrt(1+(lo/np.maximum(f,1))**4)
    return np.fft.irfft(X, len(x))
def n2f(m): return 440*2**((m-69)/12)
def reverb(x, sure=2.5, karisim=0.35):
    ir = rng.standard_normal(int(SR*sure)) * np.exp(-t(sure)*3)
    ir = filt(ir, hi=4000)
    y = np.fft.irfft(np.fft.rfft(x, len(x)+len(ir)) * np.fft.rfft(ir, len(x)+len(ir)))[:len(x)]
    y /= np.max(np.abs(y))+1e-9
    return x*(1-karisim) + y*karisim*np.max(np.abs(x))

# --- Efektler ---
def darbe():  # sinematik low boom
    tt = t(2.0)
    sub = np.sin(2*np.pi*np.cumsum(30+60*np.exp(-tt*6))/SR) * np.exp(-tt*2.2)
    vur = filt(rng.standard_normal(len(tt)), hi=900) * np.exp(-tt*14)
    return reverb(sub*1.0 + vur*0.5, 2.5, 0.3)
def daktilo():
    tt = t(0.09)
    return filt(rng.standard_normal(len(tt)), lo=1200, hi=6000)*np.exp(-tt*80) + np.sin(2*np.pi*190*tt)*np.exp(-tt*60)*0.4
def kagit():
    tt = t(0.6); k = np.sin(np.pi*tt/0.6)**2
    return filt(rng.standard_normal(len(tt)), lo=600, hi=5000) * k * (0.6+0.4*np.sin(tt*90))
def muhur():
    tt = t(0.8)
    tok = np.sin(2*np.pi*np.cumsum(90*np.exp(-tt*25)+50)/SR)*np.exp(-tt*12)
    tik = filt(rng.standard_normal(len(tt)), hi=2500)*np.exp(-tt*50)
    return reverb(tok + tik*0.8, 1.2, 0.2)
def gecis():  # karanlık whoosh
    s = 0.7; tt = t(s); k = np.sin(np.pi*tt/s)**3
    n = rng.standard_normal(len(tt))
    return (filt(n, hi=700)*(1-tt/s) + filt(n, lo=800, hi=3000)*(tt/s)) * k
def yukselis(s=1.6):
    tt = t(s); f = 80*(10**(tt/s))
    return (np.sin(2*np.pi*np.cumsum(f)/SR)*0.25 + filt(rng.standard_normal(len(tt)), lo=1000)*0.35) * (tt/s)**2.5
def tiktak():
    tt = t(0.06); return filt(rng.standard_normal(len(tt)), lo=2000)*np.exp(-tt*140) + np.sin(2*np.pi*2400*tt)*np.exp(-tt*200)*0.5
def glitch():
    tt = t(0.25); x = np.sign(np.sin(2*np.pi*np.cumsum(rng.uniform(200,2000,len(tt)))/SR))
    return filt(x, hi=6000) * (rng.random(len(tt)) > 0.3) * np.exp(-tt*6) * 0.6
def onay():
    tt = t(0.8); return sum(np.sin(2*np.pi*f*tt)*np.exp(-tt*5)*a for f,a in [(n2f(74),1),(n2f(81),0.6)]) * np.minimum(1, tt*200)
for ad, fn in [("darbe",darbe),("daktilo",daktilo),("kagit",kagit),("muhur",muhur),("gecis",gecis),("yukselis",yukselis),("tiktak",tiktak),("glitch",glitch),("onay",onay)]:
    kaydet(f"public/sfx_ciddi/{ad}.wav", fn())

# --- Müzik: D minör, 70 BPM, drone + nabız + seyrek piyano ---
SURE = 64; N = int(SR*SURE); L = np.zeros(N); Rr = np.zeros(N)
tt = t(SURE)
drone = sum(np.sin(2*np.pi*n2f(m)*tt + np.sin(tt*0.3+i)*0.5) for i, m in enumerate([38, 45, 50]))
drone = drone * (0.6 + 0.4*np.sin(2*np.pi*tt/16))
pad = filt(sum((2*((n2f(m)*d*tt) % 1)-1) for m in [62, 65, 69] for d in (0.996, 1.004)), hi=700)
L += drone*0.18 + pad*0.05; Rr += drone*0.18 + pad*0.05*0.9
vurus = 60/70
def ekle(x, b, g=(1,1)):
    i = int(b*SR); j = min(N, i+len(x))
    if i < N: L[i:j] += x[:j-i]*g[0]; Rr[i:j] += x[:j-i]*g[1]
for k in range(int(SURE/vurus)):
    if k < 4: continue
    b = k*vurus; ts = t(0.5)
    kalp = np.sin(2*np.pi*np.cumsum(40+50*np.exp(-ts*20))/SR)*np.exp(-ts*9)
    ekle(kalp*0.45, b); ekle(kalp*0.25, b+0.22)
    if k % 2 == 1:
        th = t(0.04); ekle(filt(rng.standard_normal(len(th)), lo=6000)*np.exp(-th*100)*0.05, b+vurus/2, (0.7, 1))
piyano = [74, 77, 76, 72, 74, 69, 70, 72]
for i in range(int(SURE/(vurus*4))):
    m = piyano[i % len(piyano)]; tp = t(2.5)
    nota = sum(np.sin(2*np.pi*n2f(m)*h*tp)*np.exp(-tp*(1.5+h))/h for h in (1, 2, 3))
    ekle(nota*0.10, i*vurus*4 + vurus, (0.8, 1.0) if i % 2 else (1.0, 0.8))
mix = np.stack([L, Rr], 1)
mix[:, 0] = reverb(mix[:, 0], 3, 0.25); mix[:, 1] = reverb(mix[:, 1], 3, 0.25)
f = int(SR*0.6); mix[-f:] *= np.linspace(1, 0, f)[:, None]
kaydet("public/muzik/ciddi.wav", mix)
print("ok")
