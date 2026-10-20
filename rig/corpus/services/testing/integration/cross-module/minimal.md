# testing.integration.cross-module — minimal

Exercise interactions between real modules and assert their shared observable result. Stubbing the internal boundary defeats the purpose of the integration check.

Policy grade, minimal: List the real modules that interact. Without them the check is a unit test, so name each participant. Binding checks: cross-module-source-code-boundary.

Acceptance target: policy:testing.integration.cross-module:minimal:cross-module-source-code-boundary.
Declared predicates: cross-module-source-code-boundary: `participating_modules` is nonempty (a string or array).
