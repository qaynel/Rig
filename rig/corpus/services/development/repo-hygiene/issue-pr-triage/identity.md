# development.repo-hygiene.issue-pr-triage — identity

issue pr triage owns repo-hygiene.issue-pr-triage. Route issues using meaningful labels and an accountable owner. Closing a report needs a written disposition or proving fix; inactivity alone does not resolve the problem.

Keep sibling services in repo-hygiene under their own verdicts. Read the configured input at `rig-services/development.repo-hygiene.issue-pr-triage.json`; malformed input is still attributed to that path.

Disposition: convention. Ground the decision in the limit: issue pr triage configuration validation only; declared policy does not prove running issue pr triage behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.repo-hygiene.issue-pr-triage:policy-boundary. Given source-code is present and repo-hygiene.issue-pr-triage is selected, pass only when the repository binding evaluates repo-hygiene.issue-pr-triage and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent repo hygiene concern.
