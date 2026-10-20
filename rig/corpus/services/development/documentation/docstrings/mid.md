# development.documentation.docstrings — mid

Document the externally visible parameters and failure behavior of public symbols. A reader must be able to use the function without reconstructing its implementation.

Policy grade, mid: Document each public parameter's meaning and type. Missing parameter notes force callers to reverse-engineer inputs, so list them. Cumulative with minimal. Binding checks: docstrings-source-code-boundary, docstrings-documentation-context.
