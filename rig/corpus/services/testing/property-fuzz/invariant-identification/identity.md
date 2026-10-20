# testing.property-fuzz.invariant-identification — identity

Policy grade: invariant identification owns property-fuzz.invariant-identification. State invariants independently of the function being tested and bound the generated input domain. Computing the expectation with the same implementation hides shared defects.

Keep neighboring property-fuzz services outside the invariant identification decision for property-fuzz.invariant-identification. Read the configured input at `rig-services/testing.property-fuzz.invariant-identification.json`; malformed input is still attributed to that path.

Disposition: executable. Ground the decision in the limit: invariant identification configuration validation only; declared policy does not prove running invariant identification behavior. Choose a repository-owned check that observes invariant identification from rig-services/testing.property-fuzz.invariant-identification.json.

Acceptance target: policy:testing.property-fuzz.invariant-identification:minimal:invariant-identification-source-code-boundary.

Declared predicates: invariant-identification-source-code-boundary: `invariants` is nonempty (a string or array).
