# 2026-08-24 — Ticket burndown pass

Task: resolve the RIG-101..122 backlog on `wiki/Tickets.md`. Per PM: attempt each
myself, write a `solution.md` per ticket linked from the board, update statuses,
defer only genuine PM-decision tickets to Blocked.

## Verified facts (2026-08-24)
- `check-versions.js` ALREADY lists `rig-mcp/package.json` (RIG-102 acceptance #3 already met).
- `test:code` does NOT run `npm test --prefix rig-mcp` (RIG-102 core still open).
- Stale `vaibhav-kodiyan/agentic-harness-demo` URL appears in: `.codex-plugin/plugin.json` (x3),
  `.devin-plugin/plugin.json` (x2), `.github/plugin/plugin.json` (x2), `antigravity-plugin/plugin.json` (x2),
  `.agents/plugins/marketplace.json`, `.openclaw/skills/*`, `skills/rig-help/SKILL.md`,
  `wiki/specs/product-spec.md`. `.claude-plugin/plugin.json` has no homepage/repo (author url only). (RIG-117)
- Real remote per ticket: `github.com/qaynel/Rig-v0.1`.

## Triage
- Implement+verify: RIG-102, RIG-117, RIG-118, RIG-121 (and RIG-106 if hook format allows).
- Solution doc (implementation-ready design): RIG-101,103,104,105,107,108,109,110,111,112,113,114,115,116.
- Defer to PM (Blocked): RIG-119 (spec-driven adoption), RIG-120 (owner signing/release ceremony — needs keys),
  RIG-122 (wiki-as-graft decision).

Solutions live in `wiki/tickets/RIG-XXX.md`, linked from each board card.
