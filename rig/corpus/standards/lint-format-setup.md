# Setup Decision Rule — RIG-113 Implementation

Defines when Rig proposes a tool replacement/setup, how the proposal is delivered, and what it's allowed to write on approval. Consumes the ranked preference lists, EOL signals, and coverage gaps from `ecosystem-preferences.md`.

---

## When to Propose a Replacement

```
Condition 1 — EOL/unmaintained signal detected (see ecosystem-preferences.md "EOL/Unmaintained signals" per ecosystem):
  → Show proposal as "upgrade recommendation"
  → Applies when a tool IS present and configured, but trips an EOL signal (deprecated flag, archived repo, stale + unaddressed advisories)
  → Proposal names the specific signal that triggered it (not a generic "tool is old" message)

Condition 2 — Coverage gap detected (repo has files in-scope for the ecosystem, current tool selection doesn't reach them):
  → Show proposal as "to cover selected components"
  → Applies when SOME tool is already selected for the ecosystem but a specific coverage gap from the preference list applies (e.g., ESLint present but no @typescript-eslint for a repo with .ts files)
  → Proposal names the specific gap (e.g., "TypeScript files detected but type-aware linting is not configured")

Condition 3 — Tool absent entirely for a supported ecosystem:
  → Show proposal as "no tool found; recommend"
  → Applies when a repo has files in a supported ecosystem (per ecosystem-preferences.md) and no config file/tool from the ranked list is present at all
  → Proposal leads with the #1 ranked tool for that ecosystem, and names why (matches "Ranked preference list" ordering, not an arbitrary pick)

Non-condition — unsupported ecosystem:
  → No proposal at all (this is AT-LF-APPLICABILITY-3's "skipped without error" path, not a replacement proposal)
```

---

## How Proposal Is Delivered

```
Format: CLI output + approval request (not a passive warning-only message) — a proposal is an actionable prompt, distinct from a coverage-gap status line
Decision required: Explicit Y/N approval before any file is written or any tool is installed
No silent landing: a proposal is never auto-applied on a subsequent unrelated command (e.g., running `rig check` does not silently accept a pending replacement proposal from an earlier run)
Proposal must state:
  - Which condition triggered it (1, 2, or 3 above)
  - Which specific tool is recommended, sourced from the ranked preference list
  - What files will be written if approved (see below)
  - What happens to the existing config, if any (backup/replace/merge — must be explicit, not implied)
```

---

## Files Written on Approval

```
Config: exact filename(s) per ecosystem, as defined in ecosystem-preferences.md's "Setup contract" section for that ecosystem
  (e.g., approving a Ruff proposal writes/updates the [tool.ruff] section in pyproject.toml — not a new bespoke config file)

Ignore: exact filename(s) per ecosystem's Setup contract, only if that ecosystem's contract specifies a dedicated ignore file
  (e.g., .eslintignore for ESLint <9; no dedicated ignore file is written for ecosystems where exclusions live inside the main config, like Ruff/RuboCop/golangci-lint)

Recover old config: every overwrite records its original bytes in the existing journal preimage store before writing.
  - Typed lint_format_config records bind the exact proposal digest and ecosystem.
  - Undo/uninstall restores the original bytes rather than deleting a replaced config.
  - Shared pyproject.toml changes are limited to tool.ruff, tool.black, tool.isort and tool.mypy sections; unrelated bytes must match exactly.
  - Edited replacement configs are conflicts: leave them untouched and retain the recoverable preimage and journal for retry.
  - Interrupted restoration recognizes the original bytes already on disk and completes cleanup on retry.
  - No .rig-backup files are created. Setup and replacement need a separate SSH signature under rig-lint-format-setup; selection or plan approval does not grant that consent.
```

---

## Decision Table Summary

| Condition | Trigger | Proposal framing | Recoverable preimage |
|---|---|---|---|
| 1 — EOL signal | Existing tool trips an EOL signal | "upgrade recommendation" | Yes |
| 2 — Coverage gap | Existing tool selection leaves in-scope files uncovered | "to cover selected components" | Yes, for overwritten bytes |
| 3 — Tool absent | Supported ecosystem, no tool present at all | "no tool found; recommend" | N/A (no prior file) |
| — Unsupported ecosystem | No ranked entry exists for the detected language | No proposal (skip, no error) | N/A |

---

## Runtime entrypoint

The agent supplies its observed maintenance/coverage signals and exact proposed
bytes. Rig does not infer a repository migration or install tools automatically.
A missing external tool remains a named gap with setup guidance.

Run `rig lint-setup --input request.json` with a proposal request such as:

```json
{"action":"propose","target":"/path/to/repo","ecosystem":"js","existing_tool":"tslint","signals":["tslint.json is deprecated"],"writes":[{"path":"biome.json","content":"{}\n"}]}
```

The response names its recommendation, trigger, exact writes, original digests
and proposal digest. For `apply`, supply `target`, `proposal` and a separate
`approval` object with `identity` and an SSH signature. Sign the exact message
`rig-lint-format-setup\ndigest=<proposal digest>\n` with the SSH namespace
`rig-lint-format-setup`; Rig verifies it against `.rig/allowed-signers`.
Selection and plan signatures are rejected in this namespace. A null approval
means declined and writes nothing. The public library seam is
`proposeSetup` / `applySetup` in the installed runtime's `lint-format.js`.

Shared TOML has a conservative safety ceiling: multiline strings and quoted
table headers are refused rather than guessed. Only `tool.ruff`, `tool.black`,
`tool.isort` and `tool.mypy` tables may change; everything else must remain
byte-identical. A TOML parser is the upgrade path if a target requires unsupported
syntax. A changed replacement file is retained as a conflict, with its original
preimage available for a later uninstall retry. Repeated replacements retain the
original configuration from before Rig's first setup.
