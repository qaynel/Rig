# testing.property-fuzz.invariant-identification — maximal

State invariants independently of the function being tested and bound the generated input domain. Computing the expectation with the same implementation hides shared defects.

Policy grade, maximal: Set deriving expected values from the subject to false. Computing the expectation with the implementation proves nothing, so use an independent oracle. Cumulative with minimal and mid. Binding checks: invariant-identification-source-code-boundary, invariant-identification-property-fuzz-context, invariant-identification-evidence-receipt.

Acceptance target: policy:testing.property-fuzz.invariant-identification:maximal:invariant-identification-source-code-boundary+invariant-identification-property-fuzz-context+invariant-identification-evidence-receipt.
Declared predicates: invariant-identification-source-code-boundary: `invariants` is nonempty (a string or array); invariant-identification-property-fuzz-context: `input_domain` is nonempty (a string or array); invariant-identification-evidence-receipt: `derive_expected_from_subject` equals false.
