# testing.integration.cross-module — mid

Exercise interactions between real modules and assert their shared observable result. Stubbing the internal boundary defeats the purpose of the integration check.

Policy grade, mid: List the interaction cases and their shared observable result. Untested interactions break silently, so write each case. Cumulative with minimal. Binding checks: cross-module-source-code-boundary, cross-module-integration-context.

Acceptance target: policy:testing.integration.cross-module:mid:cross-module-source-code-boundary+cross-module-integration-context.
Declared predicates: cross-module-source-code-boundary: `participating_modules` is nonempty (a string or array); cross-module-integration-context: `interaction_cases` is nonempty (a string or array).
