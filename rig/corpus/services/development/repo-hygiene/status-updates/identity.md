# development.repo-hygiene.status-updates — identity

Policy grade: status updates owns repo-hygiene.status-updates. Report observed progress, the work in flight and the next resolving action. Distinguish finished evidence from intended work so another contributor can resume accurately.

Keep neighboring repo-hygiene services outside the status updates decision for repo-hygiene.status-updates. Ground the decision in the configured input at `rig-services/development.repo-hygiene.status-updates.json`; malformed input is still attributed to that path.

Disposition: executable. Use the limit: status updates configuration validation only; declared policy does not prove running status updates behavior. Choose a repository-owned check that observes status updates from rig-services/development.repo-hygiene.status-updates.json.

Acceptance target: policy:development.repo-hygiene.status-updates:minimal:status-updates-source-code-boundary.

Declared predicates: status-updates-source-code-boundary: `completed` is nonempty (a string or array).
