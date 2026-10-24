---
date: 2026-10-13
source: agent
topics: testing-strategy, agent-working-conventions
decisions:
status: historical
supersedes:
tags: trap, interdependency
summary: Strict proving-test execution exposed historical manual evidence and genuine installed runtime failures; heading parser false positives corrected before tracker edits.
---
The first strict completed-board run executed 54 unique references and reported 40 failures. Several were a parser defect: Acceptance mapping/resolution was selected ahead of the exact Acceptance heading. Correcting that selector and rerunning executed 63 references and reported 27 failures, including historic manual evidence, an installed corpus catalogue staging omission, installer fixture dependency symlinks and the newly added reporter absent from the literal-only caller graph. These are separate from title-reference hygiene. Root was notified of exact installation failures and delegates staging/archive fixes to their owners. Manual acceptance references need actual checks, preserving their historical reasons outside the current acceptance section; unsigned tests may be repaired but frozen originals remain untouched. Successive lint replacement additionally caught a lineage defect: restoring the second replacement returned the first replacement rather than the original. The typed record now preserves the original preimage across all accepted replacements; its new regression passed.
