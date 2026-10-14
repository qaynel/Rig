# testing.maintenance.test-code-sync — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for test code sync. The minimal boundary for test code sync checks changed_behaviors (nonempty): changed behaviors must name the concrete repository contract.. Binding checks: test-code-sync-source-code-boundary.

Trace the verdict to a repository-owned command or existing native check that can observe maintenance.test-code-sync; bind it to the input named in `rig-services/testing.maintenance.test-code-sync.json` and preserve the check's failure status. When adopting this in an existing repository, connect test code sync to the command that inspects changed_behaviors and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside maintenance.test-code-sync as a failure.

Acceptance target: fixture:testing.maintenance.test-code-sync:policy-boundary. Given source-code is present and maintenance.test-code-sync is selected, pass only when the repository binding evaluates maintenance.test-code-sync and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent maintenance concern. The ceiling is test code sync configuration validation only; declared policy does not prove running test code sync behavior. Choose a repository-owned check that observes test code sync from rig-services/testing.maintenance.test-code-sync.json..

Service-specific evidence cues:
Offer: Update tests from the intended contract when behavior changes. Copying new output into old assertions without a behavioral decision creates circular evidence.
minimal: changed behaviors — ["owner is required"].
mid: updated cases — ["reject missing owner"].
maximal: tests follow output blindly — false.
