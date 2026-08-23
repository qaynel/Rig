# infrastructure.scaling-reliability.capacity-load - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`capacity-load-source-code-boundary` owns `scaling-reliability.capacity-load`. Given source-code is present and scaling-reliability.capacity-load is selected, it passes only when the repository binding evaluates scaling-reliability.capacity-load and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent scaling reliability concern. Evidence is recorded against `fixture:infrastructure.scaling-reliability.capacity-load:policy-boundary`; absence never becomes a pass.
