# testing.property-fuzz.invariant-identification — identity

Policy grade: invariant-identification owns property-fuzz.invariant-identification. State invariants independently of the function being tested and bound the generated input domain. Computing the expectation with the same implementation hides shared defects.

Input: `rig-services/testing.property-fuzz.invariant-identification.json`. Configuration validation only, so it confirms invariants, an input domain and the derive-from-subject flag are declared; it does not run properties.

Disposition: executable.
Acceptance target: policy:testing.property-fuzz.invariant-identification:minimal:invariant-identification-source-code-boundary.
Declared predicates: invariant-identification-source-code-boundary: `invariants` is nonempty (a string or array).
