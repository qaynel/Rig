# development.documentation.docstrings — maximal

Document the externally visible parameters and failure behavior of public symbols. A reader must be able to use the function without reconstructing its implementation.

Policy grade, maximal: Describe the failure behavior, such as raised errors or return codes. Without it a caller cannot handle failure, so state what each symbol does when it cannot succeed. Cumulative with minimal and mid. Binding checks: docstrings-source-code-boundary, docstrings-documentation-context, docstrings-evidence-receipt.
