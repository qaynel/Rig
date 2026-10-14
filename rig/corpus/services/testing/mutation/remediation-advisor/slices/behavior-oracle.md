# testing.mutation.remediation-advisor — behavior-oracle slice

This slice bounds remediation advisor to mutation.remediation-advisor. It uses `remediation-advisor-slice-behavior-oracle` and checks remediation_cases (nonempty): remediation cases must name the concrete repository contract..

Read a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.mutation.remediation-advisor.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than remediation advisor configuration validation only; declared policy does not prove running remediation advisor behavior. Select an approved repository-owned command to verify that behavior.
