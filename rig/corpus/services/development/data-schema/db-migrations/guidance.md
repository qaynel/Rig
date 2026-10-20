# db migrations

Keep migration ordering deterministic and preserve a tested recovery route. Destructive schema operations require their own explicit approval rather than inheriting ordinary migration consent.

Owned scope: `data-schema.db-migrations`.

Offer: Keep migration ordering deterministic and preserve a tested recovery route. Destructive schema operations require their own explicit approval rather than inheriting ordinary migration consent.

Input: `rig-services/development.data-schema.db-migrations.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: db migrations configuration validation only; declared policy does not prove running db migrations behavior. Select an approved repository-owned command to verify that behavior.

minimal: migration order — ["001_create_items","002_add_owner"].

mid: rollback steps — ["drop owner column"].

maximal: destructive change approved — false.
