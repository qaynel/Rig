# development.documentation.onboarding-docs — behavior-oracle slice

Policy grade slice. This slice bounds onboarding docs to documentation.onboarding-docs. It uses `onboarding-docs-slice-behavior-oracle` and checks undefined (matches "(?:^|\\n)##?\\s+(?:Setup|Install(?:ation)?|Getting started)\\b"): Add a setup section that states the prerequisites and installation command..

Read a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `README.md`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than Checks documented setup, run and verification instructions; does not execute installation or prove that the instructions work on another machine..

Service-specific evidence cues:
Give contributors a reproducible setup, a way to run the project and a way to verify changes. Keep those commands aligned with repository-owned tasks so new teammates do not need oral setup instructions.

Owned scope: `documentation.onboarding-docs`.

Offer: Offer when a new contributor cannot locate installation and execution instructions.

Input: `README.md`. Detection records the path even when its contents are malformed.

Coverage ceiling: Checks documented setup, run and verification instructions; does not execute installation or prove that the instructions work on another machine.

minimal: setup command — ["npm","install"].

mid: run command — ["npm","start"].

maximal: check command — ["npm","test"].
