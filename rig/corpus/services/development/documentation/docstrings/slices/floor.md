# development.documentation.docstrings — floor and mutation-floor slice

Document the externally visible parameters and failure behavior of public symbols. A reader must be able to use the function without reconstructing its implementation.

Policy grade. `docstrings-slice-floor` and `docstrings-slice-mutation-floor` require the policy’s `documented_symbols` list to contain at least one entry. No source file is edited or parsed by this slice.

Example: `documented_symbols` = ["parseRecord"]. This does not establish that the symbol exists or that it has a docstring.
