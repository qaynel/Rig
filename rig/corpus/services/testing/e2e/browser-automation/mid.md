# testing.e2e.browser-automation — mid

Drive real interactions and wait for observable state transitions. Fixed sleeps hide synchronization defects and produce unreliable results under slower environments.

Policy grade, mid: Write the interaction steps as observable actions. Vague steps cannot be replayed, so list each click, input and expected state. Cumulative with minimal. Binding checks: browser-automation-source-code-boundary, browser-automation-e2e-context.

Acceptance target: policy:testing.e2e.browser-automation:mid:browser-automation-source-code-boundary+browser-automation-e2e-context.
Declared predicates: browser-automation-source-code-boundary: `browser_targets` is nonempty (a string or array); browser-automation-e2e-context: `interaction_steps` is nonempty (a string or array).
