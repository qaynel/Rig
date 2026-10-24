# development.documentation.adrs — floor and mutation-floor slice

Record the chosen approach, credible alternatives and concrete consequences. A decision record should explain the tradeoff that shaped the system rather than restating the implementation.

Policy grade. The `adrs-slice-floor` and `adrs-slice-mutation-floor` rules require a nonempty `decision` value. The mutation-floor name does not mean that ADR text is mutated or checked.

Example policy value: `decision` = "Use the existing journal for recovery". This establishes that a decision is configured; it says nothing about whether a corresponding ADR explains its rationale.
