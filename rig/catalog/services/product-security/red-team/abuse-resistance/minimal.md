# product-security.red-team.abuse-resistance - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`abuse-resistance-source-code-boundary` owns `red-team.abuse-resistance`. Given source-code is present and red-team.abuse-resistance is selected, it passes only when the repository binding evaluates red-team.abuse-resistance and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent red team concern. Evidence is recorded against `fixture:product-security.red-team.abuse-resistance:policy-boundary`; absence never becomes a pass.
