// Runner: drive launchChromeAndExtract against the forking fake Chrome.
// argv: <scenario: success|timeout|cancel|hold> <port>
import * as path from 'path';
import { launchChromeAndExtract, CookieImportError } from '../../../rig/catalog/skills/browser-and-research/browser-automation/browse/src/cookie-import-browser';

const [scenario, portArg] = process.argv.slice(2);
const controller = new AbortController();
const never = () => new Promise<never>(() => {});
const base = {
  exePath: process.execPath,
  args: [path.join(import.meta.dir, 'fake-chrome.js'), `--remote-debugging-port=${portArg}`],
  debugPort: Number(portArg),
  browserName: 'FakeChrome',
  domains: ['example.com'],
};

let outcome = 'returned';
try {
  if (scenario === 'success') {
    await launchChromeAndExtract({ ...base, extract: async () => [] });
  } else if (scenario === 'timeout') {
    await launchChromeAndExtract({ ...base, startupTimeoutMs: 1500 });
  } else if (scenario === 'cancel') {
    setTimeout(() => controller.abort(), 1500);
    await launchChromeAndExtract({ ...base, signal: controller.signal, extract: never });
  } else if (scenario === 'hold') {
    await launchChromeAndExtract({ ...base, extract: never });
  }
} catch (err) {
  outcome = err instanceof CookieImportError ? `CookieImportError:${err.code}` : `error:${(err as Error).message}`;
}
console.log(JSON.stringify({ outcome }));
process.exit(0);
