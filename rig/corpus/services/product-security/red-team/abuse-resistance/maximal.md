# product-security.red-team.abuse-resistance — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for abuse resistance. The evidence must preserve the abuse_cases, rate_limit_policy, unbounded_public_requests inputs that determined the result. Binding checks: abuse-resistance-evidence-receipt.

Read a second run against unchanged abuse resistance inputs. Record the abuse_cases, rate_limit_policy, unbounded_public_requests inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this abuse resistance result is stale. The ceiling remains: abuse resistance configuration validation only; declared policy does not prove running abuse resistance behavior. Choose a repository-owned check that observes abuse resistance from rig-services/product-security.red-team.abuse-resistance.json.

Acceptance target: fixture:product-security.red-team.abuse-resistance:evidence-replay. Given the red-team.abuse-resistance binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Model misuse and enforce bounded access at the relevant public boundary. A documented limit needs separate live evidence before it can claim effective abuse resistance.
minimal: abuse cases — ["credential stuffing"].
mid: rate limit policy — "per identity and IP".
maximal: unbounded public requests — false.
