# development.documentation.adrs — minimal

Record the chosen approach, credible alternatives and concrete consequences. A decision record should explain the tradeoff that shaped the system rather than restating the implementation.

Grade: minimal. Assurance remains Policy grade. The native check `adrs-source-code-boundary` evaluates `decision` nonempty. Example: `decision` = "Use the existing journal for recovery".

A decision without alternatives and consequences does not show the tradeoff. The current rules only check that those policy fields contain values; they do not read ADR files.

Catalogue policy target: `policy:development.documentation.adrs:minimal:adrs-source-code-boundary`. It describes the policy condition; this service does not include a separate fixture for it. Native checks require nonempty decision, alternatives, and consequences values in the JSON policy. They do not inspect or validate the quality of any ADR in the repository.
