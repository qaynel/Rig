---
date: 2026-09-08
source: agent
topics: onboarding-flow, what-rig-is, the-catalogue, delivery-plan
decisions:
status: current
supersedes:
tags: feasibility, test, evidence
summary: "Feasibility test round 2: agent writes a deterministic conversion script, then the script does the mechanical projection. Tests dynamic-intelligence + deterministic-execution split."
---

# Dynamic Projection — Script-Based Determinism Test

## The split being tested

The intent owner's refinement (2026-09-08): use the agent's intelligence
**once** to write a conversion script, then run that script deterministically
to do the actual onboarding. This means:

- **Dynamic:** The agent decides HOW to convert (reads corpus + host
  conventions, writes a script)
- **Deterministic:** The script mechanically converts ALL files (no tokens
  burned per file, repeatable, CI-testable)

## Test setup

- **Model:** Claude Sonnet (delegated subagent)
- **Input:** Same canonical corpus as Test 1 (skills, routing, rules)
- **Instructions:** "Write a general script that reads whatever skills exist
  in the corpus directory. Don't hardcode skill names."

## Results

### Test A — Cursor (known host)

**Script:** `project-to-cursor.py` — 137 lines, 4,830 bytes

| What the script does | How |
|---------------------|-----|
| Discovers all skills | `os.listdir()` on skills directory |
| Extracts YAML frontmatter | Parses `---` delimiters, reads `description` |
| Writes `.mdc` envelope | `description`, `globs: `, `alwaysApply: false` |
| Preserves body | Verbatim after frontmatter strip |
| Handles routing + rules | Inlines into `rig-routing.mdc` with `alwaysApply: true` |
| Handles multi-file skills | Auto-includes extra `.md` files (e.g. onboarding/playbook.md) |

**Output:** 8 `.mdc` files in `.cursor/rules/`

**Determinism:** Re-run produces byte-identical checksums ✅

### Test B — Zed (unknown host)

**Script:** `project-to-zed.py` — 152 lines, 5,282 bytes

| What the script does | How |
|---------------------|-----|
| Discovers all skills | Same `os.listdir()` pattern |
| Strips YAML frontmatter | Removes entirely (Zed prompts are plain markdown) |
| Preserves description | As HTML comment at top of file |
| Writes settings.json | Minimal Zed agent config |
| Handles routing + rules | Inlined into `rig-routing.md` prompt |

**Output:** 8 prompt files + `settings.json` in `.zed/`

**Determinism:** Re-run produces byte-identical checksums ✅

## The economics

| Cost | Per-file agent conversion | Script-based |
|------|--------------------------|-------------|
| Intelligence (tokens) | ~500 tokens × N files | ~5K tokens once (script) |
| For 7 skills + routing | ~4,000 tokens | ~5,000 tokens |
| For 20 skills + routing | ~10,500 tokens | ~5,000 tokens |
| For 50 skills + routing | ~25,500 tokens | ~5,000 tokens |
| Re-projection after corpus change | Same full cost again | 0 tokens (re-run script) |
| CI verification | Not possible | `python3 project-to-<host>.py && diff` |

The script approach has **constant token cost** regardless of corpus size,
and **zero cost** for re-projections.

## Generality check

Both scripts use directory enumeration, not hardcoded skill names. Tested:
if you add a new `rig/tier-1/skills/new-skill/SKILL.md`, both scripts
pick it up on next run with no modification.

## The onboarding flow with this architecture

```
User runs: rig onboard --host cursor
                    │
                    ▼
    ┌─────────────────────────────┐
    │  Does a projector script    │
    │  exist for this host?       │
    ├──────────┬──────────────────┤
    │ YES      │ NO               │
    │          │                  │
    │          ▼                  │
    │  Agent reads corpus +       │
    │  host conventions, writes   │
    │  project-to-<host>.py       │
    │  (one-time intelligence)    │
    │          │                  │
    │          ▼                  │
    │  Agent offers script for    │
    │  user approval              │
    │          │                  │
    ▼          ▼                  │
    Run script deterministically  │
    │                             │
    ▼                             │
    propose/approve/apply/check   │
    └─────────────────────────────┘
```

For known hosts, the script already exists (shipped with Rig or cached from
a previous onboarding). For unknown hosts, the agent writes it once, then
it becomes a known host.

## Evidence files

- `wiki/reasoning/evidence/dynamic-projection-script-test/project-to-cursor.py`
- `wiki/reasoning/evidence/dynamic-projection-script-test/project-to-zed.py`

## Verdict

**The split works.** Dynamic intelligence to decide the format (write a script),
deterministic execution to do the conversion (run the script). Token cost is
constant, output is reproducible, scripts are general, and unknown hosts
become known hosts after their first onboarding.
