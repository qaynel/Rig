# infrastructure.disaster-recovery.rto-rpo — behavior-oracle slice

This slice bounds rto rpo to disaster-recovery.rto-rpo. It uses `rto-rpo-slice-behavior-oracle` and checks rto_minutes (minimum 30): rto minutes must meet the configured minimum of 30..

Tie acceptance to a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/infrastructure.disaster-recovery.rto-rpo.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than rto rpo configuration validation only; declared policy does not prove running rto rpo behavior. Select an approved repository-owned command to verify that behavior.
