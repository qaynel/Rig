# development.repo-hygiene.stale-cleanup - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`stale-cleanup-source-code-boundary` owns `repo-hygiene.stale-cleanup`. Given source-code is present and repo-hygiene.stale-cleanup is selected, it passes only when the repository binding evaluates repo-hygiene.stale-cleanup and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent repo hygiene concern. Evidence is recorded against `fixture:development.repo-hygiene.stale-cleanup:policy-boundary`; absence never becomes a pass.
