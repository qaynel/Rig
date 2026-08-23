# product-security.secrets.precommit-leak-scanner - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`precommit-leak-scanner-source-code-boundary` owns `secrets.precommit-leak-scanner`. Given source-code is present and secrets.precommit-leak-scanner is selected, it passes only when the repository binding evaluates secrets.precommit-leak-scanner and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent secrets concern. Evidence is recorded against `fixture:product-security.secrets.precommit-leak-scanner:policy-boundary`; absence never becomes a pass.
