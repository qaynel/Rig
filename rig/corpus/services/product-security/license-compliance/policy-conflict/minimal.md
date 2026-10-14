# product-security.license-compliance.policy-conflict — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for policy conflict. The minimal boundary for policy conflict checks allowed_licenses (nonempty): allowed licenses must name the concrete repository contract.. Binding checks: policy-conflict-source-code-boundary.

Ground the decision in a repository-owned command or existing native check that can observe license-compliance.policy-conflict; bind it to the input named in `rig-services/product-security.license-compliance.policy-conflict.json` and preserve the check's failure status. When adopting this in an existing repository, connect policy conflict to the command that inspects allowed_licenses and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside license-compliance.policy-conflict as a failure.

Acceptance target: fixture:product-security.license-compliance.policy-conflict:policy-boundary. Given source-code is present and license-compliance.policy-conflict is selected, pass only when the repository binding evaluates license-compliance.policy-conflict and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent license compliance concern. The ceiling is policy conflict configuration validation only; declared policy does not prove running policy conflict behavior. Choose a repository-owned check that observes policy conflict from rig-services/product-security.license-compliance.policy-conflict.json..

Service-specific evidence cues:
Offer: Evaluate component licenses against the explicit distribution policy. Conflicting or unknown licensing needs review rather than silently expanding the allow list.
minimal: allowed licenses — ["MIT","Apache-2.0"].
mid: restricted licenses — ["AGPL-3.0-only"].
maximal: ignore license conflicts — false.
