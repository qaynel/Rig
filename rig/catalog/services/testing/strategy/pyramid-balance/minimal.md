# testing.strategy.pyramid-balance - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`pyramid-balance-source-code-boundary` owns `strategy.pyramid-balance`. Given source-code is present and strategy.pyramid-balance is selected, it passes only when the repository binding evaluates strategy.pyramid-balance and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent strategy concern. Evidence is recorded against `fixture:testing.strategy.pyramid-balance:policy-boundary`; absence never becomes a pass.
