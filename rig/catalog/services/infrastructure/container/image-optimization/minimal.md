# infrastructure.container.image-optimization - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`image-optimization-source-code-boundary` owns `container.image-optimization`. Given source-code is present and container.image-optimization is selected, it passes only when the repository binding evaluates container.image-optimization and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent container concern. Evidence is recorded against `fixture:infrastructure.container.image-optimization:policy-boundary`; absence never becomes a pass.
