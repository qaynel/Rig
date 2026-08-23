# development.architecture.system-design - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`system-design-source-code-boundary` owns `architecture.system-design`. Given source-code is present and architecture.system-design is selected, it passes only when the repository binding evaluates architecture.system-design and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent architecture concern. Evidence is recorded against `fixture:development.architecture.system-design:policy-boundary`; absence never becomes a pass.
