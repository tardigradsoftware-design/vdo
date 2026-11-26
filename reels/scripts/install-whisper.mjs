import path from "path";
import fs from "fs";
import {installWhisperCpp, downloadWhisperModel} from "@remotion/install-whisper-cpp";
const to = path.join(process.cwd(), "whisper.cpp");
if (!fs.existsSync(path.join(to, "build", "bin", "whisper-cli")) && !fs.existsSync(path.join(to, "main"))) {
  await installWhisperCpp({to, version: "1.7.4"});
}
await downloadWhisperModel({model: "large-v3-turbo", folder: to}); // varsa atlar
console.log("whisper hazır");
