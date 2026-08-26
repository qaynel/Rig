/**
 * Centralized brain CLI invocation.
 *
 * Every `brain ...` spawn from `bin/rig-brain-sync.ts` and
 * `bin/rig-memory-ingest.ts` MUST go through `spawnbrain` (or
 * `execbrainJson`), and the invariant test
 * `test/brain-exec-invariant.test.ts` enforces this with a static-source
 * grep. The helper layer guarantees three properties:
 *
 *   1. **DATABASE_URL is seeded from brain's own config**, not from the
 *      caller's `.env.local`. brain auto-loads `.env.local` via dotenv on
 *      startup. When `/sync-brain` runs inside a Next.js / Prisma / Rails
 *      project with its own `DATABASE_URL`, brain reads that one and not
 *      its own `${BRAIN_HOME:-$HOME/.brain}/config.json`. Auth fails;
 *      code + memory stages crash; only brain-sync's git push survives.
 *
 *   2. **Bun-aware env passing.** Mutating `process.env.DATABASE_URL` does
 *      NOT propagate to children of `child_process.spawnSync`/`spawn` in
 *      Bun — the child gets the original startup env. So we cannot just
 *      set process.env; we must thread an explicit `env:` dict to every
 *      spawn. This is the central bug the helper exists to prevent
 *      regressing on.
 *
 *   3. **`BRAIN_HOME` honored consistently.** Other rig helpers
 *      (`detectEngineTier`) already honor `BRAIN_HOME`. `buildbrainEnv`
 *      reads from `${BRAIN_HOME:-$HOME/.brain}/config.json` so all
 *      rig-side brain calls agree on which config file matters.
 *
 * **Escape hatch:** `RIG_RESPECT_ENV_DATABASE_URL=1` returns the
 * caller's env unchanged. Use only when the brain intentionally lives in
 * the project's local DB (rare).
 */

import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { homedir } from "os";
import { type SpawnSyncReturns, type ChildProcess, type SpawnOptions } from "child_process";
import { spawnGuarded, spawnGuardedSync } from "../../../lib/spawn-guarded";

interface brainConfig {
  database_url?: string;
}

export interface BuildbrainEnvOptions {
  /**
   * Caller env to extend. Defaults to `process.env`. Tests inject a
   * synthetic env so the helper can be exercised without polluting the
   * real process env.
   */
  baseEnv?: NodeJS.ProcessEnv;
  /**
   * When true, announce on stderr that we overrode the caller's
   * DATABASE_URL. Suppressed for the `--quiet` sync flow.
   */
  announce?: boolean;
}

/**
 * Detect whether a DATABASE_URL targets a PgBouncer transaction-mode pooler.
 *
 * Supabase transaction-mode poolers conventionally run on port 6543 at
 * `*.pooler.supabase.com`. brain auto-disables prepared statements on these
 * (prepared statements break under transaction pooling — #1965); its banner
 * documents `BRAIN_PREPARE=true` as the override for poolers that actually
 * run in session mode on 6543.
 */
