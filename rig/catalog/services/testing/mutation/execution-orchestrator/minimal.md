# testing.mutation.execution-orchestrator - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`execution-orchestrator-source-code-boundary` owns `mutation.execution-orchestrator`. Given source-code is present and mutation.execution-orchestrator is selected, it passes only when the repository binding evaluates mutation.execution-orchestrator and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent mutation concern. Evidence is recorded against `fixture:testing.mutation.execution-orchestrator:policy-boundary`; absence never becomes a pass.
