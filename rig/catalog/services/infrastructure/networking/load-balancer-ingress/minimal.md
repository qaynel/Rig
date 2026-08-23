# infrastructure.networking.load-balancer-ingress - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`load-balancer-ingress-source-code-boundary` owns `networking.load-balancer-ingress`. Given source-code is present and networking.load-balancer-ingress is selected, it passes only when the repository binding evaluates networking.load-balancer-ingress and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent networking concern. Evidence is recorded against `fixture:infrastructure.networking.load-balancer-ingress:policy-boundary`; absence never becomes a pass.
