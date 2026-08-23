# infrastructure.observability.metrics-dashboards - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`metrics-dashboards-source-code-boundary` owns `observability.metrics-dashboards`. Given source-code is present and observability.metrics-dashboards is selected, it passes only when the repository binding evaluates observability.metrics-dashboards and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent observability concern. Evidence is recorded against `fixture:infrastructure.observability.metrics-dashboards:policy-boundary`; absence never becomes a pass.
