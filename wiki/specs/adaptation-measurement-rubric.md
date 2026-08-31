# Adaptation Measurement Rubric — RIG-153

**Version**: 0.1 (2026-08-31)  
**Rig anchor SHA**: `38493a9bf3087cfd4959b37579d24d721bf40fd3` (branch `qa-prod-v5`)  
**Target anchor**: eyaltoledano/claude-task-master (`inspo/claude-task-master-main/`)  
**Spec trace**: `wiki/reasoning/2026-08-31-rig-153-instrument-spec.md`

---

## Scope and constraints

This rubric scores the quality of a **default Rig install** into a target
repository. Default means `bootstrap.sh` with no flags (or with `--hosts
<name>` only). A `--with-runtime` install requires a separately labelled
rubric pass; it is out of scope here and must not be conflated with this score.

The mechanical lint (Gate G2) runs in `npm test` and requires no model call.
The graded axes (A1–A3) are assessed by a model judge using the written
procedure in §Clean-Checkout Procedure. No API-key-wired script exists for
the model-judged pass; the judge is human-operated.

---

## Part 1 — Hard Gates

Both gates must be **MET** for the run to proceed to graded axes. A gate
violation produces a `GATE-FAILED` result; the per-axis profile is still
recorded for diagnostics, but the result is not a valid baseline.

### G1 — Config Preserved

**Verdict**: `MET` / `UNMET`  
**Justification required**: yes — list every pre-existing agent-config file
and state whether it was untouched, merged-with-preimage, or (if UNMET)
overwritten or deleted.

**MET**: every byte of pre-existing agent guidance survives or is non-
destructively merged. Zero overwrites. Zero deletions of pre-existing content.
An `append_managed` op with a stored preimage qualifies as merged-with-preimage.

**UNMET**: any pre-existing `CLAUDE.md`, `.cursor/rules/*.mdc`,
`.kiro/steering/*.md`, `.claude/commands/**`, `.taskmaster/CLAUDE.md`,
`.github/workflows/claude*.yml`, or structurally equivalent agent-config file
is overwritten or has content deleted.

---

### G2 — Zero New Breakages / Dangling Refs

**Verdict**: `MET` / `UNMET`  
**Justification required**: yes — if UNMET, list each failing check by name.

**MET**: the mechanical breakage lint passes green:

```sh
node --test tests/installed-router-hygiene.test.js
```

Any failing test = UNMET. The lint covers the full RIG-148→152 defect inventory:

| Test | Defect shape |
|------|--------------|
| RIG-124.2 | Bare `(RIG-NNN)` citations in installed instruction text |
| RIG-151 | `wiki/status.md` 3-minute cadence referencing a non-existent target wiki |
| RIG-152 | Never-true "In this source checkout" conditional |
| RIG-150 | Hardcoded `.rig/skills/implementation/SKILL.md` path (dead for Claude/Codex installs) |
| RIG-149 | `rig`→`rig-rig` name collision for native-dispatch hosts |
| RIG-148 | Missing `ensure_gitignore_block` for Rig-owned install paths |

---

## Part 2 — Graded Axes

Three axes, **equal weight**. Assess after both gates pass.

Score each: `fail` / `partial` / `pass`. Provide a one-sentence justification
per axis citing specific evidence. The per-axis profile is the output; do not
collapse to a scalar.

> **Aggregate caveat**: any single-number aggregate derived from A1–A3 must
> be labelled: ⚠ LOW CONFIDENCE — pending human-vs-judge calibration audit
> (out of scope for this instrument version). Do not report an aggregate as a
> confident score.

---

### A1 — Signal-vs-Noise

**Definition**: fraction of installed skills relevant to the target repo's
actual stack, by skill count and by installed bytes.

| Score | Condition |
|-------|-----------|
| `fail` | ≥ 70% of installed skills are irrelevant to the target stack; or installed size exceeds 5× the minimal relevant-skills-only footprint |
| `partial` | 40–69% irrelevant; or size 2–5× minimal footprint |
| `pass` | < 40% irrelevant; size within 2× minimal footprint |

