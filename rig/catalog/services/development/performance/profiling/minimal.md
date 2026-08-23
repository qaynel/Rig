# development.performance.profiling - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`profiling-source-code-boundary` owns `code-profiling`, `bottleneck-identification`. Given source-code is present and code-profiling is selected, it passes only when the repository binding evaluates code-profiling and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent performance concern. Evidence is recorded against `fixture:development.performance.profiling:policy-boundary`; absence never becomes a pass.
