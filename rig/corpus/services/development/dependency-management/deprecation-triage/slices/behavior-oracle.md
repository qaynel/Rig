# development.dependency-management.deprecation-triage — behavior-oracle slice

Policy grade slice. This slice bounds deprecation triage to dependency-management.deprecation-triage. It uses `deprecation-triage-slice-behavior-oracle` and checks deprecated_apis (nonempty): deprecated apis must name the concrete repository contract..

Tie acceptance to a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/development.dependency-management.deprecation-triage.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than deprecation triage configuration validation only; declared policy does not prove running deprecation triage behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Identify each deprecated API and assign a migration owner. Removal deadlines remain explicit; warning suppression is not a substitute for replacing a disappearing dependency.

Owned scope: `dependency-management.deprecation-triage`.

Offer: Identify each deprecated API and assign a migration owner. Removal deadlines remain explicit; warning suppression is not a substitute for replacing a disappearing dependency.

Input: `rig-services/development.dependency-management.deprecation-triage.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: deprecation triage configuration validation only; declared policy does not prove running deprecation triage behavior. Select an approved repository-owned command to verify that behavior.

minimal: deprecated apis — ["legacyClient"].

mid: replacement owners — ["platform"].

maximal: ignore removal deadline — false.
