# testing.e2e.cross-environment - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`cross-environment-source-code-boundary` owns `e2e.cross-environment`. Given source-code is present and e2e.cross-environment is selected, it passes only when the repository binding evaluates e2e.cross-environment and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent e2e concern. Evidence is recorded against `fixture:testing.e2e.cross-environment:policy-boundary`; absence never becomes a pass.
