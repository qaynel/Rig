# testing.integration.cross-module — identity

Policy grade: cross-module owns integration.cross-module. Exercise interactions between real modules and assert their shared observable result. Stubbing the internal boundary defeats the purpose of the integration check.

Input: `rig-services/testing.integration.cross-module.json`. Configuration validation only, so it confirms participating modules, interaction cases and the stub-internals flag are declared; it does not run the modules.

Disposition: executable.
Acceptance target: policy:testing.integration.cross-module:minimal:cross-module-source-code-boundary.
Declared predicates: cross-module-source-code-boundary: `participating_modules` is nonempty (a string or array).
