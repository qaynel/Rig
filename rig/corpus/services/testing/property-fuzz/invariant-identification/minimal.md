# testing.property-fuzz.invariant-identification — minimal

State invariants independently of the function being tested and bound the generated input domain. Computing the expectation with the same implementation hides shared defects.

Policy grade, minimal: State the invariants independently of the code under test. Invariants computed by the subject hide shared defects, so write them from the specification. Binding checks: invariant-identification-source-code-boundary.

Acceptance target: policy:testing.property-fuzz.invariant-identification:minimal:invariant-identification-source-code-boundary.
Declared predicates: invariant-identification-source-code-boundary: `invariants` is nonempty (a string or array).
