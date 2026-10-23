// Runner: spawnXvfb against fake Xvfb/xdpyinfo on PATH, then close() it.
// The fake Xvfb forks a descendant, standing in for any helper X would fork.
import * as fs from 'fs';
import { spawnSync } from 'node:child_process';
import { spawnXvfb } from '../../../rig/catalog/skills/browser-and-research/browser-automation/browse/src/xvfb';

const handle = await spawnXvfb(99);
const pgid = Number(spawnSync('ps', ['-o', 'pgid=', '-p', String(handle.pid)], { encoding: 'utf8' }).stdout.trim());
const descendantPid = Number(fs.readFileSync(process.env.FAKE_X_CHILD_PID!, 'utf8').trim());
handle.close();
console.log(JSON.stringify({ pid: handle.pid, pgid, descendantPid }));
process.exit(0);
