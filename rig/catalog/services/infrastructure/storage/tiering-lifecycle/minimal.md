# infrastructure.storage.tiering-lifecycle - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`tiering-lifecycle-source-code-boundary` owns `storage.tiering-lifecycle`. Given source-code is present and storage.tiering-lifecycle is selected, it passes only when the repository binding evaluates storage.tiering-lifecycle and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent storage concern. Evidence is recorded against `fixture:infrastructure.storage.tiering-lifecycle:policy-boundary`; absence never becomes a pass.
