# development.documentation.adrs — maximal

Record the chosen approach, credible alternatives and concrete consequences. A decision record should explain the tradeoff that shaped the system rather than restating the implementation.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: adrs-source-code-boundary, adrs-documentation-context, adrs-evidence-receipt.

To verify actual decision records, inspect the ADR files and confirm each record states the chosen option, considered alternatives, and consequences. The policy check does not perform this review. The native rule does not verify this runtime evidence or perform a replay.

Catalogue policy target: `policy:development.documentation.adrs:maximal:adrs-source-code-boundary+adrs-documentation-context+adrs-evidence-receipt`. Its current policy check proves only that consequences is nonempty.
