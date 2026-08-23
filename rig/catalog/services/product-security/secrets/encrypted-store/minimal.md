# product-security.secrets.encrypted-store - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`encrypted-store-source-code-boundary` owns `secrets.encrypted-store`. Given source-code is present and secrets.encrypted-store is selected, it passes only when the repository binding evaluates secrets.encrypted-store and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent secrets concern. Evidence is recorded against `fixture:product-security.secrets.encrypted-store:policy-boundary`; absence never becomes a pass.
