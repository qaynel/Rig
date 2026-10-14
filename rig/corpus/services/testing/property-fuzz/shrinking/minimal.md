# testing.property-fuzz.shrinking — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for shrinking. The minimal boundary for shrinking checks failure_predicate (nonempty): failure predicate must name the concrete repository contract.. Binding checks: shrinking-source-code-boundary.

Anchor the review on a repository-owned command or existing native check that can observe property-fuzz.shrinking; bind it to the input named in `rig-services/testing.property-fuzz.shrinking.json` and preserve the check's failure status. When adopting this in an existing repository, connect shrinking to the command that inspects failure_predicate and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside property-fuzz.shrinking as a failure.

Acceptance target: fixture:testing.property-fuzz.shrinking:policy-boundary. Given source-code is present and property-fuzz.shrinking is selected, pass only when the repository binding evaluates property-fuzz.shrinking and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent property fuzz concern. The ceiling is shrinking configuration validation only; declared policy does not prove running shrinking behavior. Choose a repository-owned check that observes shrinking from rig-services/testing.property-fuzz.shrinking.json..

Service-specific evidence cues:
Offer: Reduce a failing input while preserving both the failure and the relevant domain constraints. A smaller case that no longer triggers the defect is not a useful shrink result.
minimal: failure predicate — "parser crashes".
mid: preserved constraints — ["valid UTF-8"].
maximal: drop failure during shrink — false.
