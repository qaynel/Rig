# testing.property-fuzz.invariant-identification — mid

State invariants independently of the function being tested and bound the generated input domain. Computing the expectation with the same implementation hides shared defects.

Policy grade, mid: Bound the generated input domain. An unbounded domain explores nonsense, so declare the valid ranges. Cumulative with minimal. Binding checks: invariant-identification-source-code-boundary, invariant-identification-property-fuzz-context.

Acceptance target: policy:testing.property-fuzz.invariant-identification:mid:invariant-identification-source-code-boundary+invariant-identification-property-fuzz-context.
Declared predicates: invariant-identification-source-code-boundary: `invariants` is nonempty (a string or array); invariant-identification-property-fuzz-context: `input_domain` is nonempty (a string or array).
