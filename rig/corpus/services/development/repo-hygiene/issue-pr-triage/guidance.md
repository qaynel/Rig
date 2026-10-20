# issue-pr-triage

Route issues using meaningful labels and an accountable owner. Closing a report needs a written disposition or proving fix; inactivity alone does not resolve the problem.

Owned scope: `repo-hygiene.issue-pr-triage`. Input: `rig-services/development.repo-hygiene.issue-pr-triage.json`.

Coverage ceiling: Configuration validation only, so it confirms triage labels, owners and the close-without-disposition flag are declared; it does not show issues were actually triaged.

minimal: triage labels — ["bug","needs-reproduction"]. List the labels used to route issues. Unlabelled reports are not routed, so name the label set the repository uses.

mid: responsible owners — ["maintainers"]. Name the owner responsible for each triage lane. Without an accountable owner reports stall, so assign people or teams.

maximal: close without disposition — false. Set closing without a disposition to false. Inactivity alone does not resolve a report, so close only with a written reason or a proving fix.
