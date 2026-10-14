# development.documentation.onboarding-docs — identity

Policy grade: onboarding docs owns documentation.onboarding-docs. Offer when a new contributor cannot locate installation and execution instructions.

Keep sibling services in documentation under their own verdicts. Use the configured input at `README.md`; malformed input is still attributed to that path.

Disposition: convention. Start from the limit: Checks documented setup, run and verification instructions; does not execute installation or prove that the instructions work on another machine.

Acceptance target: fixture:development.documentation.onboarding-docs:policy-boundary. Given source-code is present and documentation.onboarding-docs is selected, pass only when the repository binding evaluates documentation.onboarding-docs and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent documentation concern.

Service-specific evidence cues:
Give contributors a reproducible setup, a way to run the project and a way to verify changes. Keep those commands aligned with repository-owned tasks so new teammates do not need oral setup instructions.

Owned scope: `documentation.onboarding-docs`.

Offer: Offer when a new contributor cannot locate installation and execution instructions.

Input: `README.md`. Detection records the path even when its contents are malformed.

Coverage ceiling: Checks documented setup, run and verification instructions; does not execute installation or prove that the instructions work on another machine.

minimal: setup command — ["npm","install"].

mid: run command — ["npm","start"].

maximal: check command — ["npm","test"].
