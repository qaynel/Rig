# development.documentation.onboarding-docs — floor and mutation-floor slice

This slice bounds onboarding docs to documentation.onboarding-docs. It uses `onboarding-docs-slice-floor` and checks undefined (matches "(?:^|\\n)##?\\s+(?:Setup|Install(?:ation)?|Getting started)\\b"): Add a setup section that states the prerequisites and installation command..

Ground the decision in a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `README.md`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than Checks documented setup, run and verification instructions; does not execute installation or prove that the instructions work on another machine.
