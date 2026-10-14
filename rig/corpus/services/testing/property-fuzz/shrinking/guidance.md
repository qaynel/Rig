# shrinking

Reduce a failing input while preserving both the failure and the relevant domain constraints. A smaller case that no longer triggers the defect is not a useful shrink result.

Owned scope: `property-fuzz.shrinking`.

Offer: Reduce a failing input while preserving both the failure and the relevant domain constraints. A smaller case that no longer triggers the defect is not a useful shrink result.

Input: `rig-services/testing.property-fuzz.shrinking.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: shrinking configuration validation only; declared policy does not prove running shrinking behavior. Select an approved repository-owned command to verify that behavior.

minimal: failure predicate — "parser crashes".

mid: preserved constraints — ["valid UTF-8"].

maximal: drop failure during shrink — false.

