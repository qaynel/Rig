# testing.property-fuzz.invariant-identification — behavior-oracle slice

State invariants independently of the function being tested and bound the generated input domain. Computing the expectation with the same implementation hides shared defects.

Policy grade slice `invariant-identification-slice-behavior-oracle`: State the invariants independently of the code under test. Invariants computed by the subject hide shared defects, so write them from the specification. Despite its name this slice is not a behavior oracle: it confirms invariants, an input domain and the derive-from-subject flag are declared; it does not run properties.
