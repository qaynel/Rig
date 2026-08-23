# testing.e2e.browser-automation - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`browser-automation-source-code-boundary` owns `e2e.browser-automation`. Given source-code is present and e2e.browser-automation is selected, it passes only when the repository binding evaluates e2e.browser-automation and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent e2e concern. Evidence is recorded against `fixture:testing.e2e.browser-automation:policy-boundary`; absence never becomes a pass.
