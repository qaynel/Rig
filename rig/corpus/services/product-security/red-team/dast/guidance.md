# dast

Dynamic security testing needs a specifically authorized target and path scope. A declared target does not prove a live scan; missing scanner or credentials must remain visible.

Owned scope: `red-team.dast`.

Offer: Dynamic security testing needs a specifically authorized target and path scope. A declared target does not prove a live scan; missing scanner or credentials must remain visible.

Input: `rig-services/product-security.red-team.dast.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: dast configuration validation only; declared policy does not prove running dast behavior. Select an approved repository-owned command to verify that behavior.

minimal: target origin — "http://127.0.0.1:8080".

mid: authorized scope — ["/api"].

maximal: scan unapproved targets — false.

