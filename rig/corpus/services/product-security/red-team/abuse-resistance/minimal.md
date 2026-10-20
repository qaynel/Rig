# product-security.red-team.abuse-resistance — minimal

Model misuse and enforce bounded access at the relevant public boundary. A documented limit needs separate live evidence before it can claim effective abuse resistance.

Grade: minimal. Assurance remains Policy grade. `abuse-resistance-source-code-boundary` checks that `abuse_cases` is nonempty. Example: ["credential stuffing"].

List abuse scenarios that apply to the service, then compare the declared rate-limit dimensions with its actual request path. The policy check does not trace those paths. The rule proves only that a value was configured.

Catalogue policy target: `policy:product-security.red-team.abuse-resistance:minimal:abuse-resistance-source-code-boundary`. This names the policy condition; no runnable attack fixture is included here.
