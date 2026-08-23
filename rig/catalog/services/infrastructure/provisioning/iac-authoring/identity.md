# infrastructure.provisioning.iac-authoring - identity

Policy grade. This is generic baseline practice, not a claim of repository-tailored Context or Evidence coverage.

iac authoring is the sole catalogue owner of `provisioning.iac-authoring`. It must not absorb other provisioning concerns. Profile evidence is `source-code`.

Disposition: convention. Dependencies: none. First wire reuses an existing repository command, then a native platform feature, then an installed dependency; if none observes `provisioning.iac-authoring`, the result is a named nonzero coverage gap.

Acceptance target: fixture:infrastructure.provisioning.iac-authoring:policy-boundary. Given source-code is present and provisioning.iac-authoring is selected, pass only when the repository binding evaluates provisioning.iac-authoring and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent provisioning concern.
