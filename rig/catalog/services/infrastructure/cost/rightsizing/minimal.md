# infrastructure.cost.rightsizing - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`rightsizing-source-code-boundary` owns `cost.rightsizing`. Given source-code is present and cost.rightsizing is selected, it passes only when the repository binding evaluates cost.rightsizing and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent cost concern. Evidence is recorded against `fixture:infrastructure.cost.rightsizing:policy-boundary`; absence never becomes a pass.
