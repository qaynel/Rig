# testing.property-fuzz.invariant-identification — floor and mutation-floor slice

State invariants independently of the function being tested and bound the generated input domain. Computing the expectation with the same implementation hides shared defects.

Policy grade slice `invariant-identification-slice-floor`: State the invariants independently of the code under test. Invariants computed by the subject hide shared defects, so write them from the specification.
