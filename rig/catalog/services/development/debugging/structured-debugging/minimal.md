# development.debugging.structured-debugging - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`structured-debugging-source-code-boundary` owns `debugging.structured-debugging`. Given source-code is present and debugging.structured-debugging is selected, it passes only when the repository binding evaluates debugging.structured-debugging and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent debugging concern. Evidence is recorded against `fixture:development.debugging.structured-debugging:policy-boundary`; absence never becomes a pass.
