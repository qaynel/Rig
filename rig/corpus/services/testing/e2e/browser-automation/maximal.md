# testing.e2e.browser-automation — maximal

Drive real interactions and wait for observable state transitions. Fixed sleeps hide synchronization defects and produce unreliable results under slower environments.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: browser-automation-source-code-boundary, browser-automation-e2e-context, browser-automation-evidence-receipt.

The maximal policy predicates evaluate the declared configuration fields. Record the result and any observed repository evidence separately; this service does not issue or verify a replayable receipt.

Acceptance target: policy:testing.e2e.browser-automation:maximal:browser-automation-source-code-boundary+browser-automation-e2e-context+browser-automation-evidence-receipt.

Declared predicates: browser-automation-source-code-boundary: `browser_targets` is nonempty (a string or array); browser-automation-e2e-context: `interaction_steps` is nonempty (a string or array); browser-automation-evidence-receipt: `fixed_sleeps` equals false.
