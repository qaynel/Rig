# infrastructure.networking.dns-discovery - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`dns-discovery-source-code-boundary` owns `networking.dns-discovery`. Given source-code is present and networking.dns-discovery is selected, it passes only when the repository binding evaluates networking.dns-discovery and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent networking concern. Evidence is recorded against `fixture:infrastructure.networking.dns-discovery:policy-boundary`; absence never becomes a pass.
