# infrastructure.environment-config.secret-injection - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`secret-injection-source-code-boundary` owns `runtime-secret-injection`, `secret-injection-wiring`. Given source-code is present and runtime-secret-injection is selected, it passes only when the repository binding evaluates runtime-secret-injection and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent environment config concern. Evidence is recorded against `fixture:infrastructure.environment-config.secret-injection:policy-boundary`; absence never becomes a pass.
