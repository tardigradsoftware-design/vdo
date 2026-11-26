/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setDefaultPremountInSeconds(2);

// Bulut container'ında hazır gelen Chromium (Remotion'ın indirmesi engelli).
import fs from "fs";
const hazirChrome = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
if (fs.existsSync(hazirChrome)) {
  Config.setBrowserExecutable(hazirChrome);
}
