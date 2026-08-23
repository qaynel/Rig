# development.code-quality.correctness-static - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`correctness-static-source-code-boundary` owns `correctness-static-analysis`, `complexity-static`. Given source-code is present and correctness-static-analysis is selected, it passes only when the repository binding evaluates correctness-static-analysis and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims security-sast. Evidence is recorded against `fixture:development.code-quality.correctness-static:policy-boundary`; absence never becomes a pass.
