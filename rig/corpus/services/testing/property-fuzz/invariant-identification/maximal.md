# testing.property-fuzz.invariant-identification — maximal

State invariants independently of the function being tested and bound the generated input domain. Computing the expectation with the same implementation hides shared defects.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: invariant-identification-source-code-boundary, invariant-identification-property-fuzz-context, invariant-identification-evidence-receipt.

The maximal policy predicates evaluate the declared configuration fields. Record the result and any observed repository evidence separately; this service does not issue or verify a replayable receipt.

Acceptance target: policy:testing.property-fuzz.invariant-identification:maximal:invariant-identification-source-code-boundary+invariant-identification-property-fuzz-context+invariant-identification-evidence-receipt.

Declared predicates: invariant-identification-source-code-boundary: `invariants` is nonempty (a string or array); invariant-identification-property-fuzz-context: `input_domain` is nonempty (a string or array); invariant-identification-evidence-receipt: `derive_expected_from_subject` equals false.
