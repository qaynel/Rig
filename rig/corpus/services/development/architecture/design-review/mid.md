# development.architecture.design-review — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for design review; it does not widen ownership beyond architecture.design-review. For design review, inspect these context signals: tradeoffs. Binding checks: design-review-architecture-context.

Anchor the review on the existing repository's design review convention, then name the source path or command that establishes it. For design review, inspect the repository's actual spec, source, test, or configuration for tradeoffs; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring architecture services outside the design review decision for architecture.design-review.

Acceptance target: fixture:development.architecture.design-review:repository-context. Given architecture.design-review has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent architecture concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Review interfaces and explicit tradeoffs against the intended outcomes. Resolve contradictory design assumptions before implementation instead of treating an approved diagram as proof of correctness.
minimal: reviewed interfaces — ["items API"].
mid: tradeoffs — ["latency versus durability"].
maximal: unresolved tradeoffs — 0.
