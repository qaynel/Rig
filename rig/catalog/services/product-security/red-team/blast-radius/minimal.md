# product-security.red-team.blast-radius - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`blast-radius-source-code-boundary` owns `red-team.blast-radius`. Given source-code is present and red-team.blast-radius is selected, it passes only when the repository binding evaluates red-team.blast-radius and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent red team concern. Evidence is recorded against `fixture:product-security.red-team.blast-radius:policy-boundary`; absence never becomes a pass.
