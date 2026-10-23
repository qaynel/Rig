# product-security.red-team.abuse-resistance — identity

Model misuse and enforce bounded access at the relevant public boundary. A documented limit needs separate live evidence before it can claim effective abuse resistance.

Policy grade. Model misuse at public boundaries and define limits for requests that can consume a shared resource. A configured rate limit does not establish that the live service enforces it.

Applicable surface: source-code. Owned scope: `red-team.abuse-resistance`.

Disposition: executable. The native checks validate policy configuration only; they do not demonstrate the promised red-team behavior.

The native rules only check policy values: abuse_cases and rate_limit_policy must be nonempty, and unbounded_public_requests must be false. They do not exercise the public boundary or measure enforcement.

Configured examples: minimal `abuse_cases` = ["credential stuffing"]; mid `rate_limit_policy` = "per identity and IP"; maximal `unbounded_public_requests` = false.
