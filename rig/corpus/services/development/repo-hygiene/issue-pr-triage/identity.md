# development.repo-hygiene.issue-pr-triage — identity

Policy grade: issue pr triage owns repo-hygiene.issue-pr-triage. Route issues using meaningful labels and an accountable owner. Closing a report needs a written disposition or proving fix; inactivity alone does not resolve the problem.

Keep neighboring repo-hygiene services outside the issue pr triage decision for repo-hygiene.issue-pr-triage. Read the configured input at `rig-services/development.repo-hygiene.issue-pr-triage.json`; malformed input is still attributed to that path.

Disposition: executable. Ground the decision in the limit: issue pr triage configuration validation only; declared policy does not prove running issue pr triage behavior. Choose a repository-owned check that observes issue pr triage from rig-services/development.repo-hygiene.issue-pr-triage.json.

Acceptance target: policy:development.repo-hygiene.issue-pr-triage:minimal:issue-pr-triage-source-code-boundary.

Declared predicates: issue-pr-triage-source-code-boundary: `triage_labels` is nonempty (a string or array).
