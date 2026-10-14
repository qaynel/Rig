# development.debugging.structured-debugging — behavior-oracle slice

Policy grade slice. This slice bounds structured debugging to debugging.structured-debugging. It uses `structured-debugging-slice-behavior-oracle` and checks reproduction_steps (nonempty): reproduction steps must name the concrete repository contract..

Ground the decision in a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/development.debugging.structured-debugging.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than structured debugging configuration validation only; declared policy does not prove running structured debugging behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Capture a repeatable failure before changing code and rank hypotheses from evidence. One experiment should separate explanations; speculative fixes before reproduction erase useful evidence.

Owned scope: `debugging.structured-debugging`.

Offer: Capture a repeatable failure before changing code and rank hypotheses from evidence. One experiment should separate explanations; speculative fixes before reproduction erase useful evidence.

Input: `rig-services/development.debugging.structured-debugging.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: structured debugging configuration validation only; declared policy does not prove running structured debugging behavior. Select an approved repository-owned command to verify that behavior.

minimal: reproduction steps — ["run failing case"].

mid: ranked hypotheses — ["invalid input reaches parser"].

maximal: change before reproduction — false.
