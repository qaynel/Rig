# development.documentation.onboarding-docs — property-floor slice

Policy grade slice. This slice bounds onboarding docs to documentation.onboarding-docs. It uses `onboarding-docs-slice-property-floor` and checks undefined (matches "(?:^|\\n)##?\\s+(?:Setup|Install(?:ation)?|Getting started)\\b"): Add a setup section that states the prerequisites and installation command..

For onboarding docs, choose a repository example that satisfies  at the property-floor floor, plus a failure where Add a setup section that states the prerequisites and installation command. is false. For onboarding docs, wire `property-floor` to `README.md` and keep its verdict on ; missing evidence is a named gap, with ceiling Checks documented setup, run and verification instructions; does not execute installation or prove that the instructions work on another machine..

Service-specific evidence cues:
Offer: Offer when a new contributor cannot locate installation and execution instructions.
minimal: setup command — ["npm","install"].
mid: run command — ["npm","start"].
maximal: check command — ["npm","test"].
