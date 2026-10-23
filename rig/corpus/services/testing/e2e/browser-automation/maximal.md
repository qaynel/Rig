# testing.e2e.browser-automation — maximal

Drive real interactions and wait for observable state transitions. Fixed sleeps hide synchronization defects and produce unreliable results under slower environments.

Policy grade, maximal: Set fixed sleeps to false. A sleep hides synchronization defects and flakes on slower machines, so wait on an observable state. Cumulative with minimal and mid. Binding checks: browser-automation-source-code-boundary, browser-automation-e2e-context, browser-automation-evidence-receipt.

Acceptance target: policy:testing.e2e.browser-automation:maximal:browser-automation-source-code-boundary+browser-automation-e2e-context+browser-automation-evidence-receipt.
Declared predicates: browser-automation-source-code-boundary: `browser_targets` is nonempty (a string or array); browser-automation-e2e-context: `interaction_steps` is nonempty (a string or array); browser-automation-evidence-receipt: `fixed_sleeps` equals false.
