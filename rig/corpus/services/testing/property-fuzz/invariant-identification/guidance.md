# invariant-identification

State invariants independently of the function being tested and bound the generated input domain. Computing the expectation with the same implementation hides shared defects.

Owned scope: `property-fuzz.invariant-identification`. Input: `rig-services/testing.property-fuzz.invariant-identification.json`.

Coverage ceiling: Configuration validation only, so it confirms invariants, an input domain and the derive-from-subject flag are declared; it does not run properties.

minimal: invariants — ["sum of debits equals credits"]. State the invariants independently of the code under test. Invariants computed by the subject hide shared defects, so write them from the specification.

mid: input domain — "nonnegative integer amounts". Bound the generated input domain. An unbounded domain explores nonsense, so declare the valid ranges.

maximal: derive expected from subject — false. Set deriving expected values from the subject to false. Computing the expectation with the implementation proves nothing, so use an independent oracle.
