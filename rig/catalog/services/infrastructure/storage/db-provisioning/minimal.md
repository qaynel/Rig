# infrastructure.storage.db-provisioning - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`db-provisioning-source-code-boundary` owns `storage.db-provisioning`. Given source-code is present and storage.db-provisioning is selected, it passes only when the repository binding evaluates storage.db-provisioning and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent storage concern. Evidence is recorded against `fixture:infrastructure.storage.db-provisioning:policy-boundary`; absence never becomes a pass.
