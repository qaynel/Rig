# product-security.red-team.dast — identity

Dynamic security testing needs a specifically authorized target and path scope. A declared target does not prove a live scan; missing scanner or credentials must remain visible.

Policy grade. Run dynamic security tests only against a specifically authorized target and path scope. A configured origin is not evidence that a live scan occurred.

Applicable surface: source-code. Owned scope: `red-team.dast`. Input: `rig-services/product-security.red-team.dast.json`.

Disposition: executable. The native checks validate policy configuration only; they do not demonstrate the promised red-team behavior.

The native rules only check that target_origin and authorized_scope are nonempty and scan_unapproved_targets is false. They do not run a scanner or verify ownership or authorization of the target.

Configured examples: minimal `target_origin` = "http://127.0.0.1:8080"; mid `authorized_scope` = ["/api"]; maximal `scan_unapproved_targets` = false. These are policy values, not results from an attack simulation or runtime probe.
