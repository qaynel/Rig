# infrastructure.disaster-recovery.dr-runbooks - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`dr-runbooks-source-code-boundary` owns `disaster-recovery.dr-runbooks`. Given source-code is present and disaster-recovery.dr-runbooks is selected, it passes only when the repository binding evaluates disaster-recovery.dr-runbooks and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent disaster recovery concern. Evidence is recorded against `fixture:infrastructure.disaster-recovery.dr-runbooks:policy-boundary`; absence never becomes a pass.
