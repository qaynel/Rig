# development.data-schema.db-migrations — identity

Policy grade: db migrations owns data-schema.db-migrations. Keep migration ordering deterministic and preserve a tested recovery route. Destructive schema operations require their own explicit approval rather than inheriting ordinary migration consent.

Keep sibling services in data-schema under their own verdicts. Use the configured input at `rig-services/development.data-schema.db-migrations.json`; malformed input is still attributed to that path.

Disposition: convention. Start from the limit: db migrations configuration validation only; declared policy does not prove running db migrations behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.data-schema.db-migrations:policy-boundary. Given source-code is present and data-schema.db-migrations is selected, pass only when the repository binding evaluates data-schema.db-migrations and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent data schema concern.

Service-specific evidence cues:
Keep migration ordering deterministic and preserve a tested recovery route. Destructive schema operations require their own explicit approval rather than inheriting ordinary migration consent.

Owned scope: `data-schema.db-migrations`.

Offer: Keep migration ordering deterministic and preserve a tested recovery route. Destructive schema operations require their own explicit approval rather than inheriting ordinary migration consent.

Input: `rig-services/development.data-schema.db-migrations.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: db migrations configuration validation only; declared policy does not prove running db migrations behavior. Select an approved repository-owned command to verify that behavior.

minimal: migration order — ["001_create_items","002_add_owner"].

mid: rollback steps — ["drop owner column"].

maximal: destructive change approved — false.
