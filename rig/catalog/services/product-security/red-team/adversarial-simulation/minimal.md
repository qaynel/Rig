# product-security.red-team.adversarial-simulation - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`adversarial-simulation-source-code-boundary` owns `red-team.adversarial-simulation`. Given source-code is present and red-team.adversarial-simulation is selected, it passes only when the repository binding evaluates red-team.adversarial-simulation and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent red team concern. Evidence is recorded against `fixture:product-security.red-team.adversarial-simulation:policy-boundary`; absence never becomes a pass.
