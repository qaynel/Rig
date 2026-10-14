# testing.e2e.browser-automation — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for browser automation; it does not widen ownership beyond e2e.browser-automation. For browser automation, inspect these context signals: interaction_steps. Binding checks: browser-automation-e2e-context.

Start from the existing repository's browser automation convention, then name the source path or command that establishes it. For browser automation, inspect the repository's actual spec, source, test, or configuration for interaction_steps; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring e2e services outside the browser automation decision for e2e.browser-automation.

Acceptance target: fixture:testing.e2e.browser-automation:repository-context. Given e2e.browser-automation has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent e2e concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Drive real interactions and wait for observable state transitions. Fixed sleeps hide synchronization defects and produce unreliable results under slower environments.
minimal: browser targets — ["chromium"].
mid: interaction steps — ["submit form"].
maximal: fixed sleeps — false.
