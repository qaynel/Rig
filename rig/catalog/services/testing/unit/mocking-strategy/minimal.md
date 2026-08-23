# testing.unit.mocking-strategy - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`mocking-strategy-source-code-boundary` owns `unit.mocking-strategy`. Given source-code is present and unit.mocking-strategy is selected, it passes only when the repository binding evaluates unit.mocking-strategy and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent unit concern. Evidence is recorded against `fixture:testing.unit.mocking-strategy:policy-boundary`; absence never becomes a pass.
