# product-security.red-team.auth-session-probe — property-floor slice

Probe session invalidation and protected-route behavior, not merely successful login. A revoked or expired session must lose access even when its cookie still exists.

Policy grade. `auth-session-probe-slice-property-floor` is a presence check for `session_cases`; it does not assert a property of session lifecycle behavior.,The separate maximal control requires `accept_revoked_session` to be false. Neither check sends requests to verify that rejection occurs.The native check is `auth-session-probe-slice-property-floor`.

The separate maximal control requires `accept_revoked_session` to be false. Neither check sends requests to verify that rejection occurs.
