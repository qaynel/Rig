# development.data-schema.schema-evolution — identity

Policy grade: schema evolution owns data-schema.schema-evolution. Check old and new readers against additive evolution and define unknown-field handling. Removing required fields breaks compatibility and needs a distinct versioned transition.

Keep sibling services in data-schema under their own verdicts. Inspect the configured input at `rig-services/development.data-schema.schema-evolution.json`; malformed input is still attributed to that path.

Disposition: convention. Tie acceptance to the limit: schema evolution configuration validation only; declared policy does not prove running schema evolution behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.data-schema.schema-evolution:policy-boundary. Given source-code is present and data-schema.schema-evolution is selected, pass only when the repository binding evaluates data-schema.schema-evolution and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent data schema concern.

Service-specific evidence cues:
Check old and new readers against additive evolution and define unknown-field handling. Removing required fields breaks compatibility and needs a distinct versioned transition.

Owned scope: `data-schema.schema-evolution`.

Offer: Check old and new readers against additive evolution and define unknown-field handling. Removing required fields breaks compatibility and needs a distinct versioned transition.

Input: `rig-services/development.data-schema.schema-evolution.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: schema evolution configuration validation only; declared policy does not prove running schema evolution behavior. Select an approved repository-owned command to verify that behavior.

minimal: compatible readers — ["v1","v2"].

mid: unknown field policy — "ignore-additive-fields".

maximal: remove required fields — false.
