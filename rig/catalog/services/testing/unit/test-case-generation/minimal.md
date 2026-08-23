# testing.unit.test-case-generation - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`test-case-generation-source-code-boundary` owns `unit.test-case-generation`. Given source-code is present and unit.test-case-generation is selected, it passes only when the repository binding evaluates unit.test-case-generation and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent unit concern. Evidence is recorded against `fixture:testing.unit.test-case-generation:policy-boundary`; absence never becomes a pass.
