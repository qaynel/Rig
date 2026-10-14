# development.repo-hygiene.status-updates — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for status updates; it does not widen ownership beyond repo-hygiene.status-updates. The context signals are in_flight. Binding checks: status-updates-repo-hygiene-context.

Trace the verdict to the existing repository's status updates convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in repo-hygiene under their own verdicts.

Acceptance target: fixture:development.repo-hygiene.status-updates:repository-context. Given repo-hygiene.status-updates has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent repo hygiene concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Report observed progress, the work in flight and the next resolving action. Distinguish finished evidence from intended work so another contributor can resume accurately.

Owned scope: `repo-hygiene.status-updates`.

Offer: Report observed progress, the work in flight and the next resolving action. Distinguish finished evidence from intended work so another contributor can resume accurately.

Input: `rig-services/development.repo-hygiene.status-updates.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: status updates configuration validation only; declared policy does not prove running status updates behavior. Select an approved repository-owned command to verify that behavior.

minimal: completed — ["parser regression reproduced"].

mid: in flight — ["shared boundary fix"].

maximal: next action — "run parser regression".
