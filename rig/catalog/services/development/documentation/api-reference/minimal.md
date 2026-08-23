# development.documentation.api-reference - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`api-reference-source-code-boundary` owns `documentation.api-reference`. Given source-code is present and documentation.api-reference is selected, it passes only when the repository binding evaluates documentation.api-reference and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent documentation concern. Evidence is recorded against `fixture:development.documentation.api-reference:policy-boundary`; absence never becomes a pass.
