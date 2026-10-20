# development.dependency-management.deprecation-triage — behavior-oracle slice

Identify each deprecated API and assign a migration owner. Removal deadlines remain explicit; warning suppression is not a substitute for replacing a disappearing dependency.

Policy grade slice. This slice bounds deprecation triage to dependency-management.deprecation-triage. It uses `deprecation-triage-slice-behavior-oracle` and checks deprecated_apis (nonempty): deprecated apis must name the concrete repository contract.