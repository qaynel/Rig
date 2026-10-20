# feature-flags

Give feature flags an owner and a rollback route. Unowned permanent flags accumulate untested branches and should not pass as deliberate release controls.

Owned scope: `environment-config.feature-flags`. Input: `rig-services/infrastructure.environment-config.feature-flags.json`.

Coverage ceiling: Configuration validation only, so it confirms flag names, a rollback owner and the permanent-unowned flag are declared; it does not read live flag state.

minimal: flag names — ["new_checkout"]. List the feature flags in use. Unlisted flags accumulate untested branches, so name each one.

mid: rollback owner — "checkout team". Name who can roll each flag back. A flag without an owner cannot be turned off in an incident, so assign one.

maximal: permanent unowned flags — false. Set permanent unowned flags to false. Flags that outlive their purpose are dead branches, so remove them or assign an owner.
