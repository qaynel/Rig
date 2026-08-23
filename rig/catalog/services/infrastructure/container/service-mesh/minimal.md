# infrastructure.container.service-mesh - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`service-mesh-source-code-boundary` owns `container.service-mesh`. Given source-code is present and container.service-mesh is selected, it passes only when the repository binding evaluates container.service-mesh and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent container concern. Evidence is recorded against `fixture:infrastructure.container.service-mesh:policy-boundary`; absence never becomes a pass.
