// Kullanım: node scripts/transcribe.mjs [public/ses.mp3]
// public/ses.mp3 -> kelimeler.json (her kelimenin başlangıç/bitiş saniyesi). Ses değiştirilmez.
import path from "path";
import fs from "fs";
import {execSync} from "child_process";
import {transcribe, toCaptions} from "@remotion/install-whisper-cpp";

const input = process.argv[2] ?? "public/ses.mp3";
const whisperPath = path.join(process.cwd(), "whisper.cpp");
const wav = path.join(process.cwd(), "whisper.cpp", "_tmp16k.wav");
execSync(`ffmpeg -y -loglevel error -i "${input}" -ar 16000 -ac 1 "${wav}"`);

const out = await transcribe({
  inputPath: wav,
  whisperPath,
  whisperCppVersion: "1.7.4",
  model: "large-v3-turbo",
  language: "tr",
  tokenLevelTimestamps: true,
  splitOnWord: true,
});
const {captions} = toCaptions({whisperCppOutput: out});
const kelimeler = captions
  .map((c) => ({kelime: c.text.trim(), baslangic: c.startMs / 1000, bitis: c.endMs / 1000}))
  .filter((k) => k.kelime.length > 0);
fs.writeFileSync("kelimeler.json", JSON.stringify(kelimeler, null, 2));
fs.unlinkSync(wav);
console.log(`${kelimeler.length} kelime -> kelimeler.json`);
