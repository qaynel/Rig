# testing.property-fuzz.shrinking — identity

Policy grade: shrinking owns property-fuzz.shrinking. Reduce a failing input while preserving both the failure and the relevant domain constraints. A smaller case that no longer triggers the defect is not a useful shrink result.

Keep neighboring property-fuzz services outside the shrinking decision for property-fuzz.shrinking. Start from the configured input at `rig-services/testing.property-fuzz.shrinking.json`; malformed input is still attributed to that path.

Disposition: convention. Trace the verdict to the limit: shrinking configuration validation only; declared policy does not prove running shrinking behavior. Choose a repository-owned check that observes shrinking from rig-services/testing.property-fuzz.shrinking.json.

Acceptance target: fixture:testing.property-fuzz.shrinking:policy-boundary. Given source-code is present and property-fuzz.shrinking is selected, pass only when the repository binding evaluates property-fuzz.shrinking and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent property fuzz concern.

Service-specific evidence cues:
Offer: Reduce a failing input while preserving both the failure and the relevant domain constraints. A smaller case that no longer triggers the defect is not a useful shrink result.
minimal: failure predicate — "parser crashes".
mid: preserved constraints — ["valid UTF-8"].
maximal: drop failure during shrink — false.
