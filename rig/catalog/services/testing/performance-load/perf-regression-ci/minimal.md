# testing.performance-load.perf-regression-ci - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`perf-regression-ci-source-code-boundary` owns `performance-load.perf-regression-ci`. Given source-code is present and performance-load.perf-regression-ci is selected, it passes only when the repository binding evaluates performance-load.perf-regression-ci and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent performance load concern. Evidence is recorded against `fixture:testing.performance-load.perf-regression-ci:policy-boundary`; absence never becomes a pass.
