# infrastructure.networking.vpc-firewall - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`vpc-firewall-source-code-boundary` owns `networking.vpc-firewall`. Given source-code is present and networking.vpc-firewall is selected, it passes only when the repository binding evaluates networking.vpc-firewall and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent networking concern. Evidence is recorded against `fixture:infrastructure.networking.vpc-firewall:policy-boundary`; absence never becomes a pass.
