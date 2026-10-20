# product-security.red-team.abuse-resistance — mid

Model misuse and enforce bounded access at the relevant public boundary. A documented limit needs separate live evidence before it can claim effective abuse resistance.

Policy grade, mid: Declare the rate-limit policy at the public boundary. An undeclared limit means unbounded use, so state the thresholds. Cumulative with minimal. Binding checks: abuse-resistance-source-code-boundary, abuse-resistance-red-team-context.
