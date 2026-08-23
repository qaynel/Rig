# product-security.license-compliance.license-diff - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`license-diff-source-code-boundary` owns `license-compliance.license-diff`. Given source-code is present and license-compliance.license-diff is selected, it passes only when the repository binding evaluates license-compliance.license-diff and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent license compliance concern. Evidence is recorded against `fixture:product-security.license-compliance.license-diff:policy-boundary`; absence never becomes a pass.
