# Rig network and secret policy

`.rig/network-policy.json` is the editable candidate. The activated bundle under
`.rig/policy/` is the only policy any decision reads, and it changes only when an
exact candidate is activated with a signature from the Gate 1 key. Editing the
candidate changes nothing until then. This guide does not change enforcement.

The shipped policy enables sanitation, drift, secret, Git, and CI controls and
denies the four protected categories — outbound network, remote content
execution, sensitive environment reads, and guardrail bypass — on the shell, web,
and MCP surfaces. Global, section, and individual switches apply the same way to
`policy status` and to every decision; a disabled control is reported as
unprotected.

What actually blocks today: the Git pre-commit secret guard, and
`rig validate-commit` for staged harness files. The shell, web, and MCP host hooks
are supported by their hosts but Rig does not install them: those surfaces are
reported as available but not integrated, and their decisions are advisory until
you wire your host's pre-tool hook to `rig policy evaluate`, which denies with a
nonzero exit. Missing or invalid activated evidence is a deny with a named reason,
never a default grant.

Model-assisted secret triage is disabled by default. Enabling it discloses that
the host model is a third party and that a submitted credential cannot be
unsent, only rotated.

Use `policy status`, `policy propose`, `policy activate`, and `policy evaluate`
through the shipped Rig runtime. Rig has one trust root, the Gate 1 key; there is
no separate policy signer and no recovery path.
