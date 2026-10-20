# development.documentation.adrs — behavior-oracle slice

Record the chosen approach, credible alternatives and concrete consequences. A decision record should explain the tradeoff that shaped the system rather than restating the implementation.

Policy grade. `adrs-slice-behavior-oracle` only checks that the configured `decision` field is nonempty. It cannot tell whether an ADR’s alternatives and consequences support the selected approach.

For an actual decision review, compare the ADR’s stated choice against its alternatives and consequences; the current native check does not perform that review.
