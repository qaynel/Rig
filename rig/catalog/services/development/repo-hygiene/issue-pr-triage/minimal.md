# development.repo-hygiene.issue-pr-triage - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`issue-pr-triage-source-code-boundary` owns `repo-hygiene.issue-pr-triage`. Given source-code is present and repo-hygiene.issue-pr-triage is selected, it passes only when the repository binding evaluates repo-hygiene.issue-pr-triage and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent repo hygiene concern. Evidence is recorded against `fixture:development.repo-hygiene.issue-pr-triage:policy-boundary`; absence never becomes a pass.
