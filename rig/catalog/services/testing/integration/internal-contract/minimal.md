# testing.integration.internal-contract - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`internal-contract-source-code-boundary` owns `integration.internal-contract`. Given source-code is present and integration.internal-contract is selected, it passes only when the repository binding evaluates integration.internal-contract and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent integration concern. Evidence is recorded against `fixture:testing.integration.internal-contract:policy-boundary`; absence never becomes a pass.
