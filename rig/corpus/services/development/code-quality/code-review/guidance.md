# code-review

Review the actual changed scope with independent ownership. At least one reviewer must resolve or explicitly disposition every finding before the change earns a clean review.

Owned scope: `code-quality.code-review`. Input: `rig-services/development.code-quality.code-review.json`.

Coverage ceiling: Configuration validation only, so it confirms review scope, reviewer count and the unresolved-findings setting are declared; it does not show the review was thorough.

minimal: review scope — ["src"]. State the changed scope under review. A review without a scope may cover nothing, so list the files or diff range actually examined.

mid: required reviewers — 1. Require at least 1 reviewer who did not author the change. Zero reviewers is self-approval, so set the minimum reviewer count to 1 or more.

maximal: unresolved findings allowed — false. Unresolved findings must not be allowed. Setting this to true lets a change merge with open findings, so resolve or explicitly disposition each one.
