# infrastructure.scaling-reliability.chaos-engineering - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`chaos-engineering-source-code-boundary` owns `scaling-reliability.chaos-engineering`. Given source-code is present and scaling-reliability.chaos-engineering is selected, it passes only when the repository binding evaluates scaling-reliability.chaos-engineering and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent scaling reliability concern. Evidence is recorded against `fixture:infrastructure.scaling-reliability.chaos-engineering:policy-boundary`; absence never becomes a pass.
