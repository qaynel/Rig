# development.documentation.docstrings — mid

Document the externally visible parameters and failure behavior of public symbols. A reader must be able to use the function without reconstructing its implementation.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: docstrings-source-code-boundary, docstrings-documentation-context.

Compare declared symbols and parameter/failure details with public functions in the repository. The example symbol is illustrative, not discovered from source. A nonempty policy value does not establish that repository context was inspected.

Catalogue policy target: `policy:development.documentation.docstrings:mid:docstrings-source-code-boundary+docstrings-documentation-context`. Its current policy check proves only that parameters is nonempty.
