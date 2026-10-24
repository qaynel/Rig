---
date: 2026-10-19
source: agent
topics: testing-strategy
decisions:
status: historical
supersedes:
tags: qa-closeout, verification
summary: The broad diagnostic was restarted with a local copy of the exact digest-pinned upstream archive to avoid repeated network timeouts.
---

The first broad `npm test` run reached eight frozen lint failures and the known old Path B corpus pin failure. It then spent several minutes in repeated optional shelf fetches from the network. The run was stopped after those failures were identified; it cannot serve as a complete gate result. A single archive was downloaded to ignored `.context/` and its gunzipped tar SHA-256 matched the pinned `gstack-shelf` metadata digest `5aecc2b030d3ae0d878f420335ffa7f14f66d9769349eb82c9f699812fb4aa55`. The broad diagnostic restarted with `RIG_UPSTREAM_MIRROR_GSTACK_SHELF` set to that `file://` archive. The product fetcher still verifies the same pinned bytes.

The owner patch already covers the Path B pin and remaining lint fixtures in isolated checks. The current signed oracle still verifies its unchanged files. The mirrored broad run is in flight; exact-commit archive E2E still follows the local candidate commit.
