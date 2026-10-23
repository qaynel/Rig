# Using Brain with Rig

Your coding agent, with a memory it actually keeps.

[Brain](https://github.com/garrytan/brain) is a persistent knowledge base designed for AI agents. It stores what your agent learns, what you've decided, what worked and what didn't, and lets the agent search all of it on demand. Rig gives you a one-command path from zero to "brain is running, and my agent can call it" — with paths for try-it-local, share-with-your-team, and everything between.

This is the full monty: every scenario, every flag, every helper bin, every troubleshooting step. For the quick pitch, see the [README's Brain section](README.md#brain--persistent-knowledge-for-your-coding-agent). For error codes and sync-specific issues, see [docs/brain-sync.md](docs/brain-sync.md).

---

## The one-command install

```bash
/setup-brain
```

That's it. The skill detects your current state, asks three questions at most, and walks you through install, init, MCP registration for Claude Code, and per-repo trust policy. On a clean Mac with nothing installed it finishes in under five minutes. On a Mac where something's already set up it takes seconds (it detects the existing state and skips done work).

## What you get after setup

Once `/setup-brain` finishes, your coding agent has two retrieval surfaces it didn't have before:

- **Semantic code search across this repo.** `brain search "browser security canary"` returns ranked file regions, not exact-match grep hits. `brain code-def`, `code-refs`, `code-callers`, `code-callees` walk the call graph by symbol — useful when you don't know which file holds the implementation but you know what it does. The agent prefers these over Grep when the question is semantic; CLAUDE.md gets a `## Brain Search Guidance` block that teaches it the routing rules.
- **Cross-session memory.** Plans, retros, decisions, and learnings from past sessions live in `~/.rig/` and (if you opted in to artifacts sync) get pushed to a private git repo that brain indexes. `brain search "what did we decide about auth?"` actually finds the prior CEO plan instead of you re-describing context every session.

If you also enabled remote MCP (Path 4 below), brain queries route to a shared brain server that other machines can write to — your laptop, your desktop, and a teammate's machine all see the same memory.

## The four paths

You pick one when the skill asks "Where should your brain live?"

### Path 1: Supabase, you already have a connection string

Best for: you (or a teammate's cloud agent) already provisioned a Supabase brain and you want this local machine to use the same data.

**What happens:** Paste the Session Pooler URL (Settings → Database → Connection Pooler → Session → copy URI, port 6543). The skill reads it with echo off, shows you a redacted preview (`aws-0-us-east-1.pooler.supabase.com:6543/postgres` — host visible, password masked), hands it to `brain init` via the `BRAIN_DATABASE_URL` environment variable, and the URL is never written to argv or your shell history.

**Trust warning:** Pasting this URL gives your local Claude Code full read/write access to every page in the shared brain. If that's not the trust level you want, pick PGLite local (Path 3) instead and accept the brains are disjoint.

### Path 2a: Supabase, auto-provision a new project

Best for: fresh Supabase account, you want a clean new project with zero clicking.

**What happens:** You paste a Supabase Personal Access Token (PAT). The skill shows you the scope disclosure first — *the token grants full access to every project in your Supabase account, not just the one we're about to create*. It lists your organizations, asks which one and which region (default `us-east-1`), generates a database password, calls `POST /v1/projects`, polls `GET /v1/projects/{ref}` every 5 seconds until the project is `ACTIVE_HEALTHY` (180s timeout), fetches the pooler URL, hands it to `brain init`. End-to-end: ~90 seconds.

At the end: explicit reminder to revoke the PAT at https://supabase.com/dashboard/account/tokens. The skill already discarded it from memory.

**If you Ctrl-C mid-provision:** The SIGINT trap prints your in-flight project ref + a resume command. You can delete the orphan at the Supabase dashboard, or run `/setup-brain --resume-provision <ref>` to pick up where you left off.

### Path 2b: Supabase, create manually

Best for: you'd rather click through supabase.com yourself than paste a PAT.

**What happens:** The skill walks you through the four manual steps (signup → new project → wait ~2 min → copy Session Pooler URL), then takes over from Path 1's paste step. Same security treatment as Path 1.

### Path 3: PGLite local

Best for: try-it-first, no account, no cloud, no sharing. Or a dedicated "this Mac's brain" that stays isolated from any cloud agent.

**What happens:** `brain init --pglite`. Brain lives at `~/.brain/brain.pglite`. No network calls for the init itself. Done in 30 seconds.

**Embedding model.** When `VOYAGE_API_KEY` is set, rig inits PGLite with `voyage-code-3` (1024-dim) — Voyage's code-specialized embedding model, which beats their general-purpose `voyage-4-large` and OpenAI `text-embedding-3-large` head-to-head on this codebase's symbol queries. Without `VOYAGE_API_KEY`, brain auto-selects (OpenAI 1536-dim when `OPENAI_API_KEY` is present, else falls down its provider chain). Either way, the embeddings call out to the chosen provider's API during sync — set the key for the provider you want before running `/sync-brain`.

This is the best first choice if you just want to see what brain feels like before committing to cloud. You can always migrate later with `/setup-brain --switch`.

### Path 4: Remote brain MCP (split-engine)

Best for: your brain runs on another machine you control (Tailscale, ngrok, internal LAN) or a teammate's server. You want the cross-machine memory benefit without standing up a local database, and you still want symbol-aware code search on this Mac.

**What happens:** You paste an MCP URL (e.g. `https://wintermute.tail554574.ts.net:3131/mcp`) and a bearer token. The skill verifies the URL over the wire, registers brain as an HTTP MCP in `~/.claude.json` at user scope, and offers to also stand up a tiny local PGLite for code search (~30 seconds, ~120 MB disk).

If you accept the local PGLite, you end up in **split-engine mode**:

- **Brain/context queries** (`mcp__brain__search`, `mcp__brain__query`, `mcp__brain__get_page`) route to the remote MCP. Plans, retros, learnings, cross-machine memory — all on the shared server.
- **Code queries** (`brain code-def`, `code-refs`, `code-callers`, `code-callees`, `brain search` for code) route to the local PGLite via the `.brain-source` pin in each worktree. Indexed locally, fast, never leaves the machine.

The two engines are independent. Wiping the local PGLite doesn't touch the remote brain; rotating the remote MCP bearer doesn't affect local code search. This is also the right configuration if your remote brain admin can't (or shouldn't) index every developer's checkout — local code stays local.

## MCP registration for Claude Code

By default the skill asks "Give Claude Code a typed tool surface for brain?" If you say yes, it runs:

```bash
claude mcp add brain -- brain serve
```

That registers brain's stdio MCP server with Claude Code. Now `brain search`, `brain put`, `brain get`, etc. show up as first-class tools in every session, not bash shell-outs.

**If `claude` is not on PATH**, the skill skips MCP registration gracefully with a manual-register hint. The CLI resolver still works from any skill that shells out to `brain` — MCP is an upgrade, not a prerequisite.

**Other local agents** (Cursor, Codex CLI, etc.) need their own MCP registration. The skill is Claude-Code-targeted for v1; other hosts can register `brain serve` manually in their own MCP config.

## Per-remote trust policy (the triad)

Every repo on your machine gets a policy decision: **read-write**, **read-only**, or **deny**.

- **read-write** — your agent can `brain search` from this repo's context AND write new pages back to the brain. Default for your own projects.
- **read-only** — your agent can search the brain but never writes new pages from this repo's sessions. Ideal for multi-client consultants: search the shared brain, don't contaminate it with Client A's code while you're in Client B's repo.
- **deny** — no brain interaction at all. The repo is invisible to brain tooling.

The skill asks once per repo the first time you run a rig skill there. After that the decision is sticky — every worktree + branch of the same git remote shares the same policy, so you set it once and it follows you.

SSH and HTTPS remote variants collapse to the same key: `https://github.com/foo/bar.git` and `git@github.com:foo/bar.git` are the same repo.

**To change a policy:**

```bash
/setup-brain --repo      # re-prompt for this repo only

# Or directly:
~/.claude/skills/rig/bin/rig-brain-repo-policy set "github.com/foo/bar" read-only
```

**To see every policy:**

```bash
~/.claude/skills/rig/bin/rig-brain-repo-policy list
```

Storage: `~/.rig/brain-repo-policy.json`, mode 0600, schema-versioned so future migrations stay deterministic.

## Keeping the brain current with `/sync-brain`

`/setup-brain` is one-time onboarding. `/sync-brain` is the verb you run every time you want brain to see fresh changes in this repo's code.

```bash
/sync-brain                # incremental: mtime fast-path, ~seconds on a clean tree
/sync-brain --full         # full reindex (~25-35 minutes on a big Mac)
/sync-brain --code-only    # only the code stage; skip memory + brain-sync
/sync-brain --dry-run      # preview what would sync; no writes
```

The skill runs three stages — code, memory, brain-sync — independently. A failure in one doesn't block the others. State persists to `~/.rig/.brain-sync-state.json` so re-running picks up cleanly.

**What it does on a fresh worktree:**

1. **Pre-flight.** Checks `brain_local_status` (the local engine's health). If the engine is `broken-db` or `broken-config`, the skill STOPs with a remediation menu — it refuses to silently degrade. If the local engine is missing and you're in remote-MCP mode (Path 4), the code stage SKIPs cleanly and only brain-sync runs.
2. **Code stage.** Registers the cwd as a federated source via `brain sources add`, writes a `.brain-source` pin file in the repo root (kubectl-style context — every worktree gets its own pin, so Conductor sibling worktrees don't collide), runs `brain sync --strategy code`.
3. **Memory stage.** Stages your `~/.rig/` transcripts + curated memory. In local-stdio MCP mode, ingests into the local engine. In remote-http MCP mode, persists staged markdown to `~/.rig/transcripts/run-<pid>-<ts>/` for the remote brain admin's pull pipeline. The ingest timeout is 30 minutes by default; raise it for a big brain with `RIG_INGEST_TIMEOUT_MS` (accepts 1 min–24h). On timeout the brain import checkpoint is preserved, so the next `/sync-brain` resumes instead of starting over.
4. **Brain-sync stage.** Pushes curated artifacts (plans, designs, retros) to your private artifacts repo if you have one configured.
5. **CLAUDE.md guidance.** Capability-checks the round-trip (write a page → search → find it). If green, writes the `## Brain Search Guidance` block to your project's CLAUDE.md. If red, REMOVES the block — the agent should never be told to use a tool that isn't installed.

**The watermark.** Sync state advances by commit hash. If brain hits a file it can't index (5 MB hard limit per file, or a file vanished mid-sync), the watermark stays put and subsequent syncs retry. To acknowledge an unfixable failure and move past it:

```bash
brain sync --source <source-id> --skip-failed
```

Re-runnable, idempotent, safe to run from multiple terminals on the same machine (locked at `~/.rig/.sync-brain.lock`).

## Switching engines later

Picked PGLite and now want to join a team brain? One command:

```bash
/setup-brain --switch
```

The skill runs `brain migrate --to supabase --url "$URL"` wrapped in `timeout 180s`. Migration is bidirectional (Supabase → PGLite also works) and lossless — pages, chunks, embeddings, links, tags, and timeline all copy. Your original brain is preserved as a backup.

**If migration hangs:** another rig session may be holding a lock on the source brain. The timeout fires at 3 minutes with an actionable message. Close other workspaces and re-run.

## Rig memory sync (a separate concern)

This is different from brain itself. Your rig state (`~/.rig/` — learnings, plans, retros, timeline, developer profile) is machine-local by default. "Rig memory sync" optionally pushes a curated, secret-scanned subset to a private git repo so your memory follows you across machines — and, if you're running brain, that git repo becomes indexable there too.

Turn it on with:

```bash
rig-brain-init
```

You'll get a one-time privacy prompt: **everything allowlisted** / **artifacts only** (plans, designs, retros, learnings — skip behavioral data like timelines) / **off**. Every skill run syncs the queue at start and end — no daemon, no background process.

Secret-shaped content (AWS keys, GitHub tokens, PEM blocks, JWTs, bearer tokens) is blocked from sync before it leaves your machine.

**On a new machine:** Copy `~/.rig-brain-remote.txt` over, run `rig-brain-restore`, and yesterday's learnings surface on today's laptop.

Full guide: [docs/brain-sync.md](docs/brain-sync.md). Error index: [docs/brain-sync-errors.md](docs/brain-sync-errors.md).

`/setup-brain` offers to wire this up for you at the end of initial setup — it's one more AskUserQuestion, and it integrates with the same private-repo infrastructure.

## Cleanup orphan projects

If you Ctrl-C'd mid-provision, tried three different names before settling on one, or otherwise accumulated brain-shaped Supabase projects you don't use, there's a subcommand for that:

```bash
/setup-brain --cleanup-orphans
```

The skill re-collects a PAT (one-time, discarded after), lists every project in your Supabase account whose name starts with `brain` and whose ref doesn't match your active `~/.brain/config.json` pooler URL. For each orphan it asks per-project: *"Delete orphan project `<ref>` (`<name>`, created `<date>`)?"* — no batching, no "delete all" shortcut. The active brain is never offered for deletion.

## Command + flag reference

### `/setup-brain` entry modes

| Invocation | What it does |
|---|---|
| `/setup-brain` | Full flow: detect state, pick path, install, init, MCP, policy, optional memory-sync |
| `/setup-brain --repo` | Flip the per-remote trust policy for the current repo only |
| `/setup-brain --switch` | Migrate engine (PGLite ↔ Supabase) without re-running the other steps |
| `/setup-brain --resume-provision <ref>` | Resume a path-2a auto-provision that was interrupted during polling |
| `/setup-brain --cleanup-orphans` | List + per-project delete of orphan Supabase projects |

### Bin helpers (for scripting)

| Bin | Purpose |
|---|---|
| `rig-brain-detect` | Emit current state as JSON: brain on PATH, version, config engine, doctor status, sync mode |
| `rig-brain-install` | Detect-first installer (probes `~/git/brain`, `~/brain`, then fresh clone). Has `--dry-run` and `--validate-only` flags. PATH-shadow check exits 3 with remediation menu. |
| `rig-brain-lib.sh` | Sourced, not executed. Provides `read_secret_to_env VARNAME "prompt" [--echo-redacted "<sed-expr>"]` |
| `rig-brain-supabase-verify` | Structural URL check. Rejects direct-connection URLs (`db.*.supabase.co:5432`) with exit 3 |
| `rig-brain-supabase-provision` | Management API wrapper. Subcommands: `list-orgs`, `create`, `wait`, `pooler-url`, `list-orphans`, `delete-project`. All require `SUPABASE_ACCESS_TOKEN` in env. `create` and `pooler-url` also require `DB_PASS`. `--json` mode available on every subcommand. |
| `rig-brain-repo-policy` | Per-remote trust triad. Subcommands: `get`, `set`, `list`, `normalize` |
| `rig-brain-source-wireup` | Registers your `~/.rig/` brain repo with brain as a federated source via `brain sources add` + `git worktree`, then runs an initial `brain sync`. Idempotent. Replaces the dead `consumers.json + /ingest-repo` HTTP wireup from v1.12.x. Flags: `--strict`, `--source-id <id>`, `--no-pull`, `--uninstall`, `--probe`. |

### brain CLI (upstream tool)

brain itself ships with these that rig wraps:

| Command | Purpose |
|---|---|
| `brain init --pglite` | Initialize a local PGLite brain |
| `brain init --non-interactive` | Initialize via env (`BRAIN_DATABASE_URL` or `DATABASE_URL`). Never pass a URL as argv — it'll leak to shell history. |
| `brain doctor --json` | Health check. Returns `{status: "ok"|"warnings"|"error", health_score: 0-100, checks: [...]}` |
| `brain migrate --to supabase --url ...` | Move a PGLite brain to Supabase (lossless, preserves source as backup) |
| `brain migrate --to pglite` | Reverse migration |
| `brain search "query"` | Search the brain |
| `brain put "<slug>" --content "<markdown-with-frontmatter>"` | Write a page (title/tags go in YAML frontmatter inside `--content`) |
| `brain get "<slug>"` | Fetch a page |
| `brain serve` | Start the MCP stdio server (used by `claude mcp add`) |

### Config files + state

| Path | What lives there |
|---|---|
| `~/.brain/config.json` | Engine (pglite/postgres), database URL or path, API keys. Mode 0600. Written by `brain init`. |
| `~/.rig/brain-repo-policy.json` | Per-remote trust triad. Schema v2. Mode 0600. |
| `~/.rig/.setup-brain.lock.d` | Concurrent-run lock (atomic mkdir). Released on normal exit + SIGINT. |
| `~/.rig/.brain-queue.jsonl` | Pending sync entries for rig memory sync |
| `~/.rig/.brain-last-push` | Timestamp of last sync push (for `/health` scoring) |
| `~/.rig-brain-remote.txt` | URL of your rig memory sync remote (safe to copy between machines) |
| `~/.rig/.setup-brain-inflight.json` | Reserved for future `--resume-provision` persisted state |

### Environment variables

| Var | Where it's read | What it does |
|---|---|---|
| `SUPABASE_ACCESS_TOKEN` | `rig-brain-supabase-provision` | PAT for Management API calls. Discarded after each setup run. |
| `DB_PASS` | `rig-brain-supabase-provision` (create, pooler-url) | Generated DB password. Never in argv. |
| `BRAIN_DATABASE_URL` | `brain init`, `brain doctor`, etc. | Postgres connection string (Supabase pooler URL for us). Env takes precedence over `~/.brain/config.json`. |
| `DATABASE_URL` | `brain init` (fallback) | Same semantics as `BRAIN_DATABASE_URL`; checked second. |
| `SUPABASE_API_BASE` | `rig-brain-supabase-provision` | Override the Management API host. Used by tests to point at a mock server. |
| `BRAIN_INSTALL_DIR` | `rig-brain-install` | Override default install path (`~/brain`) |
| `RIG_HOME` | every bin helper | Override `~/.rig` state dir. Heavy test use. |
| `VOYAGE_API_KEY` | `brain embed` subprocess; rig PGLite init | When set, rig inits PGLite with `voyage-code-3` (1024-dim), Voyage's code-specialized embedding model. Beats `voyage-4-large` and OpenAI `text-embedding-3-large` head-to-head on this codebase's symbol queries. See CHANGELOG v1.43.1.0 for the A/B numbers. |
| `OPENAI_API_KEY` | `brain embed` subprocess | Used for embeddings during `brain sync` / `/sync-brain` when `VOYAGE_API_KEY` is not set (brain's auto-selected fallback, `text-embedding-3-large` 1536-dim). Without either key, pages are imported structurally (symbol tables, chunks) but semantic search degrades — you'll see `[brain] embedding failed for code file ...` in the sync log. |
| `ANTHROPIC_API_KEY` | `claude-agent-sdk`, paid evals | Required for `bun run test:evals` and any direct `query()` call against Claude. |
| `RIG_OPENAI_API_KEY` | `lib/conductor-env-shim.ts` | Conductor-injected fallback. Promoted to `OPENAI_API_KEY` when the canonical name is empty. |
| `RIG_ANTHROPIC_API_KEY` | `lib/conductor-env-shim.ts` | Same pattern as above for Anthropic. |

## Conductor + RIG_* env vars

If you run rig inside a [Conductor](https://conductor.build) workspace, **Conductor explicitly strips `ANTHROPIC_API_KEY` and `OPENAI_API_KEY` from the workspace env.** Setting them in `~/.zshrc` or `.env` won't help — the strip happens after env inheritance. To get a usable API key into a workspace, set `RIG_ANTHROPIC_API_KEY` and `RIG_OPENAI_API_KEY` in Conductor's workspace env config instead. Conductor passes those through untouched.

`lib/conductor-env-shim.ts` bridges the gap on the rig side: when imported as a side effect (`import "../lib/conductor-env-shim";`), it promotes `RIG_FOO_API_KEY` to `FOO_API_KEY` for any subprocess that doesn't see the canonical name. The shim is already wired into:

- `bin/rig-brain-sync.ts` — so `/sync-brain` picks up OpenAI for embeddings
- `bin/rig-model-benchmark` — so `--judge` runs work without manual env mapping
- `scripts/preflight-agent-sdk.ts` — so paid-eval auth probes work
- `test/helpers/e2e-helpers.ts` — so `bun run test:evals` finds Anthropic

If you add a new TS entry point that hits a paid API or needs brain embeddings, add the same one-line import at the top. See [CONTRIBUTING.md "Conductor workspaces"](CONTRIBUTING.md#conductor-workspaces) for the contributor checklist.

`bin/rig-codex-probe` is bash and doesn't read these directly — it relies on `~/.codex/` auth managed by the Codex CLI.

## Security model

One rule for every secret this skill touches: **env var only, never argv, never logged, never written to disk by us.** The only persistent storage is brain's own `~/.brain/config.json` at mode 0600, which is brain's discipline, not ours.

**Enforced in code:**

- CI grep test in `test/skill-validation.test.ts` fails the build if `$SUPABASE_ACCESS_TOKEN` or `$BRAIN_DATABASE_URL` appears in an argv position
- CI grep test fails if `--insecure`, `-k`, or `NODE_TLS_REJECT_UNAUTHORIZED=0` appear in `bin/rig-brain-supabase-provision`
- `set +x` at the top of the provision helper prevents debug tracing from leaking PAT
- Telemetry payload contains only enumerated categorical values (scenario, install result, MCP opt-in, trust tier) — never free-form strings that could contain secrets

**Enforced via tests:**

- `test/secret-sink-harness.test.ts` runs every secret-handling bin with a seeded secret and asserts the seed never appears in any captured channel (stdout, stderr, files under `$HOME`, telemetry JSONL). Four match rules per seed: exact, URL-decoded, first-12-char prefix, base64.
- Positive controls in the same test file deliberately leak seeds in every covered channel and assert the harness catches each one. Without the positive controls, a harness that silently under-reports would look identical to a working harness.

**What you can still leak** (the honest limits of v1):

- If you paste a secret into a normal chat message outside `read -s`, it's in the conversation transcript and any host-side logging
- The leak harness doesn't dump subprocess environment — a bin that `env >> ~/.log` would evade detection (no bin in v1 does this; grep tests prevent it)
- Your shell's own `HISTFILE` behavior is your shell's, not ours — we never pass secrets to argv so they don't land there via our code, but nothing stops you from pasting one into a raw `curl` command yourself

## Troubleshooting

### "PATH SHADOWING DETECTED" during install

Another `brain` binary is earlier in PATH than the one the installer just linked. The installer's version check caught it. Fix one of:

- `rm $(which brain)` if you don't need the other one
- Prepend `~/.bun/bin` to PATH in your shell rc so the linked binary wins
- Set `BRAIN_INSTALL_DIR` to the shadowing binary's install directory and re-run

Then re-run `/setup-brain`.

### "rejected direct-connection URL"

You pasted a `db.<ref>.supabase.co:5432` URL. Those are IPv6-only and fail in most environments. Use the Session Pooler URL instead: Supabase dashboard → Settings → Database → Connection Pooler → **Session** → copy URI (port 6543).

### Auto-provision times out at 180s

The Supabase project is still initializing. Your ref was printed in the exit message. Wait a minute, then:

```bash
/setup-brain --resume-provision <ref>
```

The skill re-collects a PAT, skips project creation, resumes polling.

### "Another `/setup-brain` instance is running"

You have a stale lock directory. If you're sure no other instance is actually running:

```bash
rm -rf ~/.rig/.setup-brain.lock.d
```

Then re-run.

### "No cross-model tension" on policy file

You edited `~/.rig/brain-repo-policy.json` by hand with legacy `allow` values? No problem. On the next read, rig auto-migrates `allow` → `read-write` and adds `_schema_version: 2`. One log line on stderr, idempotent, deterministic.

### `brain doctor` says "warnings"

`/health` treats that as yellow, not red. Check `brain doctor --json | jq .checks` to see which sub-checks are warning. Typical causes: resolver MECE overlap (skill names clashing) or DB connection not yet configured.

### `/sync-brain` reports `OK` but `brain search` returns nothing semantic

Embeddings probably failed during import. Symbol queries (`code-def`, `code-refs`) still work because they don't need embeddings, but `brain search "<terms>"` falls back to a degraded BM25 path. Look in the sync output for lines like:

```
[brain] embedding failed for code file <name>: OpenAI embedding requires OPENAI_API_KEY
```

The fix is to put a provider API key in the process env before re-running. `VOYAGE_API_KEY` is preferred for code (rig defaults PGLite to `voyage-code-3` when set); otherwise `OPENAI_API_KEY` falls back to `text-embedding-3-large`. On a bare Mac shell, source the key from `~/.zshrc` before calling. In Conductor, the `lib/conductor-env-shim.ts` shim promotes `RIG_ANTHROPIC_API_KEY` / `RIG_OPENAI_API_KEY` to their canonical names automatically; for `VOYAGE_API_KEY`, set it directly in your Conductor workspace env. Re-run `/sync-brain --code-only` to backfill embeddings on already-imported pages.

### `brain sync` blocked at a commit hash — `FILE_TOO_LARGE`

A file in your tree exceeds brain's 5 MB hard limit (`MAX_FILE_SIZE` in `brain/src/core/import-file.ts`). Common culprits: response replay caches, captured screenshots, large JSON fixtures. brain doesn't honor `.gitignore`-style exclude lists for code sync; the only knob is acknowledging the failure:

```bash
brain sync --source <source-id> --skip-failed
```

Watermark advances past the offending commit. The same file fails again if it changes; re-skip when that happens.

### Switching PGLite → Supabase hangs

Another rig session in a sibling Conductor workspace may be holding a lock on your local PGLite file via its preamble's `rig-brain-sync` call. Close other workspaces, re-run `/setup-brain --switch`. The timeout is bounded at 180s so you'll never actually wait forever.

## Why this design

**Why per-remote trust triad and not binary allow/deny?** Multi-client consultants need search without write-back. A freelance dev working on Client A in the morning and Client B in the afternoon can't let A's code insights leak into a brain Client B can search. Read-only solves that cleanly.

**Why not bundle brain into rig?** brain is a separate, actively-developed project with its own release cadence, schema migrations, and MCP surface. Bundling would mean rig has to gate brain updates, which slows brain improvements from reaching users. Separate-but-integrated lets each ship on its own cadence.

**Why `brain init --non-interactive` via env var and not a flag?** Connection strings contain database passwords. Passing them as argv lands the password in `ps`, shell history, and process listings. Env-var handoff keeps the secret in process memory only. brain supports both `BRAIN_DATABASE_URL` and `DATABASE_URL`; we use the former to avoid collisions with non-brain tooling.

**Why fail-hard on PATH shadowing instead of warn-and-continue?** A shadowed `brain` means every subsequent command calls a different binary than the one we just installed. That's a silent version-drift bug that surfaces as mysterious feature gaps weeks later. Setup skills have one job — set up a working environment. Refusing to install into a broken one is the setup-skill-correct behavior.

**Why not auto-import every repo?** Privacy + noise. An auto-import preamble hook that ingests every repo you touch would: (a) leak work code into a shared brain without consent, and (b) clog search with throwaway repos. The per-remote policy makes ingestion an explicit, per-repo decision. `/setup-brain` doesn't install any auto-import hook today — but the policy store is forward-compatible for one later.

## Related skills + next steps

- `/health` — includes a Brain dimension (doctor status, sync queue depth, last-push age) in its 0-10 composite score. The dimension is omitted when brain isn't installed; running `/health` on a non-brain machine doesn't penalize that choice.
- `/rig-upgrade` — keeps rig itself up to date. Does NOT upgrade brain independently. brain installs at the latest HEAD by default; to refresh it, `git pull` in your brain clone (default `~/brain`) and re-run `/setup-brain`. Pin a specific commit with `rig-brain-install --pinned-commit <sha>` if you need reproducibility. Installs below the minimum tested version are refused.
- `/retro` — weekly retrospective pulls learnings and plans from your brain when memory sync is on, letting the retro reference cross-machine history.

Run `/setup-brain` and see what sticks.
