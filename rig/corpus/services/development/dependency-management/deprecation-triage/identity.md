# development.dependency-management.deprecation-triage — identity

Policy grade: deprecation triage owns dependency-management.deprecation-triage. Identify each deprecated API and assign a migration owner. Removal deadlines remain explicit; warning suppression is not a substitute for replacing a disappearing dependency.

Keep sibling services in dependency-management under their own verdicts. Ground the decision in the configured input at `rig-services/development.dependency-management.deprecation-triage.json`; malformed input is still attributed to that path.

Disposition: convention. Use the limit: deprecation triage configuration validation only; declared policy does not prove running deprecation triage behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.dependency-management.deprecation-triage:policy-boundary. Given source-code is present and dependency-management.deprecation-triage is selected, pass only when the repository binding evaluates dependency-management.deprecation-triage and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent dependency management concern.

Service-specific evidence cues:
Identify each deprecated API and assign a migration owner. Removal deadlines remain explicit; warning suppression is not a substitute for replacing a disappearing dependency.

Owned scope: `dependency-management.deprecation-triage`.

Offer: Identify each deprecated API and assign a migration owner. Removal deadlines remain explicit; warning suppression is not a substitute for replacing a disappearing dependency.

Input: `rig-services/development.dependency-management.deprecation-triage.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: deprecation triage configuration validation only; declared policy does not prove running deprecation triage behavior. Select an approved repository-owned command to verify that behavior.

minimal: deprecated apis — ["legacyClient"].

mid: replacement owners — ["platform"].

maximal: ignore removal deadline — false.