**Evidence to record**: total installed skill count, relevant skill count
(named explicitly — skills directly applicable to the target's stack), total
installed bytes, bytes attributable to irrelevant skills.

---

### A2 — Net Capability Added

**Definition**: novel capabilities the target repo's agent workflows gain
from the install — capabilities not already present in the repo's existing
agent config files.

| Score | Condition |
|-------|-----------|
| `fail` | Zero genuinely new primitives; all installed content duplicates existing config or is irrelevant |
| `partial` | One new primitive (e.g., the signed freeze-the-oracle gate); remaining content is noise or redundant |
| `pass` | Two or more new primitives; or one new primitive with demonstrated integration with the target's existing config (e.g., routing.md references existing Cursor/Kiro rules by path) |

**Evidence to record**: list each claimed new primitive; note which existing
config it may duplicate; note whether `routing.md` references existing
target-repo agent config by path.

---

### A3 — Reversibility

**Definition**: the uninstall round-trip leaves the target repo in its
pre-install state, verified by diffing a pre-install snapshot against the
post-uninstall tree.

| Score | Condition |
|-------|-----------|
| `fail` | Post-uninstall tree differs from pre-install snapshot (content added, deleted, or modified beyond the managed append) |
| `partial` | Tree matches except for `.gitignore` additions (cosmetic); or CLAUDE.md preimage recovery works but leaves a trailing whitespace artifact |
| `pass` | Tree is byte-identical to pre-install snapshot after uninstall |

**Evidence to record**: diff of pre-install snapshot vs. post-uninstall tree,
or explicit "no diff" statement with command used.

---

## Part 3 — Run Metadata

Record all fields for every run:

| Field | Example / Note |
|-------|----------------|
| Run date | `2026-08-31` |
| Run number | `1 of 3` (≥3 runs required) |
| Pinned model | `claude-sonnet-5-20251022` — record exact snapshot string, never a floating alias |
| Model snapshot source | Retrieved from `claude --version` or API response `anthropic-model-id` header; recorded verbatim |
| Rig branch | `qa-prod-v5` |
| Rig branch SHA | `38493a9bf3087cfd4959b37579d24d721bf40fd3` (full SHA from `git rev-parse HEAD`) |
| Bootstrap invocation | Exact command string, logged to `bootstrap.log` |
| Target repo | `eyaltoledano/claude-task-master` |
| Target repo commit SHA | From `git -C <target-dir> rev-parse HEAD` |
| Install type | `default` (no `--with-runtime`) |

**≥ 3 runs required.** Report mean and observed spread (min/max or full range)
per axis across the run set. Do not report self-reported model confidence as a
substitute for observed spread across runs.

**Model EOL re-pin procedure**: when Anthropic announces EOL for the pinned
snapshot, re-pin to the next available dated snapshot, run ≥3 times against
the same target commit SHA, record the new per-axis baseline, and file a
dated reasoning trace noting the re-pin and any observed axis-profile shift.
Do not rely on temperature for determinism — temperature is not a reliable
reproducibility mechanism across model versions.

---

## Part 4 — Profile Output Format

Each run produces a profile in this exact format:

```
Run: YYYY-MM-DD, run N of M
Model: <exact snapshot string>
Rig SHA: <full SHA>
Rig branch: <branch name>
Target: eyaltoledano/claude-task-master @ <target-sha>
Bootstrap: sh rig/bootstrap.sh --hosts claude --target <path>

G1 Config Preserved: MET / UNMET
  Justification: <one sentence; list files if UNMET>

G2 Zero Breakages: MET / UNMET
  Lint result: <green / list of failing tests>
  Justification: <one sentence>

Result: GATE-FAILED / proceeding to graded axes

A1 Signal-vs-Noise: pass / partial / fail
  Evidence: <total skills N, relevant M (named), total bytes B, irrelevant bytes I>
  Justification: <one sentence>

A2 Net Capability Added: pass / partial / fail
  Evidence: <new primitives listed; redundancies noted>
  Justification: <one sentence>

A3 Reversibility: pass / partial / fail
  Evidence: <diff summary or "no diff — byte-identical">
  Justification: <one sentence>

⚠ Aggregate (LOW CONFIDENCE, pending calibration audit): <optional; omit if not needed>
```

---

## Part 5 — Clean-Checkout Procedure

### Prerequisites

- Rig source repo at the anchor SHA: `git checkout qa-prod-v5` and confirm
  `git rev-parse HEAD` = `38493a9bf3...`
- `npm test` green against the Rig source before running any evaluation run
- A read-only workspace copy of the target: `inspo/claude-task-master-main/`
  (this is the oracle copy; do not modify it)

### Steps (one run — repeat ≥3 times, fresh copy each time)

**1. Create a fresh copy of the target:**
```sh
RUN_ID=$(date +%s)
EVAL_DIR="/tmp/ctm-eval-${RUN_ID}"
cp -r inspo/claude-task-master-main/ "$EVAL_DIR"
```

**2. Record the target commit SHA:**
```sh
git -C "$EVAL_DIR" rev-parse HEAD | tee "$EVAL_DIR/evidence-target-sha.txt"
```

**3. Record the Rig SHA** (from Rig source repo root):
```sh
git rev-parse HEAD | tee "$EVAL_DIR/evidence-rig-sha.txt"
```

**4. Run the mechanical lint** against the Rig source and confirm green:
```sh
node --test tests/installed-router-hygiene.test.js
```
If not green: the run is `GATE-FAILED` at G2 before the install even runs.
Do not proceed to the model-judged pass; fix the failing lint and re-run.

**5. Run the default install** (NOT `--with-runtime`) and capture the log:
```sh
sh rig/bootstrap.sh --hosts claude --target "$EVAL_DIR" \
  2>&1 | tee "$EVAL_DIR/bootstrap.log"
```

**6. Capture raw install evidence:**
```sh
git -C "$EVAL_DIR" status --short > "$EVAL_DIR/evidence-git-status.txt"
git -C "$EVAL_DIR" diff            > "$EVAL_DIR/evidence-git-diff.txt"
```

**7. Record the pinned model snapshot string:**
Retrieve from `claude --version` or the API response's `anthropic-model-id`
header. Record the exact string verbatim — e.g., `claude-sonnet-5-20251022`.
Never use a floating alias.

**8. Invoke the model judge (human-operated):**
Open the §Prompt Template below. Feed the judge:
- The full prompt template with `<target-sha>` and `<rig-sha>` filled in
- The contents of `evidence-git-status.txt`
- The contents of `evidence-git-diff.txt`
- The contents of `bootstrap.log`

The judge is invoked manually in a model interface (not via an API-key-wired
script). Record the per-axis profile output verbatim.

**9. Score Gate G1** from the install evidence (human review):
Inspect `evidence-git-diff.txt` for any pre-existing file content that was
overwritten or deleted. Record MET/UNMET with justification.

**10. Aggregate ≥3 runs:**
After ≥3 separate runs (steps 1–9 each time, fresh `$EVAL_DIR`), report
mean and observed spread (min/max) per axis. Note any run-to-run variance
in the profile.

### Prompt Template

```
You are scoring a Rig install evaluation against the adaptation measurement
rubric at wiki/specs/adaptation-measurement-rubric.md.

Install type: default (no --with-runtime)
Target repo: eyaltoledano/claude-task-master @ <target-sha>
Rig source SHA: <rig-sha>
Pinned model: <snapshot-string>

--- evidence-git-status.txt ---
<paste contents>

--- evidence-git-diff.txt ---
<paste contents>

--- bootstrap.log ---
<paste contents>

Score each item in the rubric:
- For each gate (G1, G2): state MET or UNMET with a one-sentence justification.
- For each graded axis (A1, A2, A3): state fail, partial, or pass with a
  one-sentence justification citing specific evidence from the install diff.

Output the profile in the format specified in §Profile Output Format.
Do not produce a single aggregate score. The per-axis profile is the output.
```

---

## Part 6 — Making Option B Turnkey

Option B (re-baseline against the post-fix Rig build) is blocked until
`inspo/claude-task-master-main/` is available in the workspace at the
post-fix commit state (i.e., after RIG-148→152 fixes are in the installed
payload). No procedural changes are needed when B is unblocked:

1. Confirm `npm test` is green on the target Rig branch.
2. Run steps 1–10 in §Clean-Checkout Procedure, recording the updated Rig SHA.
3. File a dated reasoning trace comparing the new profile against the v0.1
   baseline profile from this rubric run.

The procedure is identical; only the Rig SHA changes.
