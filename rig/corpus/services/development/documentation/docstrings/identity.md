# development.documentation.docstrings — identity

Document the externally visible parameters and failure behavior of public symbols. A reader must be able to use the function without reconstructing its implementation.

Policy grade. Document public symbols’ externally visible parameters and failure behavior so callers can use them without reconstructing implementation details.

Applicable surface: source-code. Owned scope: `documentation.docstrings`. Input: `rig-services/development.documentation.docstrings.json`.

Disposition: executable. Native checks validate only declared policy fields.

Native checks require nonempty documented_symbols, parameters, and failure_contract values in the JSON policy. They do not inspect source declarations or validate docstring text.

Configured examples (minimal: `documented_symbols` = ["parseRecord"]; mid: `parameters` = ["raw: serialized record"]; maximal: `failure_contract` = "throws on malformed records") describe expected policy only. They are not repository-derived fixtures.
