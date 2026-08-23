# development.code-quality.code-review - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`code-review-source-code-boundary` owns `code-quality.code-review`. Given source-code is present and code-quality.code-review is selected, it passes only when the repository binding evaluates code-quality.code-review and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent code quality concern. Evidence is recorded against `fixture:development.code-quality.code-review:policy-boundary`; absence never becomes a pass.
