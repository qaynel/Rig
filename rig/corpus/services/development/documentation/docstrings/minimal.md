# development.documentation.docstrings — minimal

Document the externally visible parameters and failure behavior of public symbols. A reader must be able to use the function without reconstructing its implementation.

Grade: minimal. Assurance remains Policy grade. The native check `docstrings-source-code-boundary` evaluates `documented_symbols` nonempty. Example: `documented_symbols` = ["parseRecord"].

The fields declare which symbols, parameters, and failure behavior the policy expects to cover. The checks do not establish that any source docstring matches those declarations.

Catalogue policy target: `policy:development.documentation.docstrings:minimal:docstrings-source-code-boundary`. It describes the policy condition; this service does not include a separate fixture for it. Native checks require nonempty documented_symbols, parameters, and failure_contract values in the JSON policy. They do not inspect source declarations or validate docstring text.
