# testing.mutation.score-metrics - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`score-metrics-source-code-boundary` owns `mutation.score-metrics`. Given source-code is present and mutation.score-metrics is selected, it passes only when the repository binding evaluates mutation.score-metrics and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent mutation concern. Evidence is recorded against `fixture:testing.mutation.score-metrics:policy-boundary`; absence never becomes a pass.
