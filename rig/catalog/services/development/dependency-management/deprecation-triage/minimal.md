# development.dependency-management.deprecation-triage - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`deprecation-triage-source-code-boundary` owns `dependency-management.deprecation-triage`. Given source-code is present and dependency-management.deprecation-triage is selected, it passes only when the repository binding evaluates dependency-management.deprecation-triage and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent dependency management concern. Evidence is recorded against `fixture:development.dependency-management.deprecation-triage:policy-boundary`; absence never becomes a pass.
