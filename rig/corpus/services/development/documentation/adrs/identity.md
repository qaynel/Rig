# development.documentation.adrs — identity

Record the chosen approach, credible alternatives and concrete consequences. A decision record should explain the tradeoff that shaped the system rather than restating the implementation.

Policy grade. Capture the selected approach, credible alternatives, and concrete consequences. A useful decision record explains the tradeoff that shaped the system rather than restating implementation details.

Applicable surface: source-code. Owned scope: `documentation.adrs`.

Disposition: executable. Native checks validate only declared policy fields.

Native checks require nonempty decision, alternatives, and consequences values in the JSON policy. They do not inspect or validate the quality of any ADR in the repository.

Configured examples (minimal: `decision` = "Use the existing journal for recovery"; mid: `alternatives` = ["overwrite files directly"]; maximal: `consequences` = ["recoverable preimages"]) describe expected policy only. They are not repository-derived fixtures.
