---
date: 2026-10-18
source: agent
topics: the-overhaul, catalogue-contract, authored-service-gate, testing-strategy
decisions:
status: historical
supersedes:
tags: qa-closeout, binding-review, remediation
summary: The policy runner now refuses fabricated higher-grade passes; catalogue declarations and fragment defects are being reconciled while frozen cases await owner amendment.
---

The current remediation has changed `runGrade` so a caller-supplied `result` or `context` object cannot fabricate a pass. It requires observed command execution for Policy; absent a verifiable Context or Evidence completion seam, requests for those grades return a named coverage gap and report only Policy as completed. Focused editable suites pass 81/81. Frozen AT-LF-7/8/9 now fail because they encode fabricated result inputs as passes. They require owner amendment, followed by real higher-grade implementation and final-byte verification; their current failure is an expected sign that the signed test and product contract are misaligned.

The catalogue review found that native service checks execute distinct `checks.json` rules, but most identity fragments say `Disposition: convention` while the catalogue declares executable. A focused DNS-discovery correction and red/green regression show the safe alignment pattern: call the config check executable, retain its explicit ceiling, and require an approved repository-owned command for runtime behavior. That pattern is being applied across the remaining identities. A mechanical cleanup removed doubled periods and an orphaned `is false` sentence from 447 non-networking minimal/slice fragments; this does not by itself establish semantic authorship. The networking group is undergoing a separate content review. The editable authored-catalogue suite passed 10/10 after the punctuation cleanup, but the frozen active-corpus digest will need owner refresh after all content changes.

The prepared owner amendment remains unsigned, and the binding review's two-failure attempt state is intact. Next work is semantic catalogue review, a precise owner patch, and code for any remaining acceptance failures. Re-run the full gate and exact-commit checks only after the owner applies and signs the final frozen delta.
