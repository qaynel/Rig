# product-security.red-team.abuse-resistance — behavior-oracle slice

Model misuse and enforce bounded access at the relevant public boundary. A documented limit needs separate live evidence before it can claim effective abuse resistance.

Policy grade. The native rule `abuse-resistance-slice-behavior-oracle` only checks that an abuse scenario is named. It cannot show whether the service resists that scenario.,An effective behavior check would observe a rate-limit response at the declared boundary while keeping request volume and target authorization bounded.The native check is `abuse-resistance-slice-behavior-oracle`.

An effective behavior check would observe a rate-limit response at the declared boundary while keeping request volume and target authorization bounded.
