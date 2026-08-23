# testing.performance-load.load-stress-scripts - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`load-stress-scripts-source-code-boundary` owns `perf-load-test-authoring`, `load-stress-scripts`. Given source-code is present and perf-load-test-authoring is selected, it passes only when the repository binding evaluates perf-load-test-authoring and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent performance load concern. Evidence is recorded against `fixture:testing.performance-load.load-stress-scripts:policy-boundary`; absence never becomes a pass.
