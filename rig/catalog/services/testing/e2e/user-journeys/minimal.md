# testing.e2e.user-journeys - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`user-journeys-source-code-boundary` owns `e2e.user-journeys`. Given source-code is present and e2e.user-journeys is selected, it passes only when the repository binding evaluates e2e.user-journeys and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent e2e concern. Evidence is recorded against `fixture:testing.e2e.user-journeys:policy-boundary`; absence never becomes a pass.
