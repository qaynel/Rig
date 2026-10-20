# development.documentation.docstrings — property-floor slice

Document the externally visible parameters and failure behavior of public symbols. A reader must be able to use the function without reconstructing its implementation.

Policy grade. The `docstrings-slice-property-floor` rule checks `documented_symbols` nonempty. Despite the slice name, this check does not establish content correctness or behavior; Native checks require nonempty documented_symbols, parameters, and failure_contract values in the JSON policy. They do not inspect source declarations or validate docstring text.

The policy check does not exercise a property of the documentation itself. Compare declared symbols and parameter/failure details with public functions in the repository. The example symbol is illustrative, not discovered from source.
