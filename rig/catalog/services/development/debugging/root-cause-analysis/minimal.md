# development.debugging.root-cause-analysis - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`root-cause-analysis-source-code-boundary` owns `debugging.root-cause-analysis`. Given source-code is present and debugging.root-cause-analysis is selected, it passes only when the repository binding evaluates debugging.root-cause-analysis and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent debugging concern. Evidence is recorded against `fixture:development.debugging.root-cause-analysis:policy-boundary`; absence never becomes a pass.
