# product-security.red-team.abuse-resistance — maximal

Model misuse and enforce bounded access at the relevant public boundary. A documented limit needs separate live evidence before it can claim effective abuse resistance.

Policy grade, maximal: Set unbounded public requests to false. A public endpoint with no bound invites abuse, so enforce a limit. Cumulative with minimal and mid. Binding checks: abuse-resistance-source-code-boundary, abuse-resistance-red-team-context, abuse-resistance-evidence-receipt.
