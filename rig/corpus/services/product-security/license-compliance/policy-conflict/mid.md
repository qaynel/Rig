# product-security.license-compliance.policy-conflict — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for policy conflict; it does not widen ownership beyond license-compliance.policy-conflict. For policy conflict, inspect these context signals: restricted_licenses. Binding checks: policy-conflict-license-compliance-context.

Use the existing repository's policy conflict convention, then name the source path or command that establishes it. For policy conflict, inspect the repository's actual spec, source, test, or configuration for restricted_licenses; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring license-compliance services outside the policy conflict decision for license-compliance.policy-conflict.

Acceptance target: fixture:product-security.license-compliance.policy-conflict:repository-context. Given license-compliance.policy-conflict has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent license compliance concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Evaluate component licenses against the explicit distribution policy. Conflicting or unknown licensing needs review rather than silently expanding the allow list.
minimal: allowed licenses — ["MIT","Apache-2.0"].
mid: restricted licenses — ["AGPL-3.0-only"].
maximal: ignore license conflicts — false.
