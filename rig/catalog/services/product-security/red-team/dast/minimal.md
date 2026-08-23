# product-security.red-team.dast - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`dast-source-code-boundary` owns `red-team.dast`. Given source-code is present and red-team.dast is selected, it passes only when the repository binding evaluates red-team.dast and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent red team concern. Evidence is recorded against `fixture:product-security.red-team.dast:policy-boundary`; absence never becomes a pass.
