# infrastructure.disaster-recovery.failover - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`failover-source-code-boundary` owns `disaster-recovery.failover`. Given source-code is present and disaster-recovery.failover is selected, it passes only when the repository binding evaluates disaster-recovery.failover and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent disaster recovery concern. Evidence is recorded against `fixture:infrastructure.disaster-recovery.failover:policy-boundary`; absence never becomes a pass.
