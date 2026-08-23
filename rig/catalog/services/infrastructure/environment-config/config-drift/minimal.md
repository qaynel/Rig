# infrastructure.environment-config.config-drift - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`config-drift-source-code-boundary` owns `environment-config.config-drift`. Given source-code is present and environment-config.config-drift is selected, it passes only when the repository binding evaluates environment-config.config-drift and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent environment config concern. Evidence is recorded against `fixture:infrastructure.environment-config.config-drift:policy-boundary`; absence never becomes a pass.
