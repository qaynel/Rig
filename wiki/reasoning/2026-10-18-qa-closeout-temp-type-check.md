---
date: 2026-10-18
source: review
topics: the-overhaul, review-receipts
decisions:
status: historical
supersedes:
tags: review, verification, acceptance
summary: The grouped migration identity/type finding also includes a proven FIFO temp collision that blocks before regular-file validation.
---

The final C1 boundary check reproduced a pre-existing FIFO collision at .rig-migration.json.tmp. Python prepareTempAt opens O_RDONLY before checking regular-file status, so the operation blocks waiting for a writer. The disposable primary probe kills the whole process group after three seconds and preserves the FIFO; no process is left behind. .context/qa-closeout-fifo-repro.js exits 1, with timedOut true in its JSON. C1 now includes a bounded non-regular-temp refusal criterion at the same validation seam, not a new root-cause review item. The active report still has eight grouped findings. This liveness gap is explicitly labelled pre-existing; no source fix or frozen-artifact change occurred.
