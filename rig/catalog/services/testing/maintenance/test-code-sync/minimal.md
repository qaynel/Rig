# testing.maintenance.test-code-sync - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`test-code-sync-source-code-boundary` owns `maintenance.test-code-sync`. Given source-code is present and maintenance.test-code-sync is selected, it passes only when the repository binding evaluates maintenance.test-code-sync and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent maintenance concern. Evidence is recorded against `fixture:testing.maintenance.test-code-sync:policy-boundary`; absence never becomes a pass.
