# infrastructure.cicd.release-gating — identity

Bind release gates to the revision and artifact that will ship. Earlier green results do not authorize a different commit or rebuilt artifact.

Policy grade: release gating owns the declared list of required release checks, the revision they checked, and the stale-result switch. A green result for one revision does not establish that another revision or rebuilt artifact passed.

The native check reads `rig-services/infrastructure.cicd.release-gating.json`. It validates `required_gates` and `release_revision` as nonempty and requires `use_stale_gate_results` to be `false`. It does not run CI or verify a shipped artifact.

Disposition: executable. Acceptance target: `policy:infrastructure.cicd.release-gating:minimal:release-gating-source-code-boundary`. Given the service JSON, pass when the selected grade's declared field check succeeds; fail when that field violates its check. The ceiling is release-gating configuration validation only.
