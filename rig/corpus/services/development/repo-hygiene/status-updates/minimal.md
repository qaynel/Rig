# development.repo-hygiene.status-updates — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for status updates. The minimal boundary for status updates checks completed (nonempty): completed must name the concrete repository contract.. Binding checks: status-updates-source-code-boundary.

Start from a repository-owned command or existing native check that can observe repo-hygiene.status-updates; bind it to the input named in `rig-services/development.repo-hygiene.status-updates.json` and preserve the check's failure status. When adopting this in an existing repository, connect status updates to the command that inspects completed and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside repo-hygiene.status-updates as a failure.

Acceptance target: fixture:development.repo-hygiene.status-updates:policy-boundary. Given source-code is present and repo-hygiene.status-updates is selected, pass only when the repository binding evaluates repo-hygiene.status-updates and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent repo hygiene concern. The ceiling is status updates configuration validation only; declared policy does not prove running status updates behavior. Choose a repository-owned check that observes status updates from rig-services/development.repo-hygiene.status-updates.json..

Service-specific evidence cues:
Offer: Report observed progress, the work in flight and the next resolving action. Distinguish finished evidence from intended work so another contributor can resume accurately.
minimal: completed — ["parser regression reproduced"].
mid: in flight — ["shared boundary fix"].
maximal: next action — "run parser regression".
