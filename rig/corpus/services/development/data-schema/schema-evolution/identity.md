# development.data-schema.schema-evolution — identity

schema evolution owns data-schema.schema-evolution. Check old and new readers against additive evolution and define unknown-field handling. Removing required fields breaks compatibility and needs a distinct versioned transition.

Keep sibling services in data-schema under their own verdicts. Inspect the configured input at `rig-services/development.data-schema.schema-evolution.json`; malformed input is still attributed to that path.

Disposition: convention. Tie acceptance to the limit: schema evolution configuration validation only; declared policy does not prove running schema evolution behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.data-schema.schema-evolution:policy-boundary. Given source-code is present and data-schema.schema-evolution is selected, pass only when the repository binding evaluates data-schema.schema-evolution and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent data schema concern.
