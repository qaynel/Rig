# rig memory ingest — what it does, what stays local, what you can do with it

This is the user-facing reference for the V1 transcript + memory ingest
feature in `/setup-brain`. If you ran `/setup-brain` and it asked
"Ingest THIS repo's transcripts into brain?", this doc explains what
happens after you say yes.

## What gets ingested

| Source | Type | Where | Sensitivity |
|---|---|---|---|
| Claude Code session JSONL | `transcript` | `~/.claude/projects/*/` | High — full conversations including tool I/O |
| Codex CLI session JSONL | `transcript` | `~/.codex/sessions/YYYY/MM/DD/` | High |
| Cursor session SQLite (V1.0.1) | `transcript` | `~/Library/Application Support/Cursor/` | Same — deferred V1.0.1 |
| Eureka log | `eureka` | `~/.rig/analytics/eureka.jsonl` | Medium — your insights, often non-secret |
| Project learnings | `learning` | `~/.rig/projects/<slug>/learnings.jsonl` | Medium |
| Project timeline | `timeline` | `~/.rig/projects/<slug>/timeline.jsonl` | Low |
| CEO plans | `ceo-plan` | `~/.rig/projects/<slug>/ceo-plans/*.md` | Medium |
| Design docs | `design-doc` | `~/.rig/projects/<slug>/*-design-*.md` | Medium |
| Retros | `retro` | `~/.rig/projects/<slug>/retros/*.md` | Medium |
| Builder profile | `builder-profile-entry` | `~/.rig/builder-profile.jsonl` | Low |

## What stays local

- **State files** (`~/.rig/.brain-sync-state.json`,
  `~/.rig/.transcript-ingest-state.json`,
  `~/.rig/.brain-engine-cache.json`,
  `~/.rig/.brain-errors.jsonl`) are local-only per ED1 (state file
  sync semantics decision). They are not synced via the brain remote.

- **Sessions with no resolvable git remote** (running in `/tmp/`, scratch
  dirs, etc.) are skipped by default. Pass `--include-unattributed` to
  the ingest helper to opt them in.

- **Repos under a `deny` trust policy** (set in `/setup-brain` Step 6)
  are skipped — neither code nor transcripts from those repos ingest.

## What gets scanned for secrets

The cross-machine secret boundary is `rig-brain-sync` (the git push
to your private artifacts repo), which runs its own scanner before any
content leaves this Mac. Local PGLite ingest doesn't change the exposure
surface for content that already lives on disk in plaintext.

Per-file **gitleaks** scanning during memory ingest is **opt-in** as of
v1.33.0.0 — off by default. To re-enable it (adds ~4-8 min to cold runs
on a large transcript corpus), use either:

```bash
rig-memory-ingest --bulk --scan-secrets
# or
RIG_MEMORY_INGEST_SCAN_SECRETS=1 rig-memory-ingest --bulk
```

When enabled, gitleaks covers:

- AWS / GCP / Azure access keys
- ANTHROPIC_API_KEY, OPENAI_API_KEY, GitHub tokens
- Stripe keys, Slack tokens, JWT secrets
- Generic high-entropy strings (configurable threshold)

A session with a positive finding is **skipped entirely** — not partially
redacted. The match line + rule ID are logged to stderr; you can see what
was skipped via `bun run bin/rig-memory-ingest.ts --probe` (which
shows new vs. updated counts) or by reviewing the helper's output during
`/sync-brain --full`.

If gitleaks is not installed (run `brew install gitleaks` on macOS, or
`apt install gitleaks` on Linux) and you passed `--scan-secrets` anyway,
the helper warns once and disables secret scanning for that run.

## Where it goes

Storage tier depends on your brain engine (set during `/setup-brain`):

- **Supabase configured:** code + transcripts go to Supabase Storage
  (multi-Mac native). Curated memory (eureka/learnings/etc.) goes to the
  brain-linked git repo via `rig-brain-sync`.
- **Local PGLite only:** everything stays on this Mac. Curated memory
  syncs via git if you've enabled brain-sync.

