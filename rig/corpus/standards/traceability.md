# One-to-one traceability

Every independently testable requirement has exactly one primary acceptance
criterion and exactly one proving test:

```
R-052  →  AC-052  →  PT-052  →  verification evidence
```

Boundary cases, security cases and end-to-end journeys supplement that mapping;
they never replace it. When a requirement is too large for one test, split the
requirement. Do not widen a test to keep the numbers aligned.

## The check

`.rig/bin/check-traceability.js` reads the authored contract tables and
exits nonzero with the exact offending IDs. Every install receives it.

```sh
node .rig/bin/check-traceability.js --dir <contract-dir>   # or RIG_CONTRACT_DIR
node .rig/bin/check-traceability.js --hashes protected.json
```

The validator reads pipe tables out of the markdown in the contract directory,
so the graph it checks is the same text a human reviews and signs — there is no
generated second copy to drift. It recognises four row shapes by their first
cell:

| Row | First cell | Remaining cells |
|---|---|---|
| Requirement | `Rnnn` plus source codes | obligation, `AC-nnn: …`, `PT-nnn Fnn`, journeys, dependencies, status |
| Journey | `Jnn` | scenario, requirement IDs or ranges, `E2E-Jnn: …` |
| Fixture | `Fnn` | setup, action and observation, planned test file |
| Work package | `**WPnn — …**` | scope with requirement IDs or ranges, ownership, checks |

ID ranges (`R006–R024`) expand. It rejects duplicate IDs, a missing or
multiple primary criterion, a criterion or test whose number does not match its
requirement, a criterion or test claimed by two requirements, a missing or
unknown fixture, a requirement with no journey, an unknown journey or
dependency reference, a self-dependency, a journey with no mapped requirement
or no end-to-end obligation, a package citing an unknown requirement or test,
an orphaned fixture or journey, and any requirement in no work package.

## Where it runs

- **Discovery** — generate atomic requirements with stable IDs, derive one
  criterion from each, and associate each criterion with an executable test.
- **Planning** — implementation planning does not start while the graph is
  incomplete. The validator's exit code is the gate.
- **Gate 1 pre-flight** — the signing ceremony runs the validator first and
  refuses before producing any signature.
- **After signing** — `--hashes` binds the protected files by digest. A changed
  requirement voids the approval until the owner amends the whole protected
  set; it is never repaired by re-running the check.
