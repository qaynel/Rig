# development.repo-hygiene.status-updates — identity

Policy grade: status-updates owns repo-hygiene.status-updates. Report observed progress, the work in flight and the next resolving action. Distinguish finished evidence from intended work so another contributor can resume accurately.

Input: `rig-services/development.repo-hygiene.status-updates.json`. Configuration validation only, so it confirms completed work, in-flight work and a next action are written; it does not show the status is accurate.

Disposition: executable.
Acceptance target: policy:development.repo-hygiene.status-updates:minimal:status-updates-source-code-boundary.
Declared predicates: status-updates-source-code-boundary: `completed` is nonempty (a string or array).
