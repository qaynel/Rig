# testing.maintenance.test-code-sync — property-floor slice

Update tests from the intended contract when behavior changes. Copying new output into old assertions without a behavioral decision creates circular evidence.

Policy grade slice. This slice bounds test code sync to maintenance.test-code-sync. It uses `test-code-sync-slice-property-floor` and checks changed_behaviors (nonempty): changed behaviors must name the concrete repository contract.