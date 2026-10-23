---
date: 2026-10-14
source: agent
topics: the-overhaul
decisions:
status: superseded
summary: T-8.2's existing-test coherence entrypoint is present, but the named test fails while the repository coherence gate is red.
---
Done: `node --test tests/coherence.test.js` exited 1 (4 pass, 1 fail). Its final subtest failed because `scripts/check-coherence.js` reported pending RIG-155/156 issue creation and nine executed-test evidence failures, including RIG-149, release, runtime-caller, and standards findings. The package-script line remains only in `candidate-amendments/08-coherence/package-scripts.md`; `package.json` and the frozen snapshot were not changed. T-8.2 remains open. In flight: T-8.7 / T-9.2 share the same gate blockers. Next: owner issue creation and resolution of the remaining proving-test findings, then rerun coherence.
