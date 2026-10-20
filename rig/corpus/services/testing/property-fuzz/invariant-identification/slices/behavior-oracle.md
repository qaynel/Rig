# testing.property-fuzz.invariant-identification — behavior-oracle slice

State invariants independently of the function being tested and bound the generated input domain. Computing the expectation with the same implementation hides shared defects.

Policy grade slice. This slice bounds invariant identification to property-fuzz.invariant-identification. It uses `invariant-identification-slice-behavior-oracle` and checks invariants (nonempty): invariants must name the concrete repository contract.