# infrastructure.cicd.release-gating — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for release gating; it does not widen ownership beyond cicd.release-gating. For release gating, inspect these context signals: release_revision. Binding checks: release-gating-cicd-context.

Anchor the review on the existing repository's release gating convention, then name the source path or command that establishes it. For release gating, inspect the repository's actual spec, source, test, or configuration for release_revision; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring cicd services outside the release gating decision for cicd.release-gating.

Acceptance target: fixture:infrastructure.cicd.release-gating:repository-context. Given cicd.release-gating has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent cicd concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Bind release gates to the revision and artifact that will ship. Earlier green results do not authorize a different commit or rebuilt artifact.
minimal: required gates — ["tests","artifact digest"].
mid: release revision — "a1b2c3d".
maximal: use stale gate results — false.
