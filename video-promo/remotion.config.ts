// See all configuration options: https://remotion.dev/docs/config
// Each option also is available as a CLI flag: https://remotion.dev/docs/cli

// Note: When using the Node.JS APIs, the config file doesn't apply. Instead, pass options directly to the APIs

import { existsSync } from "node:fs";
import { Config } from "@remotion/cli/config";
import { enableTailwind } from '@remotion/tailwind-v4';

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.overrideWebpackConfig(enableTailwind);

// Some sandboxes block downloading Remotion's own headless Chrome and only
// allow a pre-installed Playwright browser. Use it when present, otherwise
// fall back to Remotion's default (downloaded) browser.
const sandboxBrowser = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
if (existsSync(sandboxBrowser)) {
  Config.setBrowserExecutable(sandboxBrowser);
  Config.setChromiumIgnoreCertificateErrors(true);
}
