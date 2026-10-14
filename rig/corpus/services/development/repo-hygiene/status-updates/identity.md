# development.repo-hygiene.status-updates — identity

Policy grade: status updates owns repo-hygiene.status-updates. Report observed progress, the work in flight and the next resolving action. Distinguish finished evidence from intended work so another contributor can resume accurately.

Keep sibling services in repo-hygiene under their own verdicts. Ground the decision in the configured input at `rig-services/development.repo-hygiene.status-updates.json`; malformed input is still attributed to that path.

Disposition: convention. Use the limit: status updates configuration validation only; declared policy does not prove running status updates behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.repo-hygiene.status-updates:policy-boundary. Given source-code is present and repo-hygiene.status-updates is selected, pass only when the repository binding evaluates repo-hygiene.status-updates and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent repo hygiene concern.

Service-specific evidence cues:
Report observed progress, the work in flight and the next resolving action. Distinguish finished evidence from intended work so another contributor can resume accurately.

Owned scope: `repo-hygiene.status-updates`.

Offer: Report observed progress, the work in flight and the next resolving action. Distinguish finished evidence from intended work so another contributor can resume accurately.

Input: `rig-services/development.repo-hygiene.status-updates.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: status updates configuration validation only; declared policy does not prove running status updates behavior. Select an approved repository-owned command to verify that behavior.

minimal: completed — ["parser regression reproduced"].

mid: in flight — ["shared boundary fix"].

maximal: next action — "run parser regression".
