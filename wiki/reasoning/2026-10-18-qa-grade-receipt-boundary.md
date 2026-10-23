---
date: 2026-10-18
source: agent
topics: testing-strategy, gate1-signing
decisions:
status: current
supersedes:
tags: qa-closeout, lint-format, evidence
summary: Lint Policy runs observed commands; Context and Evidence require a host review receipt and replayable command evidence before they can pass.
---

The current `runGrade` correction refuses to treat caller-supplied command results or a bare `context.findings` object as proof. This closes fabricated higher-grade passes but leaves Context and Evidence as explicit gaps. The installed `buildBinding` path also names maximal local Evidence as a gap, separately from CI proposal state. Gate 2 §5.7 still requires functional cumulative grades: an agent must review the actual diff against component rules for Context, and Evidence must bind executable results to input bytes and support replay. Neither a declared grade nor an approved CI job satisfies local Evidence.

The smallest candidate interface is a structured Context review bound to the changed-file and rule-source digests, followed by a local Evidence receipt with command argv, cwd, exit, output digest, and input digest. The checker must verify the review's scope, independently observe the commands, and rerun or replay against unchanged inputs before reporting Evidence. The owner amendment should require independent negative tests for a forged result, a stale review, and a non-replayable receipt. This design is in progress, not a completed implementation. The frozen AT-LF-7/8/9 cases remain owner-owned and cannot be edited by an agent.
