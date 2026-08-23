# infrastructure.cicd.pipeline-definition - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`pipeline-definition-source-code-boundary` owns `cicd.pipeline-definition`. Given source-code is present and cicd.pipeline-definition is selected, it passes only when the repository binding evaluates cicd.pipeline-definition and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent cicd concern. Evidence is recorded against `fixture:infrastructure.cicd.pipeline-definition:policy-boundary`; absence never becomes a pass.
