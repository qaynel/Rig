# development.documentation.docstrings — behavior-oracle slice

Document the externally visible parameters and failure behavior of public symbols. A reader must be able to use the function without reconstructing its implementation.

Policy grade. `docstrings-slice-behavior-oracle` checks a nonempty list of symbol names only; it cannot observe parameter documentation or runtime failures.

To validate a public API docstring, inspect the declaration and compare the documented parameter and failure contract with implementation behavior. The native rule does neither.
