# infrastructure.disaster-recovery.failover — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for failover; it does not widen ownership beyond disaster-recovery.failover. The context signals are fencing_strategy. Binding checks: failover-disaster-recovery-context.

Trace the verdict to the existing repository's failover convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in disaster-recovery under their own verdicts.

Acceptance target: fixture:infrastructure.disaster-recovery.failover:repository-context. Given disaster-recovery.failover has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent disaster recovery concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Define the trigger and fencing that keep failover from creating two writers. Redundant resources without split-brain protection are not a safe failover design.

Owned scope: `disaster-recovery.failover`.

Offer: Define the trigger and fencing that keep failover from creating two writers. Redundant resources without split-brain protection are not a safe failover design.

Input: `rig-services/infrastructure.disaster-recovery.failover.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: failover configuration validation only; declared policy does not prove running failover behavior. Select an approved repository-owned command to verify that behavior.

minimal: failover trigger — "primary health unavailable".

mid: fencing strategy — "single-writer-lease".

maximal: allow split brain — false.
