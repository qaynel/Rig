# infrastructure.cicd.deployment-strategy - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`deployment-strategy-source-code-boundary` owns `cicd.deployment-strategy`. Given source-code is present and cicd.deployment-strategy is selected, it passes only when the repository binding evaluates cicd.deployment-strategy and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent cicd concern. Evidence is recorded against `fixture:infrastructure.cicd.deployment-strategy:policy-boundary`; absence never becomes a pass.
