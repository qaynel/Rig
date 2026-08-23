# infrastructure.container.k8s-helm - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`k8s-helm-source-code-boundary` owns `container.k8s-helm`. Given source-code is present and container.k8s-helm is selected, it passes only when the repository binding evaluates container.k8s-helm and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent container concern. Evidence is recorded against `fixture:infrastructure.container.k8s-helm:policy-boundary`; absence never becomes a pass.
