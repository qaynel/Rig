# testing.strategy.risk-prioritization - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`test-priority-ranking-source-code-boundary` owns `strategy.risk-prioritization`. Given source-code is present and strategy.risk-prioritization is selected, it passes only when the repository binding evaluates strategy.risk-prioritization and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent strategy concern. Evidence is recorded against `fixture:testing.strategy.risk-prioritization:policy-boundary`; absence never becomes a pass.
