# product-security.license-compliance.policy-conflict — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for policy conflict; it does not widen ownership beyond license-compliance.policy-conflict. The context signals are restricted_licenses. Binding checks: policy-conflict-license-compliance-context.

Use the existing repository's policy conflict convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in license-compliance under their own verdicts.

Acceptance target: fixture:product-security.license-compliance.policy-conflict:repository-context. Given license-compliance.policy-conflict has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent license compliance concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Evaluate component licenses against the explicit distribution policy. Conflicting or unknown licensing needs review rather than silently expanding the allow list.

Owned scope: `license-compliance.policy-conflict`.

Offer: Evaluate component licenses against the explicit distribution policy. Conflicting or unknown licensing needs review rather than silently expanding the allow list.

Input: `rig-services/product-security.license-compliance.policy-conflict.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: policy conflict configuration validation only; declared policy does not prove running policy conflict behavior. Select an approved repository-owned command to verify that behavior.

minimal: allowed licenses — ["MIT","Apache-2.0"].

mid: restricted licenses — ["AGPL-3.0-only"].

maximal: ignore license conflicts — false.
