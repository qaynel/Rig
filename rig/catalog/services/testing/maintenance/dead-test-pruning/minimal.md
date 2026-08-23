# testing.maintenance.dead-test-pruning - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`dead-test-pruning-source-code-boundary` owns `maintenance.dead-test-pruning`. Given source-code is present and maintenance.dead-test-pruning is selected, it passes only when the repository binding evaluates maintenance.dead-test-pruning and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent maintenance concern. Evidence is recorded against `fixture:testing.maintenance.dead-test-pruning:policy-boundary`; absence never becomes a pass.
