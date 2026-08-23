# testing.integration.external-service - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`external-service-source-code-boundary` owns `integration.external-service`. Given source-code is present and integration.external-service is selected, it passes only when the repository binding evaluates integration.external-service and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent integration concern. Evidence is recorded against `fixture:testing.integration.external-service:policy-boundary`; absence never becomes a pass.
