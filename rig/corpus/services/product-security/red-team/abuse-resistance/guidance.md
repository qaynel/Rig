# Abuse resistance

Model misuse and enforce bounded access at the relevant public boundary. A documented limit needs separate live evidence before it can claim effective abuse resistance.

Model misuse at public boundaries and define limits for requests that can consume a shared resource. A configured rate limit does not establish that the live service enforces it.

Owned scope: `red-team.abuse-resistance`. Input: `rig-services/product-security.red-team.abuse-resistance.json`.

The policy declares minimal `abuse_cases` = ["credential stuffing"]; mid `rate_limit_policy` = "per identity and IP"; maximal `unbounded_public_requests` = false. The native rules only check policy values: abuse_cases and rate_limit_policy must be nonempty, and unbounded_public_requests must be false. They do not exercise the public boundary or measure enforcement.

List abuse scenarios that apply to the service, then compare the declared rate-limit dimensions with its actual request path. The policy check does not trace those paths. To establish enforcement, send authorized requests through the real boundary and verify rate limits apply per the declared identity and IP dimensions.

Use an approved test environment and bounded request volume; do not probe public systems without authorization.
