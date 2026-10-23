# product-security.red-team.abuse-resistance — property-floor slice

Model misuse and enforce bounded access at the relevant public boundary. A documented limit needs separate live evidence before it can claim effective abuse resistance.

Policy grade. `abuse-resistance-slice-property-floor` checks configuration presence, not an invariant of the service.,The policy’s `unbounded_public_requests: false` control is checked at maximal grade; it still does not prove that a runtime limiter exists or is enforced.The native check is `abuse-resistance-slice-property-floor`.

The policy’s `unbounded_public_requests: false` control is checked at maximal grade; it still does not prove that a runtime limiter exists or is enforced.
