# development.architecture.tech-debt — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for tech debt; it does not widen ownership beyond architecture.tech-debt. For tech debt, inspect these context signals: owners. Binding checks: tech-debt-architecture-context.

Read the existing repository's tech debt convention, then name the source path or command that establishes it. For tech debt, inspect the repository's actual spec, source, test, or configuration for owners; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring architecture services outside the tech debt decision for architecture.tech-debt.

Acceptance target: fixture:development.architecture.tech-debt:repository-context. Given architecture.tech-debt has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent architecture concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Define debt as an observable cost with an owner and an exit condition. A vague cleanup label without a completion condition cannot guide a useful maintenance change.
minimal: debt items — ["replace duplicated parser"].
mid: owners — ["platform"].
maximal: exit criteria — ["single parser with compatibility checks"].
