# product-security.red-team.auth-session-probe - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`auth-session-probe-source-code-boundary` owns `red-team.auth-session-probe`. Given source-code is present and red-team.auth-session-probe is selected, it passes only when the repository binding evaluates red-team.auth-session-probe and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent red team concern. Evidence is recorded against `fixture:product-security.red-team.auth-session-probe:policy-boundary`; absence never becomes a pass.
