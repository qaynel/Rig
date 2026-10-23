# development.documentation.adrs — property-floor slice

Record the chosen approach, credible alternatives and concrete consequences. A decision record should explain the tradeoff that shaped the system rather than restating the implementation.

Policy grade. The `adrs-slice-property-floor` rule checks `decision` nonempty. Despite the slice name, this check does not establish content correctness or behavior; Native checks require nonempty decision, alternatives, and consequences values in the JSON policy. They do not inspect or validate the quality of any ADR in the repository.

The policy check does not exercise a property of the documentation itself. Compare the policy values with the repository’s existing ADRs and decision format. No repository-specific convention is supplied by these native checks.
