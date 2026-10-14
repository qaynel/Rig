# testing.property-fuzz.shrinking — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for shrinking. It checks failure_predicate (nonempty): failure predicate must name the concrete repository contract.. Binding checks: shrinking-source-code-boundary.

Anchor the review on a repository-owned command or existing native check that can observe property-fuzz.shrinking; bind it to the input named in `rig-services/testing.property-fuzz.shrinking.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside property-fuzz.shrinking is a failure.

Acceptance target: fixture:testing.property-fuzz.shrinking:policy-boundary. Given source-code is present and property-fuzz.shrinking is selected, pass only when the repository binding evaluates property-fuzz.shrinking and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent property fuzz concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Reduce a failing input while preserving both the failure and the relevant domain constraints. A smaller case that no longer triggers the defect is not a useful shrink result.

Owned scope: `property-fuzz.shrinking`.

Offer: Reduce a failing input while preserving both the failure and the relevant domain constraints. A smaller case that no longer triggers the defect is not a useful shrink result.

Input: `rig-services/testing.property-fuzz.shrinking.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: shrinking configuration validation only; declared policy does not prove running shrinking behavior. Select an approved repository-owned command to verify that behavior.

minimal: failure predicate — "parser crashes".

mid: preserved constraints — ["valid UTF-8"].

maximal: drop failure during shrink — false.
