# development.documentation.onboarding-docs — minimal

Minimal establishes a non-vacuous policy boundary for onboarding docs. It checks undefined (matches "(?:^|\\n)##?\\s+(?:Setup|Install(?:ation)?|Getting started)\\b"): Add a setup section that states the prerequisites and installation command..

Trace the verdict to a repository-owned command or existing native check that can observe documentation.onboarding-docs; bind it to the input named in `README.md` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside documentation.onboarding-docs is a failure.

Acceptance target: fixture:development.documentation.onboarding-docs:policy-boundary. Given source-code is present and documentation.onboarding-docs is selected, pass only when the repository binding evaluates documentation.onboarding-docs and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent documentation concern. A passing policy check does not establish runtime behavior.
