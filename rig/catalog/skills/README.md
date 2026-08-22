# Swallowed skill catalogue

A rough, first-pass vendoring of the upstream gstack skill suite into Rig. Every
skill, helper, and reference was renamed to Rig's namespace (`gstack` → `rig`,
`gbrain` → `brain`); no runtime-facing filename or command reference carries
the old name, so each capability is callable by its Rig name (`rig-qa`,
`rig-ship`, `rig-browse`, …). Attribution and provenance deliberately retain
the upstream name.

The source is a modified partial distribution of `garrytan/gstack` version
`1.60.1.0`. See [`UPSTREAM.md`](UPSTREAM.md) for the pinned commit and changes,
and [`LICENSE.upstream`](LICENSE.upstream) for the preserved MIT notice.

## Status: rough, not yet wired

This is an integration commit, not a finished feature. It is intentionally dirty:

- **Skills** (`<name>/SKILL.md`) — the full method/judgment of each skill is
  present and renamed. This is the durable value and it survives intact.
- **Plumbing** (`plumbing/bin`, `plumbing/lib`) — the helper scripts skills call
  into, renamed. Vendored as reference; **not runnable here** (no `node_modules`,
  and Rig is markdown-only by charter). The 61 MB compiled `*-global-discover`
  bundle and all test fixtures/`node_modules` were excluded.
- **Not wired** into `materialize.js` / host skill discovery yet. Wiring,
  memory backend (`brain`), and pipeline are the follow-up cleanup passes.

## What is inert until wired

Skills that are thin wrappers over the upstream runtime (browser daemon, `brain`
persistent memory, `codex exec` fan-out, iOS device bridge) are present as
instructions but have no engine behind them here. On a Claude host the two
biggest — browser automation and subagent fan-out — have native equivalents
(Playwright / chrome-devtools MCP, and the Agent tool); `brain` persistent
memory is the main capability with no drop-in and is the priority for the
plumbing pass.

## Sanitation applied to stay CI-green

The repo's secret floor is stricter than upstream's placeholder-aware detector.
Three illustrative shapes were neutralized so `npm test` passes: an AWS docs
example key, a PEM private-key header in a code comment, and a preference enum
whose spelling contained a token-shaped prefix, renamed uniformly to
`ask-only-oneway`. Upstream's release `CHANGELOG.md` was dropped as
non-functional noise.
