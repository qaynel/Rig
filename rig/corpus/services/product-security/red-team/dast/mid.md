# product-security.red-team.dast — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for dast; it does not widen ownership beyond red-team.dast. For dast, inspect these context signals: authorized_scope. Binding checks: dast-red-team-context.

Read the existing repository's dast convention, then name the source path or command that establishes it. For dast, inspect the repository's actual spec, source, test, or configuration for authorized_scope; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring red-team services outside the dast decision for red-team.dast.

Acceptance target: fixture:product-security.red-team.dast:repository-context. Given red-team.dast has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent red team concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Dynamic security testing needs a specifically authorized target and path scope. A declared target does not prove a live scan; missing scanner or credentials must remain visible.
minimal: target origin — "http://127.0.0.1:8080".
mid: authorized scope — ["/api"].
maximal: scan unapproved targets — false.
