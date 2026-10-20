# testing.integration.cross-module — identity

Policy grade: cross module owns integration.cross-module. Exercise interactions between real modules and assert their shared observable result. Stubbing the internal boundary defeats the purpose of the integration check.

Keep neighboring integration services outside the cross module decision for integration.cross-module. Inspect the configured input at `rig-services/testing.integration.cross-module.json`; malformed input is still attributed to that path.

Disposition: executable. Tie acceptance to the limit: cross module configuration validation only; declared policy does not prove running cross module behavior. Choose a repository-owned check that observes cross module from rig-services/testing.integration.cross-module.json.

Acceptance target: policy:testing.integration.cross-module:minimal:cross-module-source-code-boundary.

Declared predicates: cross-module-source-code-boundary: `participating_modules` is nonempty (a string or array).
