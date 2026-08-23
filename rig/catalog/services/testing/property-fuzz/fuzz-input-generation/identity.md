# testing.property-fuzz.fuzz-input-generation - identity

Policy grade. This is generic baseline practice, not a claim of repository-tailored Context or Evidence coverage.

fuzz input generation is the sole catalogue owner of `property-fuzz.fuzz-input-generation`. It must not absorb other property fuzz concerns. Profile evidence is `source-code`.

Disposition: convention. Dependencies: none. First wire reuses an existing repository command, then a native platform feature, then an installed dependency; if none observes `property-fuzz.fuzz-input-generation`, the result is a named nonzero coverage gap.

Acceptance target: fixture:testing.property-fuzz.fuzz-input-generation:policy-boundary. Given source-code is present and property-fuzz.fuzz-input-generation is selected, pass only when the repository binding evaluates property-fuzz.fuzz-input-generation and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent property fuzz concern.
