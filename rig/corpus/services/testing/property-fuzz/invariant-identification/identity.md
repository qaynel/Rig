# testing.property-fuzz.invariant-identification — identity

Policy grade: invariant identification owns property-fuzz.invariant-identification. State invariants independently of the function being tested and bound the generated input domain. Computing the expectation with the same implementation hides shared defects.

Keep neighboring property-fuzz services outside the invariant identification decision for property-fuzz.invariant-identification. Read the configured input at `rig-services/testing.property-fuzz.invariant-identification.json`; malformed input is still attributed to that path.

Disposition: convention. Ground the decision in the limit: invariant identification configuration validation only; declared policy does not prove running invariant identification behavior. Choose a repository-owned check that observes invariant identification from rig-services/testing.property-fuzz.invariant-identification.json.

Acceptance target: fixture:testing.property-fuzz.invariant-identification:policy-boundary. Given source-code is present and property-fuzz.invariant-identification is selected, pass only when the repository binding evaluates property-fuzz.invariant-identification and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent property fuzz concern.

Service-specific evidence cues:
Offer: State invariants independently of the function being tested and bound the generated input domain. Computing the expectation with the same implementation hides shared defects.
minimal: invariants — ["sum of debits equals credits"].
mid: input domain — "nonnegative integer amounts".
maximal: derive expected from subject — false.
