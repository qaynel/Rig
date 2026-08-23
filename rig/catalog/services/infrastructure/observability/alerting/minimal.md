# infrastructure.observability.alerting - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`alerting-source-code-boundary` owns `observability.alerting`. Given source-code is present and observability.alerting is selected, it passes only when the repository binding evaluates observability.alerting and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent observability concern. Evidence is recorded against `fixture:infrastructure.observability.alerting:policy-boundary`; absence never becomes a pass.
