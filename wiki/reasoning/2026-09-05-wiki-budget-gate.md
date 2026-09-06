---
date: 2026-09-05
source: agent
topics: agent-working-conventions, the-overhaul, testing-strategy
decisions:
status: current
supersedes: 2026-09-05-wiki-budget-gate-plan
tags: interdependency
summary: The wiki budget gate ships — caps on hub bytes, index rows and bytes, trace summaries, and total orientation cost, enforced from tests/wiki-budget.test.js behind a ratchet-only waiver ledger, plus scripts/wiki-query.js as the bounded read that replaces hub browsing.
---

# Wiki budget gate

The wiki now has a measured read-cost gate. The limits are 12,000 bytes for a
topic hub, 200 rows and 20,000 bytes for an index, zero traces without a
`summary:`, and 100,000 bytes for the orientation path. The live measurements
that set and exercise those boundaries are five of 29 hubs above 12,000 bytes,
five indexes above 200 rows, two indexes above 20,000 bytes, 107 traces with
no summary, and 203,065 bytes across the orientation path; the installation
measurement recorded in the plan was 211,775 bytes before later branch work.

`wiki/budget.waivers.json` records the existing debt rather than hiding it:
120 entries, split into one entry-path measurement, five hub-byte entries, two
index-byte entries, five index-row entries, and 107 missing-summary entries.
Each value is ratchet-only: it may fall or disappear, but it cannot grow.
Summary backfill, hub splits, and index splits are consequently the follow-on
parallel work already enumerated by the ledger.

The check reaches CI through `tests/wiki-budget.test.js`, which the existing
test-file glob already discovers. Adding it to `package.json` would change the
signed scripts oracle; the 2026-09-04 package-scripts revert demonstrated that
such a change makes the full gate fail without an owner re-sign.

Reachability is deliberately checked only from the four mandated reads, not
from all 85 hub citations. Reasoning traces must remain cited by the hubs that
summarise them, so global reachability would require agents to break the
filing rule in order to satisfy the budget. The bounded alternative is
`node scripts/wiki-query.js --topic <slug>`, which returns at most 40
summarised traces instead of requiring a hub browse.