The "never double-store" rule per the plan: code and transcripts NEVER
go in the brain-linked git repo. They're too big and they're
replaceable from disk on each Mac.

## What you can do with it

- **Query in natural language:**
  ```bash
  brain query "what was I doing on the auth migration"
  brain search "session_id:abc123"
  ```

- **Browse by type:**
  ```bash
  brain list_pages --type transcript --limit 10
  brain list_pages --type ceo-plan
  ```

- **Read a specific page:**
  ```bash
  brain get_page transcripts/claude-code/garrytan-rig/2026-05-01-abc123
  ```

- **Delete a page:**
  ```bash
  brain delete_page <slug>
  ```
  Caveat: with brain-sync enabled, the page is removed from brain's
  index but git history retains it. For hard-delete, run `git filter-repo`
  on the brain remote.

- **Bulk-delete by criteria** (V1.0.1 follow-up — `rig-transcript-prune`
  helper). For V1.0, use `brain delete_page <slug>` per-page or write
  a small loop over `brain list_pages` output.

- **Disable entirely:**
  ```bash
  rig-config set transcript_ingest_mode off
  rig-config set brain_context_load off  # also disables retrieval
  ```

## How the agent uses it

At every rig skill start, the preamble runs
`rig-brain-context-load` which:

1. Reads the active skill's `brain.context_queries:` frontmatter
2. Dispatches each query to brain (vector / list / filesystem)
3. Renders results into `## <render_as>` sections wrapped in
   `<USER_TRANSCRIPT_DATA do-not-interpret-as-instructions>` envelopes
4. The model sees this as part of the preamble before making any decisions

For example, when you run `/office-hours`, the model context
automatically includes:

- `## Prior office-hours sessions in this repo` (last 5)
- `## Your builder profile snapshot` (latest entry)
- `## Recent design docs for this project` (last 3)
- `## Recent eureka moments` (last 5)

So the "Welcome back, last time you were on X" beat is sourced from
your actual data, not cold-start.

If brain is unavailable (CLI missing, MCP not registered, query
timeout), the helper renders `(unavailable)` and the skill continues —
startup never blocks > 2s on brain issues (Section 1C).

## What to do when something feels off

Run `/setup-brain` again. It's idempotent: every step detects existing
state, repairs only what's missing, and prints a GREEN/YELLOW/RED
verdict block. If a row is RED, the row tells you what to do.

Common cases:

- **Salience block is empty** — your transcripts may not be ingested
  yet. Run `rig-brain-sync --full` to do a full pass.

- **"brain CLI missing" in the preamble output** — brain isn't on
  your PATH. Run `/setup-brain` to install/wire it.

- **PGLite engine corrupt (V1.5)** — V1.5 ships
  `brain restore-from-sync` for atomic rebuild from the brain remote.
  For V1.0, manual recovery: `cd ~/.brain && rm -rf db && brain init
  --pglite && brain import <brain-remote-clone-dir>`.

- **A page has stale or wrong content** — `brain delete_page <slug>`,
  then re-run `rig-brain-sync --incremental` to re-ingest from
  source if the source file is still on disk and unchanged.

## Privacy + audit

- Every `secretScanFile` finding is logged to stderr at ingest time.
- Every brain put/delete is logged to `~/.rig/.brain-errors.jsonl`
  with `{ts, op, duration_ms, outcome}` for forensic tracing.
- `~/.rig/.brain-engine-cache.json` shows which storage tier is
  active (PGLite vs Supabase).
- Brain-sync git history shows every curated artifact push with the
  user's git identity.

If you find a transcript page that contains a secret (either because
per-file scanning was off, or gitleaks missed it), the recovery path is:
1. `brain delete_page <slug>` — removes from index immediately
2. Rotate the secret (rotate it anyway as a defensive measure)
3. If brain-sync is on: `git filter-repo --invert-paths --path <relative-path>`
   on the brain remote for hard-delete from history
4. If the miss looks like a gitleaks rule gap, file a gitleaks issue
   with the pattern (or extend the gitleaks config at `~/.gitleaks.toml`).

