# Acceptance Test Profiles — RIG-115 Input

Three suites, each with concrete Given/Expected cases. Cases marked **[ASSUMED]** infer plausible values for your `.rig/` policy internals (network-policy.json contents, resource caps, leaf-task substitution rules) since I don't have your actual policy files — verify/correct these against the real implementation before landing.

---

## Suite 1: Applicability

Can Rig accurately report what it can/cannot cover?

```
AT-LF-APPLICABILITY-1: Full component coverage
- Given: Repo contains only .py files; Rig lint-format installed with Ruff selected (lint + format)
- Expected: "Full coverage claimed" — output states all detected file types are covered by an installed, configured tool

AT-LF-APPLICABILITY-2: Partial component coverage
- Given: Repo contains .py and .ts files; Rig lint-format installed with only Ruff selected (Python covered, TypeScript not)
- Expected: Coverage warning shown; ".ts files not covered by any installed tool" listed explicitly by extension/count; full-coverage claim suppressed

AT-LF-APPLICABILITY-3: Unsupported ecosystem
- Given: Repo contains Haskell (.hs) files; Rig lint-format installed (no ecosystem entry for Haskell exists in the preference list)
- Expected: "Haskell is not in supported ecosystems; skipped without error" — distinct code path from APPLICABILITY-2 (unsupported ecosystem is not the same failure mode as a supported ecosystem with no tool selected)

AT-LF-APPLICABILITY-4: Mixed known + unknown ecosystems
- Given: Repo contains .py (Ruff selected, covered), .rb (RuboCop available but not selected), and .hs (unsupported) files
- Expected: Coverage warning for .rb (known ecosystem, gap); separate "skipped, unsupported" note for .hs; both surfaced in the same report without one suppressing the other
```

---

## Suite 2: Execution Consent

Does the approval ladder hold: select → plan → mutate?

```
AT-LF-CONSENT-1: Selection alone runs nothing
- Given: User selects lint-format service via `rig select lint-format`
- Expected: No command executes; no files written; no exit code from any lint/format binary is produced — the only observable effect is the selection being recorded

AT-LF-CONSENT-2: Plan approval runs read-only checks only
- Given: User approves plan listing `ruff check .` and `eslint .` (both read-only/report-mode invocations, no `--fix`/`--write` flags)
- Expected: Only those exact commands run, in the form listed in the plan; no fix/write-mode command executes even if the underlying tool supports one

AT-LF-CONSENT-3: Mutation requires separate approval
- Given: Plan approved as read-only only; user subsequently runs `rig policy fix`
- Expected: "Fix requires separate approval" surfaced as a visible, actionable error; fix refused; prior read-only results remain valid/unaffected

AT-LF-CONSENT-4: Fix under read-only approval fails
- Given: Plan was approved with a read-only flag set; the approved command list is inspected and one entry is actually a write command (e.g., `ruff check --fix .` slipped into a "read-only" plan)
- Expected: Command rejected at the policy boundary before execution, not after; visible error logged identifying which command and why (mismatch between plan's declared read-only flag and the command's actual write behavior)

AT-LF-CONSENT-5: Approval does not carry across sessions [ASSUMED]
- Given: Plan approved and executed in one session; a new session is started; user runs `rig policy fix` without re-approving
- Expected: Fix refused — approval is scoped to the session/plan instance it was granted in, not persisted as a standing grant
```

---

## Suite 3: Shell Trust

Do argv constraints hold? Can repo tasks escape or access secrets?

```
AT-LF-SHELL-1: No argv escape
- Given: Repo task defined as `eslint --fix $FILE`; task runs under leaf policy with `$FILE` substituted from a file list containing a crafted entry like `; rm -rf /`
- Expected: Shell metacharacters rejected — `$FILE` is treated as a literal argv element (never passed through a shell interpreter that would re-parse it), so no secondary command executes; visible error if the crafted filename is rejected outright

AT-LF-SHELL-2: No secret access under leaf task
- Given: Leaf task runs; task attempts to read `$HOME/.ssh/id_rsa` directly or via `process.env.API_KEY` / `os.environ['API_KEY']`
- Expected: [ASSUMED — depends on your actual .rig/network-policy.json and secret-scoping rules] File-path access outside the repo working directory is denied; environment variables not explicitly allow-listed for the leaf task are absent from its process environment (not merely denied — absent, so no error-message leakage of secret existence); visible error logged on the file-access attempt

AT-LF-SHELL-3: Resource/time limits enforced
- Given: Leaf task runs a lint plugin that enters an infinite loop, or a formatter invoked on a pathological input that drives memory beyond 1GB [ASSUMED cap value]
- Expected: Task terminated by the resource cap (wall-clock timeout and/or memory ceiling, whichever is configured); visible timeout/OOM error distinguishes this from a normal non-zero exit code (so it isn't silently reported as "0 issues found" on truncated output)

AT-LF-SHELL-4: Network isolation enforced
- Given: Leaf task attempts `curl https://example.com` (e.g., a lint plugin trying to phone home for a rule update or telemetry)
- Expected: Network call blocked at the sandbox/policy boundary; visible error surfaced to the task's stderr/log, not silently dropped

AT-LF-SHELL-5: Symlink/path traversal containment [ASSUMED]
- Given: Repo contains a symlink pointing outside the repo root (e.g., `./config -> /etc/passwd`); leaf lint task is scoped to run across all repo files including following symlinks
- Expected: Traversal outside repo root denied; task either skips the symlink with a visible warning or fails closed — must not silently read/lint content outside the repo boundary
```

---

## Cross-Suite Notes

- Every CONSENT and SHELL case requires an **observable** failure signal (explicit error message, non-zero exit distinguishable from a normal lint failure, or a logged denial) — a silent no-op is not an acceptable pass condition per your original checklist constraint.
- APPLICABILITY-4 is added beyond your original 3-case skeleton because mixed known/unknown ecosystem repos are a realistic and distinct code path from either pure case — recommend keeping it, but it's additive to your original scope, flagging that explicitly.
- CONSENT-5 and SHELL-5 are marked [ASSUMED] because they test policy decisions (approval persistence scope, symlink handling) I inferred as reasonable coverage rather than values from your actual implementation. Confirm against `.rig/` policy files before treating these as locked acceptance criteria — they may already be covered elsewhere, or your actual policy may differ.
