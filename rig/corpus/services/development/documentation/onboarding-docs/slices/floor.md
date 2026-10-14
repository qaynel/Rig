# development.documentation.onboarding-docs — floor and mutation-floor slice

Policy grade slice. This slice bounds onboarding docs to documentation.onboarding-docs. It uses `onboarding-docs-slice-floor` and checks undefined (matches "(?:^|\\n)##?\\s+(?:Setup|Install(?:ation)?|Getting started)\\b"): Add a setup section that states the prerequisites and installation command..

For onboarding docs, choose a repository example that satisfies  at the floor and mutation-floor floor, plus a failure where Add a setup section that states the prerequisites and installation command. is false. For onboarding docs, wire `floor and mutation-floor` to `README.md` and keep its verdict on ; missing evidence is a named gap, with ceiling Checks documented setup, run and verification instructions; does not execute installation or prove that the instructions work on another machine..

Service-specific evidence cues:
Offer: Offer when a new contributor cannot locate installation and execution instructions.
minimal: setup command — ["npm","install"].
mid: run command — ["npm","start"].
maximal: check command — ["npm","test"].
