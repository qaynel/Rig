# db-migrations

Keep migration ordering deterministic and preserve a tested recovery route. Destructive schema operations require their own explicit approval rather than inheriting ordinary migration consent.

Owned scope: `data-schema.db-migrations`. Input: `rig-services/development.data-schema.db-migrations.json`.

Coverage ceiling: Configuration validation only, so it confirms migration order, rollback steps and the destructive-change flag are declared; it does not show migrations apply or roll back.

minimal: migration order — ["001_create_items","002_add_owner"]. State the migration order explicitly. Nondeterministic ordering can corrupt a schema, so declare the sequence or numbering the tool follows.

mid: rollback steps — ["drop owner column"]. Write the rollback steps for a failed migration. Without a tested recovery route a bad migration is permanent, so list the exact reverse steps.

maximal: destructive change approved — false. Destructive changes must be marked not approved by default. A drop or truncate needs its own explicit approval, so keep this false until a separate sign-off exists.
