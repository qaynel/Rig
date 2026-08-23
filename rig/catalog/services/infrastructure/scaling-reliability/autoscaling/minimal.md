# infrastructure.scaling-reliability.autoscaling - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`autoscaling-source-code-boundary` owns `scaling-reliability.autoscaling`. Given source-code is present and scaling-reliability.autoscaling is selected, it passes only when the repository binding evaluates scaling-reliability.autoscaling and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent scaling reliability concern. Evidence is recorded against `fixture:infrastructure.scaling-reliability.autoscaling:policy-boundary`; absence never becomes a pass.