export function isTransactionModePooler(url: string): boolean {
  try {
    // DATABASE_URLs use postgresql:// scheme which URL() doesn't natively
    // parse host/port from, so swap to http:// for reliable parsing.
    const parsed = new URL(url.replace(/^postgres(ql)?:\/\//, "http://"));
    return parsed.port === "6543";
  } catch {
    return false;
  }
}

/**
 * Build an env dict with DATABASE_URL seeded from
 * `${BRAIN_HOME:-$HOME/.brain}/config.json`. Returns the base env
 * unchanged when:
 *   - `RIG_RESPECT_ENV_DATABASE_URL=1` (intentional opt-out),
 *   - the config file is missing or unparseable,
 *   - the config has no `database_url`,
 *   - the caller already set DATABASE_URL to the same value.
 *
 * BRAIN_PREPARE is never set here (#1965): brain auto-disables prepared
 * statements on transaction-mode poolers itself, and forcing them on breaks
 * every write with "prepared statement does not exist". A caller-set
 * BRAIN_PREPARE (either value) passes through untouched — that remains the
 * documented override for session-mode poolers on port 6543.
 *
 * Always returns a fresh object — mutating the returned env never
 * affects the caller's env. Tests assert on effective values, not
 * object identity.
 */
export function buildbrainEnv(opts: BuildbrainEnvOptions = {}): NodeJS.ProcessEnv {
  const baseEnv = opts.baseEnv || process.env;
  const out: NodeJS.ProcessEnv = { ...baseEnv };
  if (baseEnv.RIG_RESPECT_ENV_DATABASE_URL === "1") return out;

  const homeBase = baseEnv.HOME || homedir();
  const brainHome = baseEnv.BRAIN_HOME || join(homeBase, ".brain");
  const configPath = join(brainHome, "config.json");
  if (!existsSync(configPath)) return out;

  let cfg: brainConfig = {};
  try {
    cfg = JSON.parse(readFileSync(configPath, "utf-8")) as brainConfig;
  } catch {
    return out;
  }
  if (!cfg.database_url) return out;

  const hadCaller = baseEnv.DATABASE_URL !== undefined;
  const alreadyMatch = baseEnv.DATABASE_URL === cfg.database_url;
  if (!alreadyMatch) {
    out.DATABASE_URL = cfg.database_url;
    if (opts.announce) {
      const note = hadCaller ? " (overrode value from caller env / .env.local)" : "";
      process.stderr.write(`[brain-exec] seeded DATABASE_URL from ${configPath}${note}\n`);
    }
  }

  return out;
}

/**
 * Windows can't directly spawn the `brain` launcher (bun/npm install it as a
 * `brain.cmd`/`.ps1` shim) or a shebang script like the bash `rig-brain-sync`
 * — `spawnSync`/`spawn` resolve those only through a shell's PATHEXT + interpreter
 * lookup. Without `shell: true` the child spawn fails ENOENT, which on the sync
 * orchestrator surfaced as "brain-sync exited undefined" (#1731). Gate on platform
 * so POSIX keeps the cheaper no-shell path. Exported so the static-grep tripwire
 * (test/brain-spawn-windows-shell.test.ts) can assert every brain/brain-sync
 * spawn carries it.
 */
export const NEEDS_SHELL_ON_WINDOWS = process.platform === "win32";

export interface SpawnbrainOptions {
  /** Timeout in milliseconds. Defaults to 30s. */
  timeout?: number;
  /** Working directory for the child process. */
  cwd?: string;
  /** Stdio configuration. Defaults to capturing both stdout and stderr. */
  stdio?: "inherit" | "pipe" | "ignore" | Array<"inherit" | "pipe" | "ignore">;
  /**
   * Base env to extend before seeding DATABASE_URL. Defaults to
   * `process.env`. Tests inject a synthetic env so the spawn picks up a
   * brain shim on PATH and a fake `~/.brain/config.json`.
   */
  baseEnv?: NodeJS.ProcessEnv;
  /** Whether to announce DATABASE_URL seeding on stderr. */
  announce?: boolean;
}

/**
 * Spawn `brain <args>` with the seeded env. Returns the raw
 * `SpawnSyncReturns<string>` so callers can inspect `status`, `stdout`,
 * `stderr` exactly as they would with `spawnSync` directly.
 */
export function spawnbrain(args: string[], opts: SpawnbrainOptions = {}): SpawnSyncReturns<string> {
  return spawnGuardedSync("brain", args, {
    encoding: "utf-8",
    timeout: opts.timeout ?? 30_000,
    cwd: opts.cwd,
    stdio: opts.stdio || ["ignore", "pipe", "pipe"],
    env: buildbrainEnv({ baseEnv: opts.baseEnv, announce: opts.announce }),
    shell: NEEDS_SHELL_ON_WINDOWS, // #1731: brain is a .cmd shim on Windows
  });
}

/**
 * Run `brain <args>` and parse stdout as JSON. Returns `null` on
 * non-zero exit, parse failure, or timeout. Useful for `brain sources
 * list --json` and similar.
 */
export function execbrainJson<T = unknown>(args: string[], opts: SpawnbrainOptions = {}): T | null {
  const r = spawnbrain(args, opts);
  if (r.status !== 0) return null;
  try {
    return JSON.parse(r.stdout || "null") as T;
  } catch {
    return null;
  }
}

/**
 * Async streaming variant for callers that need to attach stdout/stderr
 * listeners (e.g., `brain import` in `rig-memory-ingest.ts`). Always
 * injects the seeded env. Returns the raw `ChildProcess` so the caller
 * can wire up its own promise around exit/timeout/signal handling.
 */
export function spawnbrainAsync(
  args: string[],
  opts: { stdio?: SpawnOptions["stdio"]; cwd?: string; baseEnv?: NodeJS.ProcessEnv } = {},
): ChildProcess {
  return spawnGuarded("brain", args, {
    stdio: opts.stdio || ["ignore", "pipe", "pipe"],
    cwd: opts.cwd,
    env: buildbrainEnv({ baseEnv: opts.baseEnv, announce: false }),
    shell: NEEDS_SHELL_ON_WINDOWS, // #1731: brain is a .cmd shim on Windows
  });
}

/**
 * Run `brain <args>` via execFileSync. Throws on non-zero exit. Useful
 * for callers that want to surface brain's stderr as the error message.
 */
export function execbrainText(args: string[], opts: SpawnbrainOptions = {}): string {
  const result = spawnGuardedSync("brain", args, {
    encoding: "utf-8",
    timeout: opts.timeout ?? 30_000,
    cwd: opts.cwd,
    stdio: opts.stdio || ["ignore", "pipe", "pipe"],
    env: buildbrainEnv({ baseEnv: opts.baseEnv, announce: opts.announce }),
    shell: NEEDS_SHELL_ON_WINDOWS, // #1731: brain is a .cmd shim on Windows
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    const error = new Error(`brain exited with status ${result.status}`);
    error.stderr = result.stderr;
    throw error;
  }
  return result.stdout || "";
}
