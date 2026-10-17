---
date: 2026-10-17
source: agent
topics: the-overhaul
decisions:
status: current
summary: The full signed gate reports five failures; four are upstream timeouts and all 115 catalogue cases pass, so the retry uses a freshly downloaded digest-verified mirror.
---

Done: npm test on clean signed commit 11a53402 completed its main Node suite
with 1062 pass, 5 fail and 2 skip (1069 tests). All 115 installed service cases
passed across all grades and good/bad inputs. The run is red; pi-extension and
MCP package gates were not reached by that invocation.

Four failures (HD-1, I-A-1, a dangling-reference case and malformed-graft case)
were explicit 120-second codeload timeouts before the intended assertions.
The existing fetcher supports digest-verified file mirrors. A Luna worker
verified the existing cached archive and reproduced HD-1 green through that
unchanged path. Root then downloaded the pinned archive afresh with curl:
13,036,314 bytes, archive SHA-256
5dab9119ac9a5909b4faf173d4bc8817052f1726e79ae85d4259bf70219a3120,
decompressed tar SHA-256
5aecc2b030d3ae0d878f420335ffa7f14f66d9769349eb82c9f699812fb4aa55,
matching the shipped upstream metadata. It lives under ignored
.context/qa-downloads/gstack.tar.gz. Both GSTACK and GSTACK_SHELF mirror
variables point to those verified real upstream bytes for the next run.

The fifth failure was coherence's nested proving-test execution of the retry
cap. That same exact title passed in the main suite; a fresh direct execution
through verifyTestEvidence also passed (one executed test, exit 0, about one
second). The retained nested failure reports only not-passed, so its underlying
cause cannot be proved from that log. It is not treated as green by assertion
or removed from the gate; the entire gate will rerun. No tests, pins or timeouts
are weakened, and no offline-vendored fallback is added.

In flight: full gate retry using the supported verified mirror, followed by
exact-SHA clean-install E2E and the authorized final review. Next: act on any
remaining reproducible red and preserve exact-byte evidence for the QA handoff.
