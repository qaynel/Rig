# infrastructure.disaster-recovery.rto-rpo - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`rto-rpo-source-code-boundary` owns `disaster-recovery.rto-rpo`. Given source-code is present and disaster-recovery.rto-rpo is selected, it passes only when the repository binding evaluates disaster-recovery.rto-rpo and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent disaster recovery concern. Evidence is recorded against `fixture:infrastructure.disaster-recovery.rto-rpo:policy-boundary`; absence never becomes a pass.
