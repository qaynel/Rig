# product-security.red-team.abuse-resistance — floor slice

Model misuse and enforce bounded access at the relevant public boundary. A documented limit needs separate live evidence before it can claim effective abuse resistance.

Policy grade. A rate-limit policy begins with a defined misuse case. `abuse-resistance-slice-floor` requires a nonempty `abuse_cases` entry; it does not confirm the listed case reaches a protected request path.,For a live test, exercise an approved public boundary with a bounded request pattern and confirm limits are applied. Both floor and mutation-floor map to this configuration rule (abuse-resistance-slice-floor and abuse-resistance-slice-mutation-floor); the latter name does not indicate runtime mutation.

For a live test, exercise an approved public boundary with a bounded request pattern and confirm limits are applied.
