# shrinking

Reduce a failing input while preserving both the failure and the relevant domain constraints. A smaller case that no longer triggers the defect is not a useful shrink result.

Owned scope: `property-fuzz.shrinking`. Input: `rig-services/testing.property-fuzz.shrinking.json`.

Coverage ceiling: Configuration validation only, so it confirms a failure predicate, preserved constraints and the drop-failure flag are declared; it does not shrink inputs.

minimal: failure predicate — "parser crashes". Declare the predicate that identifies the failure. A shrinker without it cannot tell failure from success, so write the check.

mid: preserved constraints — ["valid UTF-8"]. List the domain constraints a shrunk input must keep. Violating them yields invalid cases, so name each constraint.

maximal: drop failure during shrink — false. Set dropping the failure during shrink to false. A smaller input that no longer fails is useless, so keep the failure while reducing.
