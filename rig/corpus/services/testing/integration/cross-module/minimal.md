# testing.integration.cross-module — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for cross module. The minimal boundary for cross module checks participating_modules (nonempty): participating modules must name the concrete repository contract.. Binding checks: cross-module-source-code-boundary.

Read a repository-owned command or existing native check that can observe integration.cross-module; bind it to the input named in `rig-services/testing.integration.cross-module.json` and preserve the check's failure status. When adopting this in an existing repository, connect cross module to the command that inspects participating_modules and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside integration.cross-module as a failure.

Acceptance target: fixture:testing.integration.cross-module:policy-boundary. Given source-code is present and integration.cross-module is selected, pass only when the repository binding evaluates integration.cross-module and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent integration concern. The ceiling is cross module configuration validation only; declared policy does not prove running cross module behavior. Choose a repository-owned check that observes cross module from rig-services/testing.integration.cross-module.json..

Service-specific evidence cues:
Offer: Exercise interactions between real modules and assert their shared observable result. Stubbing the internal boundary defeats the purpose of the integration check.
minimal: participating modules — ["orders","inventory"].
mid: interaction cases — ["order reserves stock"].
maximal: stub internal contracts — false.
