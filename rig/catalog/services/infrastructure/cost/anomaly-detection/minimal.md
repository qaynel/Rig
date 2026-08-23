# infrastructure.cost.anomaly-detection - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`anomaly-detection-source-code-boundary` owns `cost.anomaly-detection`. Given source-code is present and cost.anomaly-detection is selected, it passes only when the repository binding evaluates cost.anomaly-detection and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent cost concern. Evidence is recorded against `fixture:infrastructure.cost.anomaly-detection:policy-boundary`; absence never becomes a pass.
