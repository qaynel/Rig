# development.code-quality.typecheck - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`typecheck-source-code-boundary` owns `code-quality.typecheck`. Given source-code is present and code-quality.typecheck is selected, it passes only when the repository binding evaluates code-quality.typecheck and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent code quality concern. Evidence is recorded against `fixture:development.code-quality.typecheck:policy-boundary`; absence never becomes a pass.
