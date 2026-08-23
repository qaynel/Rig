# development.data-schema.db-migrations - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`db-migrations-source-code-boundary` owns `data-schema.db-migrations`. Given source-code is present and data-schema.db-migrations is selected, it passes only when the repository binding evaluates data-schema.db-migrations and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent data schema concern. Evidence is recorded against `fixture:development.data-schema.db-migrations:policy-boundary`; absence never becomes a pass.
