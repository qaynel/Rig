# development.documentation.onboarding-docs — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for onboarding docs. It checks undefined (matches "(?:^|\\n)##?\\s+(?:Setup|Install(?:ation)?|Getting started)\\b"): Add a setup section that states the prerequisites and installation command.. Binding checks: onboarding-docs-source-code-boundary.

Trace the verdict to a repository-owned command or existing native check that can observe documentation.onboarding-docs; bind it to the input named in `README.md` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside documentation.onboarding-docs is a failure.

Acceptance target: fixture:development.documentation.onboarding-docs:policy-boundary. Given source-code is present and documentation.onboarding-docs is selected, pass only when the repository binding evaluates documentation.onboarding-docs and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent documentation concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Give contributors a reproducible setup, a way to run the project and a way to verify changes. Keep those commands aligned with repository-owned tasks so new teammates do not need oral setup instructions.

Owned scope: `documentation.onboarding-docs`.

Offer: Offer when a new contributor cannot locate installation and execution instructions.

Input: `README.md`. Detection records the path even when its contents are malformed.

Coverage ceiling: Checks documented setup, run and verification instructions; does not execute installation or prove that the instructions work on another machine.

minimal: setup command — ["npm","install"].

mid: run command — ["npm","start"].

maximal: check command — ["npm","test"].