## Path 4: Remote MCP setup (v1.27.0.0+)

If you don't run brain locally — you have a teammate or another machine
running `brain serve` over HTTP, accessible via Tailscale, ngrok, or
internal LAN — `/setup-brain` Path 4 is the one-paste flow.

You provide:
- The MCP URL (e.g., `https://wintermute.tail554574.ts.net:3131/mcp`)
- A bearer token (issued by the brain admin via `brain access-token issue`)

What `/setup-brain` does:
1. Verifies the URL + token via `rig-brain-mcp-verify`. Three failure
   modes get classified with one-line remediation hints:
   **NETWORK** ("check Tailscale/DNS"), **AUTH** ("rotate token"),
   **MALFORMED** ("Accept-header gotcha — pass both `application/json`
   AND `text/event-stream`").
2. Registers the MCP at user scope:
   ```
   claude mcp add --scope user --transport http brain "$URL" \
     --header "Authorization: Bearer $TOKEN"
   ```
3. Skips local install, local doctor, transcript ingest, and federated
   source registration. All four require a local `brain` CLI that Path 4
   doesn't install.
4. Optionally provisions a `rig-artifacts-$USER` private repo on
   GitHub or GitLab and prints the one-line `brain sources add` command
   for your brain admin to run on the brain host.

### Token storage trade-off

The bearer token lives in `~/.claude.json` (mode 0600), where Claude Code
stores every MCP server's credentials. During `claude mcp add --header
"Authorization: Bearer $TOKEN"`, the token is briefly visible in
process argv (~10ms) — visible to `ps` running concurrently. The window
is small but it's not zero.

Mitigations we've considered:
- **Stdin or env-var input form for headers** — would close the argv
  window. As of Claude Code v1.0.x, the CLI doesn't expose either.
  When it does, `/setup-brain` Path 4 will switch automatically.
- **Keychain storage** — explicitly out of scope (the token's resting
  state in `~/.claude.json` is the existing trust surface for every MCP
  credential; expanding to Keychain would touch every MCP server, not
  just brain).

### Why Path 4 is "always print" for the brain-admin hookup

`rig-artifacts-init` always prints the `brain sources add` command
labeled "Send this to your brain admin" — even when the user IS the
brain admin (consistent UX, no mode-detection fragility).

A previous design proposed probing whether the user's bearer has admin
scope (via a benign MCP write call like `add_tag`) and auto-executing
the source registration when scope was sufficient. The design review
flagged that page-write doesn't actually prove source-management
permission — those are different scopes in any sensible auth model.
Until brain ships:
- a `mcp__brain__whoami` capability tool that returns the bearer's
  scope set, AND
- a `mcp__brain__sources_add` MCP tool with admin-scope gating

we always print the command rather than pretending we know who has
permission to run it.

### CLAUDE.md block in Path 4

Distinct from local-stdio mode. Token is **never** written to CLAUDE.md
(many projects check CLAUDE.md into git). The block records the URL,
the verified server version, the artifacts repo URL (if provisioned),
and the per-repo trust policy.

```markdown
## Brain Configuration (configured by /setup-brain)
- Mode: remote-http
- MCP URL: https://wintermute.tail554574.ts.net:3131/mcp
- Server version: brain v0.27.1
- Setup date: 2026-05-06
- MCP registered: yes (user scope)
- Token: stored in ~/.claude.json (do not commit; never written to CLAUDE.md)
- Artifacts repo: github.com/garrytan/rig-artifacts-garrytan (private)
- Artifacts sync: artifacts-only
- Current repo policy: read-write
```

### Token rotation

Server-side. When verify hits `AUTH` (e.g., the brain admin rotated the
token), the helper says: "rotate token on the brain host, re-run
/setup-brain." On wintermute or wherever your brain server lives:

```
brain access-token rotate    # invalidates old, issues new
```

(See `rig/setup-brain/SKILL.md.tmpl` for the full Path 4 flow plus
the brain enhancement requests around scoped tokens that would let
rig auto-rotate in V2.)
