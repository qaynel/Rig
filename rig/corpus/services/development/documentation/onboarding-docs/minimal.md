# development.documentation.onboarding-docs — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for onboarding docs. The minimal boundary for onboarding docs checks undefined (matches "(?:^|\\n)##?\\s+(?:Setup|Install(?:ation)?|Getting started)\\b"): Add a setup section that states the prerequisites and installation command.. Binding checks: onboarding-docs-source-code-boundary.

Trace the verdict to a repository-owned command or existing native check that can observe documentation.onboarding-docs; bind it to the input named in `README.md` and preserve the check's failure status. When adopting this in an existing repository, connect onboarding docs to the command that inspects  and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside documentation.onboarding-docs as a failure.

Acceptance target: fixture:development.documentation.onboarding-docs:policy-boundary. Given source-code is present and documentation.onboarding-docs is selected, pass only when the repository binding evaluates documentation.onboarding-docs and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent documentation concern. The ceiling is Checks documented setup, run and verification instructions; does not execute installation or prove that the instructions work on another machine..

Service-specific evidence cues:
Offer: Offer when a new contributor cannot locate installation and execution instructions.
minimal: setup command — ["npm","install"].
mid: run command — ["npm","start"].
maximal: check command — ["npm","test"].
