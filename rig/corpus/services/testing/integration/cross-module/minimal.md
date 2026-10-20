# testing.integration.cross-module — minimal

Exercise interactions between real modules and assert their shared observable result. Stubbing the internal boundary defeats the purpose of the integration check.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for cross module. The minimal boundary for cross module checks participating_modules (nonempty): participating modules must name the concrete repository contract. Binding checks: cross-module-source-code-boundary.

Read a repository-owned command or existing native check that can observe integration.cross-module; bind it to the input named in `rig-services/testing.integration.cross-module.json` and preserve the check's failure status. When adopting this in an existing repository, connect cross module to the command that inspects participating_modules and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside integration.cross-module as a failure.

Acceptance target: policy:testing.integration.cross-module:minimal:cross-module-source-code-boundary.

Declared predicates: cross-module-source-code-boundary: `participating_modules` is nonempty (a string or array).
