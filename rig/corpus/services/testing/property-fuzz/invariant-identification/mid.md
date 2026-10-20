# testing.property-fuzz.invariant-identification — mid

State invariants independently of the function being tested and bound the generated input domain. Computing the expectation with the same implementation hides shared defects.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: invariant-identification-source-code-boundary, invariant-identification-property-fuzz-context.

Start from the existing repository's invariant identification convention, then name the source path or command that establishes it. For invariant identification, inspect the repository's actual spec, source, test, or configuration for input_domain; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring property-fuzz services outside the invariant identification decision for property-fuzz.invariant-identification.

Acceptance target: policy:testing.property-fuzz.invariant-identification:mid:invariant-identification-source-code-boundary+invariant-identification-property-fuzz-context.

Declared predicates: invariant-identification-source-code-boundary: `invariants` is nonempty (a string or array); invariant-identification-property-fuzz-context: `input_domain` is nonempty (a string or array).
