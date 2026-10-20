# structured debugging

Capture a repeatable failure before changing code and rank hypotheses from evidence. One experiment should separate explanations; speculative fixes before reproduction erase useful evidence.

Owned scope: `debugging.structured-debugging`.

Offer: Capture a repeatable failure before changing code and rank hypotheses from evidence. One experiment should separate explanations; speculative fixes before reproduction erase useful evidence.

Input: `rig-services/development.debugging.structured-debugging.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: structured debugging configuration validation only; declared policy does not prove running structured debugging behavior. Select an approved repository-owned command to verify that behavior.

minimal: reproduction steps — ["run failing case"].

mid: ranked hypotheses — ["invalid input reaches parser"].

maximal: change before reproduction — false.
