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

Backup old config: yes, when Condition 1 (upgrade/replacement of an existing tool) applies and the replacement would overwrite an existing config file
  - How: existing file copied to the same path with a suffix (e.g., .rubocop.yml -> .rubocop.yml.rig-backup) before the new file is written, not merged in place
  - Not required for Condition 2 (extending existing coverage — this modifies/adds to a config, doesn't replace it) or Condition 3 (no prior file exists to back up)
```

---

## Decision Table Summary

| Condition | Trigger | Proposal framing | Backup required |
|---|---|---|---|
| 1 — EOL signal | Existing tool trips an EOL signal | "upgrade recommendation" | Yes |
| 2 — Coverage gap | Existing tool selection leaves in-scope files uncovered | "to cover selected components" | No |
| 3 — Tool absent | Supported ecosystem, no tool present at all | "no tool found; recommend" | N/A (no prior file) |
| — Unsupported ecosystem | No ranked entry exists for the detected language | No proposal (skip, no error) | N/A |

---

## Open Item Requiring Your Confirmation

The backup mechanism above (`<file>.rig-backup` suffix, written before overwrite) is **[ASSUMED]** — I don't have visibility into whether Rig already has a standard backup/versioning convention elsewhere in its file-write contract (e.g., via git floor, via a `.rig/backups/` directory, or via requiring a clean git tree before any write). If Rig already enforces "no write without clean git status" as a precondition, that may make a separate backup file redundant — worth reconciling with whatever convention `.rig/bin/check.js` or the git floor capability already uses, since the RIG-113/115 scope should stay consistent with the rest of the setup-contract behavior rather than introduce a second backup mechanism.
