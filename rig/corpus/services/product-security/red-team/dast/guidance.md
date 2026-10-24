# Dynamic application security testing

Dynamic security testing needs a specifically authorized target and path scope. A declared target does not prove a live scan; missing scanner or credentials must remain visible.

Run dynamic security tests only against a specifically authorized target and path scope. A configured origin is not evidence that a live scan occurred.

Owned scope: `red-team.dast`. Input: `rig-services/product-security.red-team.dast.json`.

The policy declares minimal `target_origin` = "http://127.0.0.1:8080"; mid `authorized_scope` = ["/api"]; maximal `scan_unapproved_targets` = false. The native rules only check that target_origin and authorized_scope are nonempty and scan_unapproved_targets is false. They do not run a scanner or verify ownership or authorization of the target.

Replace the example origin and paths with a target explicitly approved for testing. A nonempty string does not prove the target is controlled by the repository owner. A runtime scan requires explicit target authorization, scanner availability, and evidence that requests remained inside the approved origin and paths.

Do not scan a target until authorization is established; missing tools, credentials, or scope proof are coverage gaps.
