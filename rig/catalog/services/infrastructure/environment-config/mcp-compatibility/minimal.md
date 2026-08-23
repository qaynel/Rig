# infrastructure.environment-config.mcp-compatibility - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`mcp-compatibility-source-code-boundary` owns `environment-config.mcp-compatibility`. Given source-code is present and environment-config.mcp-compatibility is selected, it passes only when the repository binding evaluates environment-config.mcp-compatibility and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent environment config concern. Evidence is recorded against `fixture:infrastructure.environment-config.mcp-compatibility:policy-boundary`; absence never becomes a pass.
