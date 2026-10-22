---
date: 2026-10-22
source: agent
topics: review-receipts, the-overhaul
decisions:
status: superseded
supersedes: 2026-10-22-qa-closure-evidence-checkpoint
tags: remediation, verification, recovery
summary: Three Luna reviews found staged semantic metadata, CI grade, write-race, journal-schema and sidecar defects; bounded fixes and regressions are underway, with owner signing still pending.
---

15:13 UTC — The requested three Luna agents completed their original assigned repair slices, then independently reviewed all eighteen acceptance findings. The boundary slice found no substantiated additional defect. The runtime and integrity slices found concrete adversarial failures: staged semantic metadata could erase review coverage; CI downgraded maximal lint-format to minimal; directory ignore entries did not cover descendants; signed catalogue CAS was checked before acquiring its lock; remediation could lose a late edit and follow an internal journal symlink; incomplete operation records could authorize deletion; global ownership metadata followed hard links; and the legacy action-grant command omitted mandatory signed inputs. These are implementation defects, not reasons to weaken the criteria.

The coordinator delegated runtime/semantic/CI/scope fixes to one Luna, apply/remediation/global authority fixes to another, and strict journal validation plus valid support fixtures to the third. Their code ownership is disjoint. The first integrity repair reports five new regressions plus six real competing/crash coverage tests passing. The stricter journal parser exposed incomplete handcrafted support fixtures; they are being made schema-complete so the original trust boundary tests still reach their intended cases. Frozen acceptance files are not part of these new edits.

The coordinator repaired the legacy grant wrapper to require the signed proposal and authorization, and made both grant CLI routes emit the actual reusable signed grant. A new real-process CLI regression rejects unsigned issuance, accepts a fixture Gate 1 signature, dispatches exactly once and rejects replay. Its red and green logs are retained. The local enforcement skill instructions and operator guide now document the signed flow.

Earlier integrated checks passed 36 cases on macOS, 25 under real Docker/Linux Bubblewrap, 15 Pi cases, six MCP cases, seven CI preservation cases and native Ruby YAML parsing of all five YAML provider artifacts. Those focused runs precede the additional repairs and must be rerun where affected. The running broad main suite is diagnostic and includes the earlier CI positive-fixture failure already repaired in the focused two-case suite. It is not a final-byte gate.

The actual npm test invocation stops at the stale frozen-fixture signature. The exact prepared owner-only signing command remains node scripts/approve-gate1.js --confirm-digest-delta b093070363c5dc1a3ac6c4f991e76e6a53e577371c44c051b732b29275075de4. No agent used the owner key. No passing binding receipt, commit, push, merge or deployment is claimed. The existing QA PR is #153; its remote test failures concern the older pushed candidate. The local QA base was fetched and is an ancestor of current HEAD. Recovery scope and scripts live under wiki/specs/close-everything/2026-10-22-qa-closure-scope.md and .context/qa-closure/.
