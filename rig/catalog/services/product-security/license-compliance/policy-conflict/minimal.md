# product-security.license-compliance.policy-conflict - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`policy-conflict-source-code-boundary` owns `license-compliance.policy-conflict`. Given source-code is present and license-compliance.policy-conflict is selected, it passes only when the repository binding evaluates license-compliance.policy-conflict and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent license compliance concern. Evidence is recorded against `fixture:product-security.license-compliance.policy-conflict:policy-boundary`; absence never becomes a pass.
