# infrastructure.environment-config.feature-flags - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`feature-flags-source-code-boundary` owns `environment-config.feature-flags`. Given source-code is present and environment-config.feature-flags is selected, it passes only when the repository binding evaluates environment-config.feature-flags and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent environment config concern. Evidence is recorded against `fixture:infrastructure.environment-config.feature-flags:policy-boundary`; absence never becomes a pass.
