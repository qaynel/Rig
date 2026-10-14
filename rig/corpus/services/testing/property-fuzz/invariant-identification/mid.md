# testing.property-fuzz.invariant-identification — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for invariant identification; it does not widen ownership beyond property-fuzz.invariant-identification. For invariant identification, inspect these context signals: input_domain. Binding checks: invariant-identification-property-fuzz-context.

Start from the existing repository's invariant identification convention, then name the source path or command that establishes it. For invariant identification, inspect the repository's actual spec, source, test, or configuration for input_domain; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring property-fuzz services outside the invariant identification decision for property-fuzz.invariant-identification.

Acceptance target: fixture:testing.property-fuzz.invariant-identification:repository-context. Given property-fuzz.invariant-identification has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent property fuzz concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: State invariants independently of the function being tested and bound the generated input domain. Computing the expectation with the same implementation hides shared defects.
minimal: invariants — ["sum of debits equals credits"].
mid: input domain — "nonnegative integer amounts".
maximal: derive expected from subject — false.
