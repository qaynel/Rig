# Public API docstrings

Document the externally visible parameters and failure behavior of public symbols. A reader must be able to use the function without reconstructing its implementation.

Document public symbols’ externally visible parameters and failure behavior so callers can use them without reconstructing implementation details.

Owned scope: `documentation.docstrings`. Input: `rig-services/development.documentation.docstrings.json`.

Policy fields: minimal: `documented_symbols` = ["parseRecord"]; mid: `parameters` = ["raw: serialized record"]; maximal: `failure_contract` = "throws on malformed records". Native checks require nonempty documented_symbols, parameters, and failure_contract values in the JSON policy. They do not inspect source declarations or validate docstring text.

Compare declared symbols and parameter/failure details with public functions in the repository. The example symbol is illustrative, not discovered from source. To verify docstrings, inspect the source and compare each public symbol’s actual parameters and failure behavior with its documentation. These policy checks do not parse source or docstrings.

Do not claim source documentation coverage from configured symbol names alone.
