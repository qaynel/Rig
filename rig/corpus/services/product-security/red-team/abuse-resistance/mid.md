# product-security.red-team.abuse-resistance — mid

Model misuse and enforce bounded access at the relevant public boundary. A documented limit needs separate live evidence before it can claim effective abuse resistance.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: abuse-resistance-source-code-boundary, abuse-resistance-red-team-context.

List abuse scenarios that apply to the service, then compare the declared rate-limit dimensions with its actual request path. The policy check does not trace those paths. No repository-specific evidence source is supplied by this policy definition, and a nonempty value does not prove that the local boundary has been inspected.

Catalogue policy target: `policy:product-security.red-team.abuse-resistance:mid:abuse-resistance-source-code-boundary+abuse-resistance-red-team-context`. The native rule establishes only that rate_limit_policy is nonempty.
