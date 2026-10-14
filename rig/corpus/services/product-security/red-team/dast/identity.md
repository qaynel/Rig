# product-security.red-team.dast — identity

Policy grade: dast owns red-team.dast. Dynamic security testing needs a specifically authorized target and path scope. A declared target does not prove a live scan; missing scanner or credentials must remain visible.

Keep sibling services in red-team under their own verdicts. Anchor the review on the configured input at `rig-services/product-security.red-team.dast.json`; malformed input is still attributed to that path.

Disposition: convention. Inspect the limit: dast configuration validation only; declared policy does not prove running dast behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:product-security.red-team.dast:policy-boundary. Given source-code is present and red-team.dast is selected, pass only when the repository binding evaluates red-team.dast and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent red team concern.

Service-specific evidence cues:
Dynamic security testing needs a specifically authorized target and path scope. A declared target does not prove a live scan; missing scanner or credentials must remain visible.

Owned scope: `red-team.dast`.

Offer: Dynamic security testing needs a specifically authorized target and path scope. A declared target does not prove a live scan; missing scanner or credentials must remain visible.

Input: `rig-services/product-security.red-team.dast.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: dast configuration validation only; declared policy does not prove running dast behavior. Select an approved repository-owned command to verify that behavior.

minimal: target origin — "http://127.0.0.1:8080".

mid: authorized scope — ["/api"].

maximal: scan unapproved targets — false.
