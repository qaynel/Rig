# infrastructure.cicd.release-gating — maximal

Bind release gates to the revision and artifact that will ship. Earlier green results do not authorize a different commit or rebuilt artifact.

Grade: maximal. Policy grade. Check: release-gating-evidence-receipt.

Maximal requires `use_stale_gate_results` to equal `false` in `rig-services/infrastructure.cicd.release-gating.json`; the good fixture satisfies this check.

Maximal remains Policy grade. It does not run a second release, produce a replay receipt, verify gate logs, or prove the released artifact came from the declared revision. Those require repository release evidence outside this configuration check.
