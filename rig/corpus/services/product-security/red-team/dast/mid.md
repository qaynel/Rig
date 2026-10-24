# product-security.red-team.dast — mid

Dynamic security testing needs a specifically authorized target and path scope. A declared target does not prove a live scan; missing scanner or credentials must remain visible.

Policy grade, mid: Declare the authorized path scope. Scanning outside the scope is unauthorized, so list the allowed paths. Cumulative with minimal. Binding checks: dast-source-code-boundary, dast-red-team-context.
