# development.documentation.docstrings — behavior-oracle slice

Document the externally visible parameters and failure behavior of public symbols. A reader must be able to use the function without reconstructing its implementation.

Policy grade. The `docstrings-slice-behavior-oracle` rule checks `documented_symbols` nonempty. Despite the slice name, this check does not establish content correctness or behavior; Native checks require nonempty documented_symbols, parameters, and failure_contract values in the JSON policy. They do not inspect source declarations or validate docstring text.

To verify docstrings, inspect the source and compare each public symbol’s actual parameters and failure behavior with its documentation. These policy checks do not parse source or docstrings.
