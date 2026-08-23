# Rig network and secret policy

`.rig/network-policy.json` is the only policy authority. This guide does not
change enforcement.

The shipped policy enables sanitation, drift, secret, Git, and CI controls. It
denies protected shell, web, and MCP categories until an exact candidate is
activated with a repository-bound user-presence signature.

Model-assisted secret triage is disabled by default. Enabling it discloses that
the host model is a third party and that a submitted credential cannot be
unsent, only rotated.

Use `policy status`, `policy propose`, and `policy activate` through the shipped
Rig runtime. Recovery uses a separately registered signer and the
`rig-policy-recovery` SSHSIG namespace.
