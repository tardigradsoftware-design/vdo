import path from "path";
import {installWhisperCpp, downloadWhisperModel} from "@remotion/install-whisper-cpp";
const to = path.join(process.cwd(), "whisper.cpp");
await installWhisperCpp({to, version: "1.7.4"});
// model zaten varsa atlanır
await downloadWhisperModel({model: "large-v3-turbo", folder: to});
console.log("ok");
