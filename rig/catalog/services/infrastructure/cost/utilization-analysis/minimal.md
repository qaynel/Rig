# infrastructure.cost.utilization-analysis - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`utilization-analysis-source-code-boundary` owns `cost.utilization-analysis`. Given source-code is present and cost.utilization-analysis is selected, it passes only when the repository binding evaluates cost.utilization-analysis and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent cost concern. Evidence is recorded against `fixture:infrastructure.cost.utilization-analysis:policy-boundary`; absence never becomes a pass.
