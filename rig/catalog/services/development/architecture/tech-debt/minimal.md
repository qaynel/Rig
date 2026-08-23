# development.architecture.tech-debt - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`tech-debt-source-code-boundary` owns `architecture.tech-debt`. Given source-code is present and architecture.tech-debt is selected, it passes only when the repository binding evaluates architecture.tech-debt and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent architecture concern. Evidence is recorded against `fixture:development.architecture.tech-debt:policy-boundary`; absence never becomes a pass.
