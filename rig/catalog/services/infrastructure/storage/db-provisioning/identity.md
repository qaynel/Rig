# infrastructure.storage.db-provisioning - identity

Policy grade. This is generic baseline practice, not a claim of repository-tailored Context or Evidence coverage.

db provisioning is the sole catalogue owner of `storage.db-provisioning`. It must not absorb other storage concerns. Profile evidence is `source-code`.

Disposition: convention. Dependencies: none. First wire reuses an existing repository command, then a native platform feature, then an installed dependency; if none observes `storage.db-provisioning`, the result is a named nonzero coverage gap.

Acceptance target: fixture:infrastructure.storage.db-provisioning:policy-boundary. Given source-code is present and storage.db-provisioning is selected, pass only when the repository binding evaluates storage.db-provisioning and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent storage concern.
