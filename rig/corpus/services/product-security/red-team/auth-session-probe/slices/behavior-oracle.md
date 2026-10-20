# product-security.red-team.auth-session-probe — behavior-oracle slice

Probe session invalidation and protected-route behavior, not merely successful login. A revoked or expired session must lose access even when its cookie still exists.

Policy grade. The behavior-oracle slice currently checks only that `session_cases` is nonempty. It does not establish that an expired or revoked session loses access.,A runtime probe should exercise each declared case against protected routes and observe the authorization result.The native check is `auth-session-probe-slice-behavior-oracle`.

A runtime probe should exercise each declared case against protected routes and observe the authorization result.
