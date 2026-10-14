# product-security.license-compliance.policy-conflict — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for policy conflict. It checks allowed_licenses (nonempty): allowed licenses must name the concrete repository contract.. Binding checks: policy-conflict-source-code-boundary.

Ground the decision in a repository-owned command or existing native check that can observe license-compliance.policy-conflict; bind it to the input named in `rig-services/product-security.license-compliance.policy-conflict.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside license-compliance.policy-conflict is a failure.

Acceptance target: fixture:product-security.license-compliance.policy-conflict:policy-boundary. Given source-code is present and license-compliance.policy-conflict is selected, pass only when the repository binding evaluates license-compliance.policy-conflict and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent license compliance concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Evaluate component licenses against the explicit distribution policy. Conflicting or unknown licensing needs review rather than silently expanding the allow list.

Owned scope: `license-compliance.policy-conflict`.

Offer: Evaluate component licenses against the explicit distribution policy. Conflicting or unknown licensing needs review rather than silently expanding the allow list.

Input: `rig-services/product-security.license-compliance.policy-conflict.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: policy conflict configuration validation only; declared policy does not prove running policy conflict behavior. Select an approved repository-owned command to verify that behavior.

minimal: allowed licenses — ["MIT","Apache-2.0"].

mid: restricted licenses — ["AGPL-3.0-only"].

maximal: ignore license conflicts — false.
