# schema-evolution

Check old and new readers against additive evolution and define unknown-field handling. Removing required fields breaks compatibility and needs a distinct versioned transition.

Owned scope: `data-schema.schema-evolution`. Input: `rig-services/development.data-schema.schema-evolution.json`.

Coverage ceiling: Configuration validation only, so it confirms compatible readers, unknown-field handling and the no-removal setting are declared; it does not show old and new readers interoperate.

minimal: compatible readers — ["v1","v2"]. List the old and new readers checked against the change. An empty list means compatibility was assumed, so name each consumer version.

mid: unknown field policy — "ignore-additive-fields". Declare how readers treat unknown fields, such as ignore or reject. Undefined handling breaks forward compatibility, so state the rule.

maximal: remove required fields — false. Set removal of required fields to false. Removing a required field breaks existing readers, so use a distinct versioned transition instead.
