# testing.property-fuzz.shrinking — minimal

Minimal establishes a non-vacuous policy boundary for shrinking. It checks failure_predicate (nonempty): failure predicate must name the concrete repository contract..

Anchor the review on a repository-owned command or existing native check that can observe property-fuzz.shrinking; bind it to the input named in `rig-services/testing.property-fuzz.shrinking.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside property-fuzz.shrinking is a failure.

Acceptance target: fixture:testing.property-fuzz.shrinking:policy-boundary. Given source-code is present and property-fuzz.shrinking is selected, pass only when the repository binding evaluates property-fuzz.shrinking and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent property fuzz concern. A passing policy check does not establish runtime behavior.
