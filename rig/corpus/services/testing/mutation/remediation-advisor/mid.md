# testing.mutation.remediation-advisor — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for remediation advisor; it does not widen ownership beyond mutation.remediation-advisor. The context signals are target_behaviors. Binding checks: remediation-advisor-mutation-context.

Anchor the review on the existing repository's remediation advisor convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in mutation under their own verdicts.

Acceptance target: fixture:testing.mutation.remediation-advisor:repository-context. Given mutation.remediation-advisor has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent mutation concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Propose new behavioral assertions for the specific survived mutation. Tests that reproduce the implementation algorithm share its mistake instead of exposing it.

Owned scope: `mutation.remediation-advisor`.

Offer: Propose new behavioral assertions for the specific survived mutation. Tests that reproduce the implementation algorithm share its mistake instead of exposing it.

Input: `rig-services/testing.mutation.remediation-advisor.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: remediation advisor configuration validation only; declared policy does not prove running remediation advisor behavior. Select an approved repository-owned command to verify that behavior.

minimal: remediation cases — ["reject exact upper limit"].

mid: target behaviors — ["limit enforcement"].

maximal: add implementation mirrors — false.
