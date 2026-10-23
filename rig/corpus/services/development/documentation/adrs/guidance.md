# Architecture decision records

Record the chosen approach, credible alternatives and concrete consequences. A decision record should explain the tradeoff that shaped the system rather than restating the implementation.

Capture the selected approach, credible alternatives, and concrete consequences. A useful decision record explains the tradeoff that shaped the system rather than restating implementation details.

Owned scope: `documentation.adrs`. Input: `rig-services/development.documentation.adrs.json`.

Policy fields: minimal: `decision` = "Use the existing journal for recovery"; mid: `alternatives` = ["overwrite files directly"]; maximal: `consequences` = ["recoverable preimages"]. Native checks require nonempty decision, alternatives, and consequences values in the JSON policy. They do not inspect or validate the quality of any ADR in the repository.

Compare the policy values with the repository’s existing ADRs and decision format. No repository-specific convention is supplied by these native checks. To verify actual decision records, inspect the ADR files and confirm each record states the chosen option, considered alternatives, and consequences. The policy check does not perform this review.

Do not treat nonempty policy fields as proof that ADRs exist or contain useful rationale.
