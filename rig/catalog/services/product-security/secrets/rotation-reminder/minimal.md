# product-security.secrets.rotation-reminder - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`rotation-reminder-source-code-boundary` owns `secrets.rotation-reminder`. Given source-code is present and secrets.rotation-reminder is selected, it passes only when the repository binding evaluates secrets.rotation-reminder and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent secrets concern. Evidence is recorded against `fixture:product-security.secrets.rotation-reminder:policy-boundary`; absence never becomes a pass.
