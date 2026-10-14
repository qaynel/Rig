# testing.property-fuzz.shrinking — behavior-oracle slice

Policy grade slice. This slice bounds shrinking to property-fuzz.shrinking. It uses `shrinking-slice-behavior-oracle` and checks failure_predicate (nonempty): failure predicate must name the concrete repository contract..

Ground the decision in a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.property-fuzz.shrinking.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than shrinking configuration validation only; declared policy does not prove running shrinking behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Reduce a failing input while preserving both the failure and the relevant domain constraints. A smaller case that no longer triggers the defect is not a useful shrink result.

Owned scope: `property-fuzz.shrinking`.

Offer: Reduce a failing input while preserving both the failure and the relevant domain constraints. A smaller case that no longer triggers the defect is not a useful shrink result.

Input: `rig-services/testing.property-fuzz.shrinking.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: shrinking configuration validation only; declared policy does not prove running shrinking behavior. Select an approved repository-owned command to verify that behavior.

minimal: failure predicate — "parser crashes".

mid: preserved constraints — ["valid UTF-8"].

maximal: drop failure during shrink — false.
