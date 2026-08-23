# infrastructure.observability.distributed-tracing - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`distributed-tracing-source-code-boundary` owns `observability.distributed-tracing`. Given source-code is present and observability.distributed-tracing is selected, it passes only when the repository binding evaluates observability.distributed-tracing and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent observability concern. Evidence is recorded against `fixture:infrastructure.observability.distributed-tracing:policy-boundary`; absence never becomes a pass.
