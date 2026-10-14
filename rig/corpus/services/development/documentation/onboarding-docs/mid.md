# development.documentation.onboarding-docs — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for onboarding docs; it does not widen ownership beyond documentation.onboarding-docs. The context signals are . Binding checks: onboarding-docs-documentation-context.

Anchor the review on the existing repository's onboarding docs convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in documentation under their own verdicts.

Acceptance target: fixture:development.documentation.onboarding-docs:repository-context. Given documentation.onboarding-docs has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent documentation concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Give contributors a reproducible setup, a way to run the project and a way to verify changes. Keep those commands aligned with repository-owned tasks so new teammates do not need oral setup instructions.

Owned scope: `documentation.onboarding-docs`.

Offer: Offer when a new contributor cannot locate installation and execution instructions.

Input: `README.md`. Detection records the path even when its contents are malformed.

Coverage ceiling: Checks documented setup, run and verification instructions; does not execute installation or prove that the instructions work on another machine.

minimal: setup command — ["npm","install"].

mid: run command — ["npm","start"].

maximal: check command — ["npm","test"].
