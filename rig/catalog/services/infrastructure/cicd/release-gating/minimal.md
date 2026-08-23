# infrastructure.cicd.release-gating - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`release-gating-source-code-boundary` owns `cicd.release-gating`. Given source-code is present and cicd.release-gating is selected, it passes only when the repository binding evaluates cicd.release-gating and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent cicd concern. Evidence is recorded against `fixture:infrastructure.cicd.release-gating:policy-boundary`; absence never becomes a pass.
