# testing.maintenance.readability-dry - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`readability-dry-source-code-boundary` owns `maintenance.readability-dry`. Given source-code is present and maintenance.readability-dry is selected, it passes only when the repository binding evaluates maintenance.readability-dry and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent maintenance concern. Evidence is recorded against `fixture:testing.maintenance.readability-dry:policy-boundary`; absence never becomes a pass.
