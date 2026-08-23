# infrastructure.storage.backup-restore - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`backup-restore-source-code-boundary` owns `storage.backup-restore`. Given source-code is present and storage.backup-restore is selected, it passes only when the repository binding evaluates storage.backup-restore and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent storage concern. Evidence is recorded against `fixture:infrastructure.storage.backup-restore:policy-boundary`; absence never becomes a pass.
