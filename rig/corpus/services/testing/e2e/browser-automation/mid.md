# testing.e2e.browser-automation — mid

Drive real interactions and wait for observable state transitions. Fixed sleeps hide synchronization defects and produce unreliable results under slower environments.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: browser-automation-source-code-boundary, browser-automation-e2e-context.

Start from the existing repository's browser automation convention, then name the source path or command that establishes it. For browser automation, inspect the repository's actual spec, source, test, or configuration for interaction_steps; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring e2e services outside the browser automation decision for e2e.browser-automation.

Acceptance target: policy:testing.e2e.browser-automation:mid:browser-automation-source-code-boundary+browser-automation-e2e-context.

Declared predicates: browser-automation-source-code-boundary: `browser_targets` is nonempty (a string or array); browser-automation-e2e-context: `interaction_steps` is nonempty (a string or array).
