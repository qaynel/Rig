# testing.integration.cross-module — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for cross module. It checks participating_modules (nonempty): participating modules must name the concrete repository contract.. Binding checks: cross-module-source-code-boundary.

Read a repository-owned command or existing native check that can observe integration.cross-module; bind it to the input named in `rig-services/testing.integration.cross-module.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside integration.cross-module is a failure.

Acceptance target: fixture:testing.integration.cross-module:policy-boundary. Given source-code is present and integration.cross-module is selected, pass only when the repository binding evaluates integration.cross-module and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent integration concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Exercise interactions between real modules and assert their shared observable result. Stubbing the internal boundary defeats the purpose of the integration check.

Owned scope: `integration.cross-module`.

Offer: Exercise interactions between real modules and assert their shared observable result. Stubbing the internal boundary defeats the purpose of the integration check.

Input: `rig-services/testing.integration.cross-module.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: cross module configuration validation only; declared policy does not prove running cross module behavior. Select an approved repository-owned command to verify that behavior.

minimal: participating modules — ["orders","inventory"].

mid: interaction cases — ["order reserves stock"].

maximal: stub internal contracts — false.
