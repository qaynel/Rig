# product-security.red-team.dast — floor and mutation-floor slice

Policy grade slice. This slice bounds dast to red-team.dast. It uses `dast-slice-floor` and checks target_origin (nonempty): target origin must name the concrete repository contract..

Trace the verdict to a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/product-security.red-team.dast.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than dast configuration validation only; declared policy does not prove running dast behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Dynamic security testing needs a specifically authorized target and path scope. A declared target does not prove a live scan; missing scanner or credentials must remain visible.

Owned scope: `red-team.dast`.

Offer: Dynamic security testing needs a specifically authorized target and path scope. A declared target does not prove a live scan; missing scanner or credentials must remain visible.

Input: `rig-services/product-security.red-team.dast.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: dast configuration validation only; declared policy does not prove running dast behavior. Select an approved repository-owned command to verify that behavior.

minimal: target origin — "http://127.0.0.1:8080".

mid: authorized scope — ["/api"].

maximal: scan unapproved targets — false.
