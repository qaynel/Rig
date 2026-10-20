# product-security.red-team.abuse-resistance — maximal

Model misuse and enforce bounded access at the relevant public boundary. A documented limit needs separate live evidence before it can claim effective abuse resistance.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: abuse-resistance-source-code-boundary, abuse-resistance-red-team-context, abuse-resistance-evidence-receipt.

The native rules only check policy values: abuse_cases and rate_limit_policy must be nonempty, and unbounded_public_requests must be false. They do not exercise the public boundary or measure enforcement. To establish enforcement, send authorized requests through the real boundary and verify rate limits apply per the declared identity and IP dimensions.

Catalogue policy target: `policy:product-security.red-team.abuse-resistance:maximal:abuse-resistance-source-code-boundary+abuse-resistance-red-team-context+abuse-resistance-evidence-receipt`. Its current rule proves only that unbounded_public_requests equals false. It does not run or replay a red-team test.
