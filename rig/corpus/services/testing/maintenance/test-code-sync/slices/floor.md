# testing.maintenance.test-code-sync — floor and mutation-floor slice

Update tests from the intended contract when behavior changes. Copying new output into old assertions without a behavioral decision creates circular evidence.

Policy grade slice `test-code-sync-slice-floor`: List the behaviors that changed. Tests cannot follow a change nobody named, so state each one.
