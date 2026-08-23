# testing.flaky-reliability.intermittent-rca - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`intermittent-rca-source-code-boundary` owns `flaky-reliability.intermittent-rca`. Given source-code is present and flaky-reliability.intermittent-rca is selected, it passes only when the repository binding evaluates flaky-reliability.intermittent-rca and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent flaky reliability concern. Evidence is recorded against `fixture:testing.flaky-reliability.intermittent-rca:policy-boundary`; absence never becomes a pass.
