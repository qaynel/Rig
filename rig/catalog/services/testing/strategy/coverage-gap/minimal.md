# testing.strategy.coverage-gap - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`coverage-gap-source-code-boundary` owns `strategy.coverage-gap`. Given source-code is present and strategy.coverage-gap is selected, it passes only when the repository binding evaluates strategy.coverage-gap and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent strategy concern. Evidence is recorded against `fixture:testing.strategy.coverage-gap:policy-boundary`; absence never becomes a pass.
