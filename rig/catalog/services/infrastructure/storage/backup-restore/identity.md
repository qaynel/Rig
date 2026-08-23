# infrastructure.storage.backup-restore - identity

Policy grade. This is generic baseline practice, not a claim of repository-tailored Context or Evidence coverage.

backup restore is the sole catalogue owner of `storage.backup-restore`. It must not absorb other storage concerns. Profile evidence is `source-code`.

Disposition: convention. Dependencies: none. First wire reuses an existing repository command, then a native platform feature, then an installed dependency; if none observes `storage.backup-restore`, the result is a named nonzero coverage gap.

Acceptance target: fixture:infrastructure.storage.backup-restore:policy-boundary. Given source-code is present and storage.backup-restore is selected, pass only when the repository binding evaluates storage.backup-restore and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent storage concern.
