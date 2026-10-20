# development.documentation.adrs — behavior-oracle slice

Record the chosen approach, credible alternatives and concrete consequences. A decision record should explain the tradeoff that shaped the system rather than restating the implementation.

Policy grade. The `adrs-slice-behavior-oracle` rule checks `decision` nonempty. Despite the slice name, this check does not establish content correctness or behavior; Native checks require nonempty decision, alternatives, and consequences values in the JSON policy. They do not inspect or validate the quality of any ADR in the repository.

To verify actual decision records, inspect the ADR files and confirm each record states the chosen option, considered alternatives, and consequences. The policy check does not perform this review.
