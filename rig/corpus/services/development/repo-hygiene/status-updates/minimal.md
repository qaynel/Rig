# development.repo-hygiene.status-updates — minimal

Report observed progress, the work in flight and the next resolving action. Distinguish finished evidence from intended work so another contributor can resume accurately.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for status updates. The minimal boundary for status updates checks completed (nonempty): completed must name the concrete repository contract. Binding checks: status-updates-source-code-boundary.

Start from a repository-owned command or existing native check that can observe repo-hygiene.status-updates; bind it to the input named in `rig-services/development.repo-hygiene.status-updates.json` and preserve the check's failure status. When adopting this in an existing repository, connect status updates to the command that inspects completed and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside repo-hygiene.status-updates as a failure.

Acceptance target: policy:development.repo-hygiene.status-updates:minimal:status-updates-source-code-boundary.

Declared predicates: status-updates-source-code-boundary: `completed` is nonempty (a string or array).
