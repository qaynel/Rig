// Runner: spawnSkill on a script that forks a descendant, then outlives its timeout.
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { spawnSkill } from '../../../rig/catalog/skills/browser-and-research/browser-automation/browse/src/browser-skill-commands';

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-skill-fork-'));
const pidFile = path.join(dir, 'descendant.pid');
fs.writeFileSync(path.join(dir, 'script.ts'), `
import { spawn } from 'node:child_process';
import * as fs from 'node:fs';
const child = spawn(process.execPath, ['-e', 'setInterval(() => {}, 1000)'], { stdio: 'ignore' });
fs.writeFileSync(process.argv[process.argv.length - 1], String(child.pid));
setInterval(() => {}, 1000);
`);

const skill: any = { name: 'fork-skill', dir, tier: 'project', frontmatter: { trusted: true, host: 'x', description: 'x' } };
const result = await spawnSkill({ skill, skillArgs: [pidFile], trusted: true, timeoutSeconds: 2, port: 0 });
const descendantPid = fs.existsSync(pidFile) ? Number(fs.readFileSync(pidFile, 'utf8')) : null;
console.log(JSON.stringify({ timedOut: result.timedOut, exitCode: result.exitCode, descendantPid }));
process.exit(0);
