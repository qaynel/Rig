# Mutation Testing — Agentic Tool Taxonomy (GA-4b)

**Partition axis:** mutation-testing *concern* — the ten tools are carved so that each owns a
non-overlapping slice of what mutation testing has to worry about, not a stage of one linear
pipeline. Any given mutation-testing run touches several of these tools, but no single concern
is owned by more than one tool. Each tool below lists a minimum of three ultra-specific
sub-capabilities (plugins/modes/flags) — variations *within* that tool's job, not restatements
of the job itself.

---

## 1. Mutant Generator (Operator Engine)

**Concern owned:** deciding *what code-level bugs to inject* and physically producing the
mutated source/bytecode/AST. Does not decide which mutants matter (that's Tool 2) and does not
run anything (that's Tool 4).

- **1a. Relational/Boundary Operator Plugin** — flips comparison and boundary operators
  specifically (`>` ↔ `>=`, `<` ↔ `<=`, `==` ↔ `!=`), with a sub-mode that only mutates operators
  adjacent to loop-termination and array-index expressions, since those are the highest-yield
  boundary-bug sites.
- **1b. Statement-Deletion / Statement-Duplication Operator Plugin** — removes single
  statements (assignment, return, void-method-call) one at a time, with a duplication variant
  that instead double-executes a statement to catch missing-idempotency assumptions.
- **1c. Arithmetic & Logical Operator Swap Plugin** — swaps `+`/`-`/`*`/`/` and `&&`/`||`, with
  a "narrow-window" sub-mode restricted to financial/units-of-measure code paths (flagged via
  naming heuristics or an allowlist) where sign/operator errors are highest-cost.
- **1d. AST-Level vs. Bytecode-Level Injection Toggle** — a mode selector plugin that switches
  the generator between source-AST mutation (human-readable diffs, language-specific) and
  compiled-bytecode mutation (language-agnostic, faster, but produces non-source-mappable
  mutants) — mutually exclusive modes within the same generator.

---

## 2. Mutant Selector / Sampler

**Concern owned:** given a (potentially huge) universe of possible mutants, choosing a
tractable, high-signal subset to actually run. Does not generate mutants (Tool 1) and does not
execute them (Tool 4) — it only ranks and filters the candidate list.

- **2a. Random Statistical Sampling Plugin** — draws a stratified random sample sized to hit a
  target confidence interval on overall mutation score, with a sub-flag to stratify by file
  rather than by mutant count so small hot files aren't under-sampled.
- **2b. Git-Diff-Scoped Sampling Plugin** — restricts the mutant universe to lines touched in
  the current PR/commit range, with a sub-mode that also pulls in mutants from any function
  transitively called by changed lines (one-hop blast radius).
- **2c. Historical-Kill-Rate Prioritization Plugin** — orders mutants by the empirical
  probability (learned from past runs) that a mutant of this operator type in this file has
  survived before, running likely-survivors first so weak spots surface early in a
  time-boxed run.
- **2d. Cost-Weighted Sampling Plugin** — weights mutant selection inversely by the runtime cost
  of the tests that cover that line, favoring mutants covered by fast unit tests over ones only
  reachable through slow integration tests, to maximize mutants-checked-per-CI-minute.

---

## 3. Equivalent-Mutant Detector

**Concern owned:** identifying mutants that are semantically identical to the original program
(no test could ever kill them, and that's *correct*, not a test gap) so they don't pollute the
mutation score. This is strictly a classification concern, separate from generation and from
scoring.

- **3a. Static Symbolic-Equivalence Checker Plugin** — uses symbolic execution / SMT solving to
  prove two versions of a function produce identical outputs for all inputs, auto-discarding
  provably-equivalent mutants before any test run.
- **3b. Trivial-Compiler-Optimization Filter Plugin** — a narrow sub-tool that specifically
  catches mutants which compile down to identical bytecode/IR under the project's optimization
  level (e.g. `x*1` vs `x`), discarding them without deeper analysis.
- **3c. Dead-Code / Unreachable-Path Flagging Plugin** — flags mutants injected into code paths
  that static reachability analysis shows are unreachable given current call sites, distinct
  from 3a because it's a reachability question, not a semantic-equivalence question.
- **3d. Human-Review Queue with Confidence Scoring** — for mutants that automated equivalence
  checking can't resolve either way, routes them to a reviewer queue ranked by a
  confidence-of-equivalence score, so the hardest 5% get eyes instead of silently skewing the
  mutation score.

---

## 4. Mutant Execution Orchestrator

**Concern owned:** actually running the test suite against each surviving-candidate mutant and
recording pass/fail — the runtime/scheduling layer. Does not decide *which* mutants to run
(Tool 2) and does not interpret *why* a mutant survived (Tool 5).

- **4a. Parallel-Isolation Execution Plugin** — runs each mutant's test pass in an isolated
  process/container so a hung or crashing mutant can't corrupt sibling runs, with a sub-mode for
  containerized vs. in-process isolation depending on language runtime.
- **4b. Test-Impact-Analysis Short-Circuit Plugin** — before running the full suite against a
  mutant, computes which tests even *cover* the mutated line and runs only those, skipping
  irrelevant tests entirely rather than running-then-discounting them.
- **4c. Timeout & Infinite-Loop Containment Plugin** — enforces a per-mutant wall-clock timeout
  (since some mutants turn finite loops into infinite ones) and classifies timeout-kills as a
  distinct outcome category from assertion-based kills.
- **4d. Incremental/Resumable Run Plugin** — checkpoints execution state so a large mutation run
  interrupted by CI timeout or infra failure can resume from the last completed mutant rather
  than restarting the whole batch.

---

## 5. Survivor Root-Cause Analyzer

**Concern owned:** for mutants that *survived*, explaining *why* — which test(s) should have
caught it and didn't, and what kind of assertion gap that implies. Does not decide what to do
about it (Tool 6) — purely diagnostic.

- **5a. Covering-Test Identification Plugin** — for each survivor, lists every test that
  executed the mutated line but still passed, distinguishing "no test touched this line" from
  "a test touched it but asserted nothing about it."
- **5b. Assertion-Gap Classifier Plugin** — categorizes each survivor by gap type: missing
  assertion entirely, assertion present but too weak (e.g. checks non-null but not value),
  or assertion checks the wrong property.
- **5c. Mutant-Diff-to-Test-Diff Correlator Plugin** — for survivors, generates a minimal
  proposed test-assertion edit that *would* kill the mutant, expressed as a diff against the
  existing test file, without applying it.
- **5d. Cross-Mutant Pattern Aggregator Plugin** — clusters survivors across a whole run to
  surface systemic gaps (e.g. "every boundary mutant in the pricing module survives") rather
  than reporting each survivor as an isolated incident.

---

## 6. Test-Suite Remediation Advisor

**Concern owned:** turning root-cause findings into concrete, actionable suggestions for
strengthening tests. Does not diagnose survivors itself (Tool 5) and does not edit test files
automatically without consent — advisory only.

- **6a. Assertion-Strengthening Suggestion Plugin** — proposes specific stronger assertions
  (exact-value checks, property-based invariants) for a given weak test, scoped to one test at
  a time.
- **6b. Missing-Test-Case Generator Plugin** — for lines with zero covering tests, drafts a new
  test skeleton targeting that exact code path, distinct from 6a because it's proposing a *new*
  test rather than strengthening an existing one.
- **6c. Redundant-Test Flagging Plugin** — identifies tests that never uniquely kill any mutant
  (every mutant they'd catch is also caught by another test), flagging candidates for suite
  pruning — the inverse remediation direction from 6a/6b.
- **6d. Property-Based-Test Escalation Plugin** — for survivors clustered around a single
  function with many boundary/arithmetic mutants, suggests replacing several example-based
  tests with one property-based test and drafts the property.

---

## 7. Mutation-Score Metrics & Trend Tracker

**Concern owned:** longitudinal measurement — computing, storing, and trending mutation scores
over time and across code areas. Does not generate or execute mutants; purely a data/reporting
layer distinct from Tool 9's per-run reporting.

- **7a. Per-Module Score Decomposition Plugin** — breaks a single run's aggregate mutation
  score down by directory/module/owner, so score regressions can be attributed to a team or
  component.
- **7b. Historical Trend-Line Plugin** — stores mutation scores run-over-run and flags
  statistically significant drops (not just any decrease) using a configurable sensitivity
  threshold to avoid noise-triggered alerts.
- **7c. Score-vs-Coverage Divergence Plugin** — specifically tracks the *gap* between line
  coverage and mutation score over time, since a widening gap is the exact signal that coverage
  is becoming a vanity metric.
- **7d. Operator-Type Kill-Rate Breakdown Plugin** — reports kill rate separately per mutation
  operator (boundary, arithmetic, deletion, etc.) rather than one blended score, so a team can
  see "we catch arithmetic bugs but not boundary bugs."

---

## 8. CI/CD Gate & Policy Enforcer

**Concern owned:** deciding whether a mutation-testing result should block or allow a
build/merge, and under what policy. Does not compute scores (Tool 7) — consumes them and applies
gating logic.

- **8a. Threshold-Gate Plugin** — hard-fails a build if aggregate or diff-scoped mutation score
  falls below a configured percentage.
- **8b. No-New-Survivors-in-Diff Plugin** — a stricter, mutually distinct policy from 8a: fails
  only if the *current PR's changed lines* introduce new survivors, regardless of whole-repo
  aggregate score, so legacy debt doesn't block unrelated PRs.
- **8c. Grace-Period / Ratchet Plugin** — allows merge if score doesn't *regress* versus the
  prior baseline, even if below an ideal target, with a sub-mode that auto-raises the ratchet
  floor as scores improve so standards only tighten, never loosen.
- **8d. Severity-Weighted Gate Plugin** — instead of one flat threshold, gates differently by
  operator type (e.g. zero-tolerance for surviving boundary mutants in payment code, lenient
  threshold elsewhere).

---

## 9. Run Reporting & Visualization Layer

**Concern owned:** presenting a single run's results to a human — the per-run artifact/UI, not
trend data (Tool 7) and not the pass/fail gate decision (Tool 8).

- **9a. Inline-Diff Annotation Plugin** — renders survived/killed mutants as inline
  annotations directly on the diff view (e.g. in a PR), color-coded by outcome.
- **9b. Mutant-Explorer HTML Report Plugin** — generates a standalone browsable report where
  each mutant can be expanded to show the injected diff, which tests ran, and the failure/pass
  detail.
- **9c. Executive-Summary Digest Plugin** — a sub-mode producing a short, non-technical rollup
  (score, top 3 weak areas, trend arrow) suitable for a status update rather than the full
  mutant-by-mutant detail.
- **9d. IDE-Integration Overlay Plugin** — surfaces survivor markers directly in the editor
  gutter at the corresponding line, scoped to local/dev-loop use rather than CI report output.

---

## 10. Language/Runtime Adapter Layer

**Concern owned:** translating the abstract mutation-testing operations (from Tools 1–9) into
the concrete mechanics of a specific language, build system, and test framework. Every other
tool is language-agnostic in concept; this tool is where that abstraction meets a real
toolchain, and it owns *only* that translation — not operator design, not scoring policy.

- **10a. JVM/Bytecode Adapter Plugin** — implements mutant injection and execution hooks against
  JVM bytecode (Java/Kotlin/Scala), handling build-tool integration (Maven/Gradle) and
  JVM-specific timeout/isolation mechanics.
- **10b. Dynamic-Language AST Adapter Plugin** — implements the equivalent for interpreted
  languages (Ruby/Python/JS) via source-AST rewriting rather than bytecode, since these
  ecosystems typically lack a stable intermediate representation to mutate.
- **10c. Compiled-Native Adapter Plugin** — implements mutation at the source or IR level for
  compiled-native languages (C/C++/Rust), with a sub-mode handling the extra complexity of
  undefined-behavior-sensitive mutants (e.g. signed-overflow mutations) that other adapters
  don't need to worry about.
- **10d. Test-Framework Shim Plugin** — a cross-cutting adapter (within this tool's scope, not
  Tool 4's) that normalizes how "a test failed" is detected across frameworks (JUnit, RSpec,
  pytest, Jest, cargo test) so upstream tools get a uniform pass/fail/error signal regardless of
  framework-specific exit codes or output formats.

---

## Why this partition is exhaustive and mutually exclusive

Every question mutation testing has to answer falls into exactly one of these ten buckets:
*what bug to inject* (1), *which of those to bother running* (2), *which of those aren't real
bugs at all* (3), *how to run them* (4), *why a survivor survived* (5), *what to do about it*
(6), *how the score moves over time* (7), *whether that score should block anything* (8), *how
a human sees one run's results* (9), and *how any of the above maps onto a real toolchain* (10).
No concern listed appears in two tools — e.g. "which tests cover this mutant" is computed once,
in Tool 4b as a runtime optimization and referenced (not recomputed) by Tool 5a as a diagnostic
input; the two are cross-referencing, not duplicating, the same fact.
