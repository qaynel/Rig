# testing.property-fuzz.shrinking — identity

Policy grade: shrinking owns property-fuzz.shrinking. Reduce a failing input while preserving both the failure and the relevant domain constraints. A smaller case that no longer triggers the defect is not a useful shrink result.

Keep sibling services in property-fuzz under their own verdicts. Start from the configured input at `rig-services/testing.property-fuzz.shrinking.json`; malformed input is still attributed to that path.

Disposition: convention. Trace the verdict to the limit: shrinking configuration validation only; declared policy does not prove running shrinking behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.property-fuzz.shrinking:policy-boundary. Given source-code is present and property-fuzz.shrinking is selected, pass only when the repository binding evaluates property-fuzz.shrinking and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent property fuzz concern.

Service-specific evidence cues:
Reduce a failing input while preserving both the failure and the relevant domain constraints. A smaller case that no longer triggers the defect is not a useful shrink result.

Owned scope: `property-fuzz.shrinking`.

Offer: Reduce a failing input while preserving both the failure and the relevant domain constraints. A smaller case that no longer triggers the defect is not a useful shrink result.

Input: `rig-services/testing.property-fuzz.shrinking.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: shrinking configuration validation only; declared policy does not prove running shrinking behavior. Select an approved repository-owned command to verify that behavior.

minimal: failure predicate — "parser crashes".

mid: preserved constraints — ["valid UTF-8"].

maximal: drop failure during shrink — false.
