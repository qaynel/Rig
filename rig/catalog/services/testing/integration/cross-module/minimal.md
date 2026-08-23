# testing.integration.cross-module - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`cross-module-source-code-boundary` owns `integration.cross-module`. Given source-code is present and integration.cross-module is selected, it passes only when the repository binding evaluates integration.cross-module and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent integration concern. Evidence is recorded against `fixture:testing.integration.cross-module:policy-boundary`; absence never becomes a pass.
