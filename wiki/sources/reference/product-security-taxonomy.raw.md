# Product Security — Agentic Tool Taxonomy

**Scope:** security of the codebase/product you're building — a dialable development concern,
distinct from agent-tech-safety (which protects the agent's own environment, not your product).
This spans secrets/credential handling, vulnerability scanning, license compliance, and — at
the maximal setting — active red-team/penetration simulation against your own app.

Each tool below owns a non-overlapping concern. Each lists a minimum of three ultra-specific
sub-capabilities (plugins/modes/flags) — variations *within* that tool's job, not restatements
of the job itself.

---

## 1. Secrets & Credential Handling

**Concern owned:** how sensitive values (API keys, tokens, passwords, connection strings) are
stored, injected, and kept out of places they shouldn't be. Does not scan for vulnerabilities
in application logic (Tool 2) — purely about the lifecycle of secret material.

- **1a. Encrypted-at-Rest Secrets Store Plugin** — manages secrets in an encrypted file/vault
  (e.g. sealed `.env.enc`, SOPS, age) with a sub-mode for per-environment key separation so a
  compromised dev key can't decrypt prod secrets.
- **1b. Toy-Project Relaxation Mode** — an explicit, opt-in dial that permits hardcoded
  placeholder credentials in low-stakes/throwaway projects, with a guardrail sub-flag that still
  blocks anything matching a real-looking key pattern (entropy check) even in relaxed mode.
- **1c. Pre-Commit Secret-Leak Scanner Plugin** — scans staged diffs for credential-shaped
  strings before commit, with a sub-mode that also scans commit *history* retroactively when
  first enabled on an existing repo.
- **1d. Runtime Secret Injection Plugin** — handles pulling secrets from a vault into the
  running process (env vars, mounted files) rather than baking them into images or config
  files, distinct from 1a because this is about delivery-at-runtime, not storage-at-rest.
- **1e. Credential Rotation Reminder Plugin** — tracks age of each stored secret and flags ones
  past a configurable rotation window, with a sub-mode that can auto-open a rotation ticket
  against the relevant provider's API where supported.

---

## 2. Static & Dependency Vulnerability Scanning

**Concern owned:** finding known or pattern-based security flaws in your own code and in the
third-party packages you depend on. Does not handle license terms of those same dependencies
(Tool 3) — this is strictly about exploitability, not legal terms.

- **2a. SAST (Static Application Security Testing) Plugin** — pattern-matches your own source
  for known vulnerability classes (SQL injection, XSS, path traversal, insecure deserialization),
  with a depth dial from "common-pattern lint pass" up to "full taint-flow analysis tracing
  untrusted input from source to sink."
- **2b. Software-Composition-Analysis (SCA) / Dependency-CVE Plugin** — checks every direct and
  transitive dependency against known-vulnerability databases (CVE/NVD/OSV), with a sub-mode
  that distinguishes "vulnerable function is actually reachable from your code" from "vulnerable
  package is present but the flawed code path is never called."
- **2c. Secrets-in-Dependencies Cross-Check Plugin** — narrow sub-scanner that checks whether
  any pulled-in package itself ships hardcoded credentials or telemetry endpoints, distinct from
  Tool 1 because it's auditing *someone else's* code, not yours.
- **2d. Infrastructure-as-Code Scanning Plugin** — applies the same vulnerability-scanning
  concern to Terraform/CloudFormation/K8s manifests (open security groups, public S3 buckets,
  overly permissive IAM), since infra misconfig is a vulnerability class distinct from
  application code.
- **2e. Scan-Depth Dial Plugin** — the explicit tunable knob referenced in the scope note: a
  single control that scales all of 2a–2d from "fast/shallow — CI-blocking on critical only" to
  "deep/slow — full nightly scan flagging medium and low severity too."

---

## 3. License Compliance

**Concern owned:** whether the licenses of dependencies you pull in are legally compatible with
how you intend to ship your product. A legal/policy concern, fully separate from whether a
dependency is *vulnerable* (Tool 2).

- **3a. License Detection & Inventory Plugin** — walks the full dependency tree and produces a
  bill-of-materials mapping every package to its declared license, with a sub-mode that flags
  packages with no detectable license at all (highest legal risk).
- **3b. Policy-Conflict Checker Plugin** — compares the detected license inventory against a
  configurable allow/deny policy (e.g. "no GPL in a closed-source commercial product") and fails
  the build on conflicts.
- **3c. License-Change Diff Watcher Plugin** — specifically tracks when an *already-approved*
  dependency changes its license in a version bump (a known real-world failure mode), distinct
  from 3a/3b because it's a delta-over-time check, not a point-in-time inventory.
- **3d. Attribution/NOTICE-File Generator Plugin** — auto-generates the legally-required
  attribution file bundling license text for every dependency that requires it, so compliance
  isn't just detection but also the paperwork obligation that follows from it.

---

## 4. Active Red-Team / Penetration Simulation

**Concern owned:** the maximal-grade setting — actively attacking your own running application
to prove (not just infer) that defenses hold. Distinct from Tools 2/3 because those are static
analysis; this is dynamic, adversarial, runtime testing against a live target.

- **4a. Automated DAST (Dynamic Application Security Testing) Plugin** — runs an automated
  attack scanner against a live staging instance (fuzzing inputs, probing auth boundaries,
  injection attempts) rather than reading source, with a sub-mode scoped to authenticated vs.
  unauthenticated attacker perspectives.
- **4b. Red/Green Adversarial Simulation Plugin** — the explicit red-vs-green framing: one
  agent role actively tries exploits (privilege escalation, IDOR, session hijacking) while a
  green-side monitor verifies whether the attempt was detected/blocked, producing a pass/fail
  per attack scenario rather than a vulnerability list.
- **4c. Auth & Session-Boundary Probe Plugin** — a narrower, high-value sub-tool focused
  specifically on access-control logic (can user A read user B's data, does a revoked token
  still work, does role-escalation hold under concurrent requests) since these bugs are
  systematically undercaught by generic scanners.
- **4d. Rate-Limit & Abuse-Resistance Simulation Plugin** — simulates high-volume/credential-
  stuffing/brute-force traffic against the live app to verify throttling and lockout actually
  trigger under real load, rather than just checking that the config exists.
- **4e. Blast-Radius Containment Verifier Plugin** — for any successful simulated exploit,
  additionally checks how far the compromise could spread (lateral movement, data exfil scope)
  so the report grades not just "was it breached" but "how bad would it have been."

---

## Why this partition is exhaustive and mutually exclusive

Every product-security question falls into exactly one of these four buckets: *how do secrets
live and move* (1), *is the code/dependencies we ship vulnerable* (2), *are we legally allowed
to ship these dependencies* (3), and *does the running system hold up when actually attacked*
(4). Concerns don't repeat across tools — e.g. a leaked credential inside a third-party package
is scanned once, under 2c, and Tool 1 only ever concerns itself with *your own* secret material;
a vulnerability found by static analysis (Tool 2) is never re-litigated by Tool 4, which only
concerns itself with what's provably exploitable at runtime, including things static analysis
would never catch.

This is a shorter list than the mutation-testing taxonomy by design — it mirrors the four
concerns you named (secrets, scan depth, license compliance, red-team) rather than an
independently-derived ten-way split. If you want it forced to a wider frame (e.g. splitting out
compliance/audit trail, or incident response as its own tool), say so and I'll extend it.
