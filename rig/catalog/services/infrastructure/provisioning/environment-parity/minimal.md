# infrastructure.provisioning.environment-parity - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`environment-parity-source-code-boundary` owns `provisioning.environment-parity`. Given source-code is present and provisioning.environment-parity is selected, it passes only when the repository binding evaluates provisioning.environment-parity and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent provisioning concern. Evidence is recorded against `fixture:infrastructure.provisioning.environment-parity:policy-boundary`; absence never becomes a pass.
