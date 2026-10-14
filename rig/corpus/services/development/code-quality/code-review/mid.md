# development.code-quality.code-review — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for code review; it does not widen ownership beyond code-quality.code-review. For code review, inspect these context signals: required_reviewers. Binding checks: code-review-code-quality-context.

Tie acceptance to the existing repository's code review convention, then name the source path or command that establishes it. For code review, inspect the repository's actual spec, source, test, or configuration for required_reviewers; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring code-quality services outside the code review decision for code-quality.code-review.

Acceptance target: fixture:development.code-quality.code-review:repository-context. Given code-quality.code-review has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent code quality concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Review the actual changed scope with independent ownership. At least one reviewer must resolve or explicitly disposition every finding before the change earns a clean review.
minimal: review scope — ["src"].
mid: required reviewers — 1.
maximal: unresolved findings allowed — false.
