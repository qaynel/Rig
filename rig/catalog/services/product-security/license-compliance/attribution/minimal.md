# product-security.license-compliance.attribution - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`attribution-source-code-boundary` owns `license-compliance.attribution`. Given source-code is present and license-compliance.attribution is selected, it passes only when the repository binding evaluates license-compliance.attribution and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent license compliance concern. Evidence is recorded against `fixture:product-security.license-compliance.attribution:policy-boundary`; absence never becomes a pass.
