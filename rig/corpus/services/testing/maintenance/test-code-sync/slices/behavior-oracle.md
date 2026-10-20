# testing.maintenance.test-code-sync — behavior-oracle slice

Update tests from the intended contract when behavior changes. Copying new output into old assertions without a behavioral decision creates circular evidence.

Policy grade slice `test-code-sync-slice-behavior-oracle`: List the behaviors that changed. Tests cannot follow a change nobody named, so state each one. Despite its name this slice is not a behavior oracle: it confirms changed behaviors, updated cases and the follow-output flag are declared; it does not compare tests with code.
