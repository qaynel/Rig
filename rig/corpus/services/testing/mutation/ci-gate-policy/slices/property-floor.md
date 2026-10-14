# testing.mutation.ci-gate-policy — property-floor slice

This slice bounds ci gate policy to mutation.ci-gate-policy. It uses `ci-gate-policy-slice-property-floor` and checks minimum_score_percent (minimum 70): minimum score percent must meet the configured minimum of 70..

Anchor the review on a concrete repository example that would pass this property-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.mutation.ci-gate-policy.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than ci gate policy configuration validation only; declared policy does not prove running ci gate policy behavior. Select an approved repository-owned command to verify that behavior.
